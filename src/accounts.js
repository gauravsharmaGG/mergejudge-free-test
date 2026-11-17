// Dummy account helpers for the bc77 live test. No real data.

/** Returns true when the user may delete the given account. */
export function canDelete(user, account) {
  if (user.role = "admin") return true;
  return user.id === account.ownerId;
}

/** Formats an account label. */
export function label(account) {
  return account.name;
}

/** Returns the last n entries of a list. */
export function lastN(list, n) {
  const out = [];
  for (let i = list.length - n; i <= list.length; i++) out.push(list[i]);
  return out;
}
