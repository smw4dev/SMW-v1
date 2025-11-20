# Backend/payments/services.py

"""
Thin client around SSLCommerz init / validation APIs.

Expected settings (you can map these from env):

    SSLC_STORE_ID
    SSLC_STORE_PASSWORD

    # Optional – will fall back to sandbox/live defaults if missing:
    SSLC_SANDBOX               (bool, default True)
    SSLC_INIT_URL              (override base init URL)
    SSLC_VALIDATE_URL          (override base validation URL)
    SSLC_SUCCESS_URL           (your /api/payments/ssl/success/ URL)
    SSLC_FAIL_URL              (your /api/payments/ssl/fail/ URL)
    SSLC_CANCEL_URL            (your /api/payments/ssl/cancel/ URL)
    SSLC_IPN_URL               (your /api/payments/ipn/sslcommerz/ URL)
"""

import os
import uuid
from typing import Dict, Tuple

import requests
from django.conf import settings


class SSLCommerzClient:
    def __init__(self, *, sandbox: bool | None = None) -> None:
        if sandbox is None:
            sandbox = bool(getattr(settings, "SSLC_SANDBOX", True))
        self.sandbox = sandbox

        # Credentials
        self.store_id = getattr(settings, "SSLC_STORE_ID", os.getenv("SSLC_STORE_ID", ""))
        self.store_pass = getattr(
            settings, "SSLC_STORE_PASSWORD", os.getenv("SSLC_STORE_PASSWORD", "")
        )
        if not self.store_id or not self.store_pass:
            raise RuntimeError(
                "SSLC_STORE_ID / SSLC_STORE_PASSWORD not configured in settings/env."
            )

        # Base URLs
        if self.sandbox:
            default_init = "https://sandbox.sslcommerz.com/gwprocess/v4/api.php"
            default_validate = (
                "https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php"
            )
        else:
            default_init = "https://securepay.sslcommerz.com/gwprocess/v4/api.php"
            default_validate = (
                "https://securepay.sslcommerz.com/validator/api/validationserverAPI.php"
            )

        self.init_url = getattr(settings, "SSLC_INIT_URL", default_init)
        self.validate_url = getattr(settings, "SSLC_VALIDATE_URL", default_validate)

        # Callback URLs (strongly recommended to be absolute https URLs)
        self.success_url = getattr(settings, "SSLC_SUCCESS_URL", None)
        self.fail_url = getattr(settings, "SSLC_FAIL_URL", None)
        self.cancel_url = getattr(settings, "SSLC_CANCEL_URL", None)
        self.ipn_url = getattr(settings, "SSLC_IPN_URL", None)

        for name, value in [
            ("SSLC_SUCCESS_URL", self.success_url),
            ("SSLC_FAIL_URL", self.fail_url),
            ("SSLC_CANCEL_URL", self.cancel_url),
        ]:
            if not value:
                raise RuntimeError(f"{name} must be configured in settings.")

    def start_payment(
        self,
        *,
        amount,
        currency: str,
        customer: Dict,
        product_name: str,
        meta: Dict | None = None,
    ) -> Tuple[str, Dict, Dict]:
        """
        Call SSLCommerz init API.

        Returns:
            (tran_id, payload_sent_to_ssl, ssl_response_json)
        """

        tran_id = meta.get("tran_id") if meta and meta.get("tran_id") else uuid.uuid4().hex

        payload: Dict[str, str] = {
            # Required merchant info
            "store_id": self.store_id,
            "store_passwd": self.store_pass,
            "total_amount": str(amount),
            "currency": currency,
            "tran_id": tran_id,
            "success_url": self.success_url,
            "fail_url": self.fail_url,
            "cancel_url": self.cancel_url,
        }

        if self.ipn_url:
            payload["ipn_url"] = self.ipn_url

        # Customer info (minimally required)
        payload.update(
            {
                "cus_name": customer.get("name") or "Customer",
                "cus_email": customer.get("email") or "customer@example.com",
                "cus_add1": customer.get("address") or "N/A",
                "cus_city": customer.get("city") or "N/A",
                "cus_postcode": customer.get("postcode") or "N/A",
                "cus_country": customer.get("country") or "Bangladesh",
                "cus_phone": customer.get("phone") or "01700000000",
            }
        )

        # Product info
        payload.update(
            {
                "shipping_method": "NO",
                "product_name": product_name,
                "product_category": "Service",
                "product_profile": "general",
            }
        )

        if meta:
            # You can optionally attach your own metadata into payload as well
            # (prefix keys if needed to avoid clashes)
            pass

        resp = requests.post(self.init_url, data=payload, timeout=20)
        resp.raise_for_status()
        data = resp.json()
        return tran_id, payload, data

    def validate(self, *, val_id: str) -> Dict:
        """
        Call SSLCommerz validation API using val_id.
        """
        params = {
            "val_id": val_id,
            "store_id": self.store_id,
            "store_passwd": self.store_pass,
            "format": "json",
        }
        resp = requests.get(self.validate_url, params=params, timeout=20)
        resp.raise_for_status()
        return resp.json()
