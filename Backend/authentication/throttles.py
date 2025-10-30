from rest_framework.throttling import AnonRateThrottle

class RegistrationRateThrottle(AnonRateThrottle):
    scope = 'registration'