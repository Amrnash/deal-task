import { createrError } from "../utils/createError";

export function requireRole(requiredRole) {
  return (req, res, next) => {
    const hasRequiredRole = req.user.role === requiredRole;
    if (!hasRequiredRole) throw new createrError("forbidden", 403);
    next();
  };
}
