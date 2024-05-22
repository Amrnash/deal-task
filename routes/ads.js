import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { Ad } from "../models/ad.js";
import { requireRole } from "../middlewares/requireRole.js";

const router = Router();

router.post(
  "/",
  authMiddleware,
  requireRole("AGENT"),
  async (req, res, next) => {
    try {
      const ad = new Ad(req.body);
      Ad.createdBy = req.user.userId;
      await ad.save();
      res.send({ message: "ad added successfully", ad });
    } catch (err) {
      next(err);
    }
  }
);

export { router as adsRouter };
