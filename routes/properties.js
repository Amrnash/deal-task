import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { Property } from "../models/property.js";
import { requireRole } from "../middlewares/requireRole.js";
import { createrError } from "../utils/createError.js";

const router = Router();

/**
 * @swagger
 * /property:
 *   post:
 *     summary: Creates a property request
 *     security:
 *       - Authorization: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               propertyType:
 *                 type: string
 *                 example: "Apartment"
 *               area:
 *                 type: string
 *                 example: "1200 sqft"
 *               price:
 *                 type: number
 *                 example: 250000
 *               city:
 *                 type: string
 *                 example: "New York"
 *               district:
 *                 type: string
 *                 example: "Manhattan"
 *               description:
 *                 type: string
 *                 example: "A beautiful apartment in the heart of the city."
 *     responses:
 *       200:
 *         description: Request created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 propertyType:
 *                   type: string
 *                   example: "Apartment"
 *                 area:
 *                   type: string
 *                   example: "1200 sqft"
 *                 price:
 *                   type: number
 *                   example: 250000
 *                 city:
 *                   type: string
 *                   example: "New York"
 *                 district:
 *                   type: string
 *                   example: "Manhattan"
 *                 description:
 *                   type: string
 *                   example: "A beautiful apartment in the heart of the city."
 */
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
