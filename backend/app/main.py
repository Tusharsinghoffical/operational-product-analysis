import logging
import time
import uuid

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.database.db import init_shared_database
from app.routes import data_routes, insight_routes, auth_routes, realtime_routes
from app.core.config import settings

# Initialize shared database (users table)
init_shared_database()

logging.basicConfig(
    level=getattr(logging, settings.log_level.upper(), logging.INFO),
    format="%(asctime)s %(levelname)s %(message)s",
)
logger = logging.getLogger("opsense")

app = FastAPI(title=settings.app_name, debug=settings.debug)

# CORS middleware - allows frontend to communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def request_context_middleware(request: Request, call_next):
    request_id = str(uuid.uuid4())
    start = time.perf_counter()
    try:
        response = await call_next(request)
    except Exception:
        logger.exception("Unhandled request error", extra={"request_id": request_id})
        return JSONResponse(
            status_code=500,
            content={"detail": "Internal server error", "request_id": request_id},
        )

    duration_ms = round((time.perf_counter() - start) * 1000, 2)
    response.headers["X-Request-ID"] = request_id
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["X-Response-Time-ms"] = str(duration_ms)

    logger.info(
        "%s %s %s %sms",
        request.method,
        request.url.path,
        response.status_code,
        duration_ms,
    )
    return response

# Include routers
app.include_router(auth_routes.router)
app.include_router(insight_routes.router)
app.include_router(data_routes.router)
app.include_router(realtime_routes.router)


@app.get("/healthz")
def healthz():
    return {"status": "ok", "service": settings.app_name}


@app.get("/readyz")
def readyz():
    # DB init is performed on startup; keeping endpoint explicit for orchestration.
    return {"status": "ready"}

@app.get("/")
def home():
    return {"message": "Opsense API running successfully"}
