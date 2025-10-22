import uuid, requests
from django.conf import settings

def sslc_urls():
    base = settings.SSLC_BASE_URL
    return {
        "session": f"{base}/gwprocess/v4/api.php",  # session init
        "validate_live": "https://securepay.sslcommerz.com/validator/api/validationserverAPI.php",
        "validate_sandbox": "https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php",
    }

def new_tran_id(prefix="ADM"):
    return f"{prefix}-{uuid.uuid4().hex[:12]}"

def validate_with_val_id(val_id: str):
    # Always call the proper validator (live/sandbox) with store creds
    validator = sslc_urls()["validate_live"] if settings.SSLC_IS_LIVE else sslc_urls()["validate_sandbox"]
    params = {
        "val_id": val_id,
        "store_id": settings.SSLC_STORE_ID,
        "store_passwd": settings.SSLC_STORE_PASS,
        "v": 1,
        "format": "json",
    }
    r = requests.get(validator, params=params, timeout=20)
    r.raise_for_status()
    return r.json()
