import { Router } from "express";
import { User } from "../models/user.js";
import { createrError } from "../utils/createError.js";
import jwt from "jsonwebtoken";

const router = Router();

router.post("/register", async (req, res, next) => {
  try {
    const { name, password, phone, role } = req.body;

    // if (role === "ADMIN")
    //   throw createrError("role cannot be set to ADMIN", 400);
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      throw createrError("user already exists", 400);
    }

    const user = new User({ name, password, phone, role });
    await user.save();
    const token = jwt.sign(
      { userId: user._id, roles: user.role },
      process.env.JWT_SECRET
    );
    return res
      .status(201)
      .send({ message: "User registered successfully", token });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { phone, password } = req.body;
    const user = await User.findOne({ phone });
    if (!user) {
      throw createrError("Invalid username or password", 400);
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw createrError("Invalid username or password", 400);
    }

    const token = jwt.sign(
      { userId: user._id, roles: user.role },
      process.env.JWT_SECRET
    );

    return res.json({ token });
  } catch (error) {
    next(error);
  }
});
export { router as usersRouter };
