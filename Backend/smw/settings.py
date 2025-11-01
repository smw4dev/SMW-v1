"""
Django settings for smw project (PostgreSQL, DRF, JWT, CORS, optional Celery).
12-factor: prefer env for everything; sensible fallbacks for dev.
"""

from pathlib import Path
import os
from dotenv import load_dotenv
from datetime import timedelta
from urllib.parse import urlparse

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")

# ---------------------------------------------------------------------
# Core / Security
# ---------------------------------------------------------------------
SECRET_KEY = os.getenv("DJANGO_SECRET_KEY", "change-me")
DEBUG = os.getenv("DJANGO_DEBUG", "false").lower() in ("1", "true", "yes")

# Allowed hosts
_allowed_hosts_env = os.getenv("DJANGO_ALLOWED_HOSTS", "").strip()
ALLOWED_HOSTS = (
    [h.strip() for h in _allowed_hosts_env.split(",") if h.strip()]
    if _allowed_hosts_env
    else (["127.0.0.1", "localhost"] if DEBUG else [])
)

# CSRF trusted origins (explicit env wins; else derive from ALLOWED_HOSTS)
_csrf_env = os.getenv("CSRF_TRUSTED_ORIGINS", "").strip()
if _csrf_env:
    CSRF_TRUSTED_ORIGINS = [o.strip() for o in _csrf_env.split(",") if o.strip()]
else:
    CSRF_TRUSTED_ORIGINS = [f"https://{h}" for h in ALLOWED_HOSTS if h not in ("127.0.0.1", "localhost")] + [
        "https://securepay.sslcommerz.com",
        "https://sandbox.sslcommerz.com",
        "https://*.sslcommerz.com",
    ]

# Production security toggles (safe defaults; can relax in dev via env)
SECURE_SSL_REDIRECT = os.getenv("SECURE_SSL_REDIRECT", "true").lower() in ("1", "true", "yes")
SESSION_COOKIE_SECURE = os.getenv("SESSION_COOKIE_SECURE", "true").lower() in ("1", "true", "yes")
CSRF_COOKIE_SECURE = os.getenv("CSRF_COOKIE_SECURE", "true").lower() in ("1", "true", "yes")
SECURE_HSTS_SECONDS = int(os.getenv("SECURE_HSTS_SECONDS", "31536000"))
SECURE_HSTS_INCLUDE_SUBDOMAINS = os.getenv("SECURE_HSTS_INCLUDE_SUBDOMAINS", "true").lower() in ("1", "true", "yes")
SECURE_HSTS_PRELOAD = os.getenv("SECURE_HSTS_PRELOAD", "true").lower() in ("1", "true", "yes")
SECURE_REFERRER_POLICY = os.getenv("SECURE_REFERRER_POLICY", "strict-origin-when-cross-origin")

_proxy_hdr = os.getenv("SECURE_PROXY_SSL_HEADER", "")
if _proxy_hdr:
    try:
        name, value = [x.strip() for x in _proxy_hdr.split(",", 1)]
        SECURE_PROXY_SSL_HEADER = (name, value)
    except ValueError:
        pass  # ignore malformed; better to fail open than crash at import

# ---------------------------------------------------------------------
# Applications
# ---------------------------------------------------------------------
INSTALLED_APPS = [
    # Django
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    # Third-party
    "rest_framework",
    "corsheaders",

    # Local apps
    "authentication",
    "users",
    "admissions",
    "courses_app",
    "financials",
]

AUTH_USER_MODEL = "authentication.User"

# ---------------------------------------------------------------------
# REST Framework / JWT
# ---------------------------------------------------------------------
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": (
        "rest_framework.permissions.AllowAny",
    ),
}

# JWT lifetimes configurable via env
JWT_ACCESS_TTL_MIN = int(os.getenv("JWT_ACCESS_TTL_MIN", "60"))
JWT_REFRESH_TTL_DAYS = int(os.getenv("JWT_REFRESH_TTL_DAYS", "7"))
SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=JWT_ACCESS_TTL_MIN),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=JWT_REFRESH_TTL_DAYS),
}

# ---------------------------------------------------------------------
# Middleware
# ---------------------------------------------------------------------
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "corsheaders.middleware.CorsMiddleware",  # keep CORS near top
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "smw.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "smw.wsgi.application"

# ---------------------------------------------------------------------
# Database
# Prefer DATABASE_URL; fallback to discrete vars
# ---------------------------------------------------------------------
DATABASE_URL = os.getenv("DATABASE_URL", "").strip()
if DATABASE_URL:
    # Minimal parser to support postgres/mysql/sqlite URLs without dj_database_url
    parsed = urlparse(DATABASE_URL)
    if parsed.scheme.startswith("sqlite"):
        DATABASES = {
            "default": {
                "ENGINE": "django.db.backends.sqlite3",
                "NAME": parsed.path if parsed.path else BASE_DIR / "db.sqlite3",
            }
        }
    else:
        ENGINE_MAP = {
            "postgres": "django.db.backends.postgresql",
            "postgresql": "django.db.backends.postgresql",
            "pgsql": "django.db.backends.postgresql",
            "mysql": "django.db.backends.mysql",
        }
        ENGINE = ENGINE_MAP.get(parsed.scheme, "django.db.backends.postgresql")
        DB_NAME = parsed.path.lstrip("/")
        DATABASES = {
            "default": {
                "ENGINE": ENGINE,
                "NAME": DB_NAME,
                "USER": parsed.username or "",
                "PASSWORD": parsed.password or "",
                "HOST": parsed.hostname or "127.0.0.1",
                "PORT": str(parsed.port or ""),
            }
        }
else:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.postgresql",
            "NAME": os.getenv("DBNAME", "smw_db"),
            "USER": os.getenv("DBUSER", "postgres"),
            "PASSWORD": os.getenv("DBPASSWORD", ""),
            "HOST": os.getenv("DBHOST", "127.0.0.1"),
            "PORT": os.getenv("DBPORT", "5432"),
        }
    }

# ---------------------------------------------------------------------
# Password validation
# ---------------------------------------------------------------------
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# ---------------------------------------------------------------------
# Internationalization
# ---------------------------------------------------------------------
LANGUAGE_CODE = os.getenv("DJANGO_LANGUAGE_CODE", "en-us")
TIME_ZONE = os.getenv("DJANGO_TIME_ZONE", "UTC")
USE_I18N = True
USE_TZ = True

# ---------------------------------------------------------------------
# Static / Media
# ---------------------------------------------------------------------
STATIC_URL = os.getenv("DJANGO_STATIC_URL", "/static/")
MEDIA_URL = os.getenv("DJANGO_MEDIA_URL", "/media/")
STATIC_ROOT = BASE_DIR / "staticfiles"
MEDIA_ROOT = BASE_DIR / "media"

# ---------------------------------------------------------------------
# CORS
# ---------------------------------------------------------------------
_cors = os.getenv("CORS_ALLOWED_ORIGINS", "").strip()
CORS_ALLOWED_ORIGINS = [o.strip() for o in _cors.split(",") if o.strip()] if _cors else []
_cors_regex = os.getenv("CORS_ALLOWED_ORIGIN_REGEXES", "").strip()
CORS_ALLOWED_ORIGIN_REGEXES = [r.strip() for r in _cors_regex.split(",") if r.strip()] if _cors_regex else []
CORS_ALLOW_CREDENTIALS = True

# ---------------------------------------------------------------------
# Celery (optional)
# ---------------------------------------------------------------------
CELERY_BROKER_URL = os.getenv("CELERY_BROKER_URL", "")
CELERY_RESULT_BACKEND = os.getenv("CELERY_RESULT_BACKEND", "")
CELERY_TIMEZONE = TIME_ZONE

# ---------------------------------------------------------------------
# Email (optional)
# ---------------------------------------------------------------------
EMAIL_BACKEND = os.getenv("EMAIL_BACKEND", "django.core.mail.backends.console.EmailBackend" if DEBUG else "django.core.mail.backends.smtp.EmailBackend")
EMAIL_HOST = os.getenv("EMAIL_HOST", "")
EMAIL_PORT = int(os.getenv("EMAIL_PORT", "587"))
EMAIL_HOST_USER = os.getenv("EMAIL_HOST_USER", "")
EMAIL_HOST_PASSWORD = os.getenv("EMAIL_HOST_PASSWORD", "")
EMAIL_USE_TLS = os.getenv("EMAIL_USE_TLS", "true").lower() in ("1", "true", "yes")
DEFAULT_FROM_EMAIL = os.getenv("DEFAULT_FROM_EMAIL", "webmaster@localhost")

# ---------------------------------------------------------------------
# Default PK
# ---------------------------------------------------------------------
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# ---------------------------------------------------------------------
# SSLCommerz
# ---------------------------------------------------------------------
SSLC_IS_LIVE = os.getenv("SSLC_IS_LIVE", "false").lower() in ("1", "true", "yes")
SSLC_BASE_URL = "https://securepay.sslcommerz.com" if SSLC_IS_LIVE else "https://sandbox.sslcommerz.com"
SSLC_STORE_ID = os.getenv("SSLC_STORE_ID", "")
SSLC_STORE_PASS = os.getenv("SSLC_STORE_PASS", "")

SITE_BASE_URL = os.getenv("SITE_BASE_URL", "http://127.0.0.1:8000")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://127.0.0.1:3000")

SSLC_SUCCESS_PATH = os.getenv("SSLC_SUCCESS_PATH", "/payments/ssl/success/")
SSLC_FAIL_PATH    = os.getenv("SSLC_FAIL_PATH", "/payments/ssl/fail/")
SSLC_CANCEL_PATH  = os.getenv("SSLC_CANCEL_PATH", "/payments/ssl/cancel/")
SSLC_IPN_PATH     = os.getenv("SSLC_IPN_PATH", "/api/payments/ipn/sslcommerz/")

# Fully-qualified callback URLs you can pass to create/init txn
SSLC_SUCCESS_URL = f"{SITE_BASE_URL.rstrip('/')}{SSLC_SUCCESS_PATH}"
SSLC_FAIL_URL    = f"{SITE_BASE_URL.rstrip('/')}{SSLC_FAIL_PATH}"
SSLC_CANCEL_URL  = f"{SITE_BASE_URL.rstrip('/')}{SSLC_CANCEL_PATH}"
SSLC_IPN_URL     = f"{SITE_BASE_URL.rstrip('/')}{SSLC_IPN_PATH}"

# ---------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------
DJANGO_LOG_LEVEL = os.getenv("DJANGO_LOG_LEVEL", "INFO").upper()
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "simple": {"format": "[{levelname}] {name}: {message}", "style": "{"},
        "verbose": {"format": "[{levelname}] {asctime} {name} {module}:{lineno} – {message}", "style": "{"},
    },
    "handlers": {
        "console": {"class": "logging.StreamHandler", "formatter": "simple"},
    },
    "root": {"handlers": ["console"], "level": DJANGO_LOG_LEVEL},
}

