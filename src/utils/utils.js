export function stripEmail(email) {
  // Split the email address at the "@" sign
  const parts = email.split('@');

  // Return the part before the "@" sign
  return parts[0];
}
