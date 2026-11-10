"""Dummy login-attempt limits for the MergeJudge proof-test smoke (bot-context#58). No real data."""

MAX_ATTEMPTS = 3


def can_retry(attempts, max_attempts=MAX_ATTEMPTS):
    """True if another login attempt is allowed after `attempts` failed ones."""
    return attempts < max_attempts
