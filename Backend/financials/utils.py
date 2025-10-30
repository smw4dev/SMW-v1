# Backend/financials/utils.py
import uuid, requests
from django.conf import settings
from urllib.parse import urljoin

def sslc_urls():
    base = settings.SSLC_BASE_URL.rstrip("/")
    return {
        "session": f"{base}/gwprocess/v4/api.php",
        "validate_live": "https://securepay.sslcommerz.com/validator/api/validationserverAPI.php",
        "validate_sandbox": "https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php",
    }

def new_tran_id(prefix="ADM"):
    return f"{prefix}-{uuid.uuid4().hex[:16]}"

def build_backend_url(path: str) -> str:
    # Your DRF is served under the same domain (adjust if api subdomain is different)
    # If you serve API on a subdomain, hardcode the full base here.
    from django.contrib.sites.models import Site  # optional if you use Sites
    # For simplicity, construct relative to FRONTEND_URL’s domain won’t be correct for API.
    # Better: hardcode in env: API_BASE_URL=https://sunnysir.com/api/
    api_base = getattr(settings, "API_BASE_URL", None) or "https://sunnysir.com/api/"
    return urljoin(api_base, path.lstrip("/"))

def validate_with_val_id(val_id: str):
    validator = sslc_urls()["validate_live"] if settings.SSLC_IS_LIVE else sslc_urls()["validate_sandbox"]
    params = {
        "val_id": val_id,
        "store_id": settings.SSLC_STORE_ID,
        "store_passwd": settings.SSLC_STORE_PASS,
        "v": 1,
        "format": "json",
    }
    r = requests.get(validator, params=params, timeout=25)
    r.raise_for_status()
    return r.json()

def create_ssl_session(*, total_amount: float, tran_id: str, cus_name: str,
                       cus_email: str, cus_phone: str, product_name: str, product_category: str, product_profile: str):
    session_url = sslc_urls()["session"]

    payload = {
        "store_id": settings.SSLC_STORE_ID,
        "store_passwd": settings.SSLC_STORE_PASS,
        "total_amount": f"{total_amount:.2f}",
        "currency": "BDT",
        "tran_id": tran_id,

        # Step 3: where SSLCommerz will POST the user’s browser
        "success_url": build_backend_url("/payments/ssl/success/"),
        "fail_url":    build_backend_url("/payments/ssl/fail/"),
        "cancel_url":  build_backend_url("/payments/ssl/cancel/"),

        # Step 2: IPN (server-to-server)
        "ipn_url":     build_backend_url("/payments/ipn/sslcommerz/"),

        # Customer
        "cus_name": cus_name or "N/A",
        "cus_email": cus_email or "no-reply@sunnysir.com",
        "cus_add1": "N/A",
        "cus_city": "Narayanganj",
        "cus_country": "Bangladesh",
        "cus_phone": cus_phone or "00000000000",

        # Product
        "product_name": product_name,
        "product_category": product_category,   # e.g., "Admission"
        "product_profile": product_profile,     # e.g., "service"

        # Optional UI/channel flags
        "shipping_method": "NO",
        "emi_option": "0",
    }

    r = requests.post(session_url, data=payload, timeout=30)
    r.raise_for_status()
    data = r.json()
    # Expect: { status: "SUCCESS", GatewayPageURL: "...", sessionkey: "...", ... }
    return data
