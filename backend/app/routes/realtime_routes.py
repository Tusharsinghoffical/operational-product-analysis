import asyncio

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from app.core.config import settings
from app.services.realtime import realtime_manager
from app.utils.auth import decode_access_token

router = APIRouter(tags=["Realtime"])


@router.websocket("/ws/insights")
async def insights_ws(websocket: WebSocket):
    token = websocket.query_params.get("token")
    if not token:
        await websocket.close(code=1008, reason="Missing auth token")
        return

    try:
        payload = decode_access_token(token)
        user_id = int(payload.get("sub"))
    except Exception:
        await websocket.close(code=1008, reason="Invalid auth token")
        return

    await realtime_manager.connect(user_id, websocket)

    try:
        # Keep socket alive; heartbeat allows infra/proxy observability in prod.
        while True:
            await websocket.send_json({"event": "heartbeat"})
            await asyncio.sleep(settings.ws_heartbeat_seconds)
    except WebSocketDisconnect:
        realtime_manager.disconnect(user_id, websocket)
    except Exception:
        realtime_manager.disconnect(user_id, websocket)
