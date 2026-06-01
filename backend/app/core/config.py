import os
from typing import List


def _parse_csv_env(value: str) -> List[str]:
    return [item.strip() for item in value.split(",") if item.strip()]


class Settings:
    """
    Lightweight settings loader for production-friendly configuration.
    """

    def __init__(self) -> None:
        self.app_name = os.getenv("APP_NAME", "OpSense API")
        self.app_env = os.getenv("APP_ENV", "development")
        self.debug = os.getenv("DEBUG", "false").lower() == "true"
        self.log_level = os.getenv("LOG_LEVEL", "INFO")

        self.jwt_secret_key = os.getenv("JWT_SECRET_KEY", "your-secret-key-change-in-production")
        self.jwt_algorithm = os.getenv("JWT_ALGORITHM", "HS256")
        self.jwt_expire_minutes = int(os.getenv("JWT_EXPIRE_MINUTES", str(60 * 24 * 7)))

        cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://localhost:3001")
        self.cors_origins = _parse_csv_env(cors_origins)

        self.ws_heartbeat_seconds = int(os.getenv("WS_HEARTBEAT_SECONDS", "25"))


settings = Settings()
