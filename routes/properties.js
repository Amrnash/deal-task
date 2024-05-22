import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { Property } from "../models/property.js";
import { requireRole } from "../middlewares/requireRole.js";
import { createrError } from "../utils/createError.js";

const router = Router();

router.post(
  "/",
  authMiddleware,
  requireRole("CLIENT"),
  async (req, res, next) => {
    try {
      const property = new Property(req.body);
      property.createdBy = req.user.userId;
      await property.save();
      res.send({ message: "request added successfully", property });
    } catch (err) {
      next(err);
    }
  }
);

router.patch(
  "/:id",
  authMiddleware,
  requireRole("CLIENT"),
  async (req, res, next) => {
    try {
      const updatedProperty = await Property.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!updatedProperty) {
        throw createrError("property request does not exist", 400);
      }
      res.send({ message: "request updated successfully", updatedProperty });
    } catch (err) {
      next(err);
    }
  }
);

export { router as properyRouter };
