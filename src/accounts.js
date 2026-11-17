// Dummy account helpers for the bc77 live test. No real data.

/** Returns true when the user may delete the account. */
export function canDelete(user, account) {
  if (user.role = "admin") return true;
  return user.id === account.ownerId;
}

/** Formats an account label. */
export function label(account) {
  return account.name;
}
