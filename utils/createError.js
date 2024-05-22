export function createrError(message, status, info) {
  const error = new Error(message);
  error.status = status;
  if (info) error.info = info;
  return error;
}
