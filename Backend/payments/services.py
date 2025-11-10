import requests
import uuid
from urllib.parse import urljoin
from django.conf import settings

class SSLCommerzClient:
    def __init__(self):
        self.base = settings.SSLC_API_URL.rstrip("/")
        self.store_id = settings.SSLC_STORE_ID
        self.store_pass = settings.SSLC_STORE_PASS

        # Endpoints
        self.init_url = f"{self.base}/gwprocess/v4/api.php"
        self.validate_url = f"{self.base}/validator/api/validationserverAPI.php"

    def _callback_urls(self):
        # Build fully-qualified callback URLs
        return {
            "success_url": urljoin(settings.SITE_BASE_URL, settings.SSLC_SUCCESS_PATH.lstrip("/")),
            "fail_url":    urljoin(settings.SITE_BASE_URL, settings.SSLC_FAIL_PATH.lstrip("/")),
            "cancel_url":  urljoin(settings.SITE_BASE_URL, settings.SSLC_CANCEL_PATH.lstrip("/")),
            "ipn_url":     urljoin(settings.API_BASE_URL,  settings.SSLC_IPN_PATH.lstrip("/")),
        }

    def start_payment(self, *, amount, currency="BDT", customer, tran_id=None, product_name="Admission Fee"):
        """
        Returns dict from SSLCommerz containing GatewayPageURL, status, etc.
        """
        if tran_id is None:
            tran_id = uuid.uuid4().hex

        cb = self._callback_urls()

        payload = {
            "store_id": self.store_id,
            "store_passwd": self.store_pass,
            "total_amount": f"{amount:.2f}",
            "currency": currency,
            "tran_id": tran_id,

            # Required callback URLs
            "success_url": cb["success_url"],
            "fail_url": cb["fail_url"],
            "cancel_url": cb["cancel_url"],
            "ipn_url": cb["ipn_url"],

            # Customer info (minimally required)
            "cus_name":  customer.get("name") or "Customer",
            "cus_email": customer.get("email") or "customer@example.com",
            "cus_add1":  customer.get("address") or "N/A",
            "cus_city":  customer.get("city") or "N/A",
            "cus_postcode": customer.get("postcode") or "N/A",
            "cus_country": customer.get("country") or "Bangladesh",
            "cus_phone": customer.get("phone") or "01700000000",

            # Product info
            "shipping_method": "NO",
            "product_name": product_name,
            "product_category": "Service",
            "product_profile": "general",
        }

        resp = requests.post(self.init_url, data=payload, timeout=20)
        resp.raise_for_status()
        data = resp.json()
        return tran_id, payload, data

    def validate(self, *, val_id):
        params = {
            "val_id": val_id,
            "store_id": self.store_id,
            "store_passwd": self.store_pass,
            "format": "json",
        }
        resp = requests.get(self.validate_url, params=params, timeout=20)
        resp.raise_for_status()
        return resp.json()
