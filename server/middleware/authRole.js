// middleware/authorizeRole.js

export const authorizeRole = (requiredRole) => {
  return (req, res, next) => {
    try {
      // req.user is attached by verifyToken middleware
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized: No user found" });
      }

      if (req.user.role !== requiredRole) {
        return res.status(403).json({ message: "Forbidden: Insufficient permissions" });
      }

      next();
    } catch (error) {
      console.error("Error in authorizeRole middleware:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
};
