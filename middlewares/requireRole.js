import { createrError } from "../utils/createError.js";

export function requireRole(requiredRole) {
  return (req, res, next) => {
    const isAdmin = req.user.role === "ADMIN";
    const hasRequiredRole = req.user.role === requiredRole;
    if (!hasRequiredRole && !isAdmin) throw new createrError("forbidden", 403);
    next();
  };
}
