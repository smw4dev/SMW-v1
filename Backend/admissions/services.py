# Backend/payments/services.py

import os
import logging
from decimal import Decimal

import requests
from django.conf import settings

logger = logging.getLogger(__name__)


def sslcz_is_sandbox() -> bool:
    """
    Decide sandbox vs live based on env or Django settings.
    """
    env_flag = os.getenv("SSLCZ_SANDBOX", "true").lower()
    return env_flag in ("1", "true", "yes")


def sslcz_base_url() -> str:
    """
    Base domain for SSLCOMMERZ depending on env.
    """
    if sslcz_is_sandbox():
        return "https://sandbox.sslcommerz.com"
    return "https://securepay.sslcommerz.com"


def sslcz_order_validate(val_id: str) -> dict:
    """
    Call SSLCOMMERZ order validation API and return parsed JSON.

    Raises requests.HTTPError if HTTP fails, or ValueError if response invalid.
    """
    base = sslcz_base_url()
    url = f"{base}/validator/api/validationserverAPI.php"

    store_id = os.getenv("SSLCZ_STORE_ID") or getattr(settings, "SSLCZ_STORE_ID", None)
    store_passwd = os.getenv("SSLCZ_STORE_PASSWORD") or getattr(settings, "SSLCZ_STORE_PASSWORD", None)
    if not store_id or not store_passwd:
        raise RuntimeError("SSLCOMMERZ credentials not configured (SSLCZ_STORE_ID / SSLCZ_STORE_PASSWORD)")

    params = {
        "val_id": val_id,
        "store_id": store_id,
        "store_passwd": store_passwd,
        "v": 1,
        "format": "json",
    }

    logger.info("Calling SSLCommerz validation API", extra={"url": url, "val_id": val_id})

    resp = requests.get(url, params=params, timeout=15)
    resp.raise_for_status()
    data = resp.json()

    if "status" not in data:
        raise ValueError(f"Invalid response from SSLCommerz validator: {data}")

    return data


def sslcz_verify_against_payment(validation: dict, payment) -> bool:
    """
    Verify that validator response matches our Payment record.
    Returns True if everything matches and is safe to mark SUCCESS.
    """

    status = validation.get("status")
    risk_level = str(validation.get("risk_level", "0"))
    amount = Decimal(str(validation.get("amount")))
    currency = validation.get("currency")
    tran_id = validation.get("tran_id")

    # 1) Transaction status + risk
    if status not in ("VALID", "VALIDATED"):
        logger.warning("SSLCommerz validation status not valid", extra={"status": status, "tran_id": tran_id})
        return False

    # Risky transactions can be treated as ON_HOLD instead if you want
    if risk_level != "0":
        logger.warning(
            "SSLCommerz transaction marked as risky",
            extra={"risk_level": risk_level, "tran_id": tran_id},
        )
        return False

    # 2) Match our internal payment record
    if tran_id != payment.tran_id:
        logger.error(
            "SSLCommerz tran_id mismatch",
            extra={"validation_tran_id": tran_id, "payment_tran_id": payment.tran_id},
        )
        return False

    if amount != payment.amount:
        logger.error(
            "SSLCommerz amount mismatch",
            extra={"validation_amount": str(amount), "payment_amount": str(payment.amount)},
        )
        return False

    if currency != payment.currency:
        logger.error(
            "SSLCommerz currency mismatch",
            extra={"validation_currency": currency, "payment_currency": payment.currency},
        )
        return False

    return True
