import json
from collections import defaultdict
from datetime import datetime
from typing import Dict, Set

from fastapi import WebSocket


class RealtimeManager:
    """
    User-scoped websocket connection manager for dashboard updates.
    """

    def __init__(self) -> None:
        self._connections: Dict[int, Set[WebSocket]] = defaultdict(set)

    async def connect(self, user_id: int, websocket: WebSocket) -> None:
        await websocket.accept()
        self._connections[user_id].add(websocket)

    def disconnect(self, user_id: int, websocket: WebSocket) -> None:
        if user_id in self._connections:
            self._connections[user_id].discard(websocket)
            if not self._connections[user_id]:
                del self._connections[user_id]

    async def broadcast_user_event(self, user_id: int, event: str, payload: dict) -> None:
        if user_id not in self._connections:
            return
        message = json.dumps(
            {
                "event": event,
                "payload": payload,
                "timestamp": datetime.utcnow().isoformat(),
            }
        )
        stale_sockets = []
        for websocket in self._connections[user_id]:
            try:
                await websocket.send_text(message)
            except Exception:
                stale_sockets.append(websocket)

        for websocket in stale_sockets:
            self.disconnect(user_id, websocket)


realtime_manager = RealtimeManager()
