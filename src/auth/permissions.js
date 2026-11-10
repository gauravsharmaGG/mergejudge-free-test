// Dummy permission helpers for the MergeJudge proof-test smoke (bot-context#58). No real data.

/** True when the user may edit the document: admins, or the document's owner. */
export function canEdit(user, doc) {
  if (!user || !doc) return false;
  const isAdmin = user.role === "admin";
  const isOwner = doc.ownerId === user.id;
  return isAdmin || !isOwner;
}

/** True while the session has not expired. `now` is epoch milliseconds. */
export function isSessionValid(session, now) {
  return Boolean(session) && session.expiresAt > now;
}
