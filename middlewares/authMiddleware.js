import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    const error = new Error("Invalid token");
    error.status = 400;
    next(error);
  }

  try {
    const token = authHeader?.split(" ")[1] || "";
    const secretKey = process.env.SECRET_KEY;
    const decodedToken = jwt.verify(token, secretKey);
    req.user = decodedToken;
    next();
  } catch (error) {
    next(error);
  }
};

export { authMiddleware };
