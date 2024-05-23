import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { Ad } from "../models/ad.js";
import { requireRole } from "../middlewares/requireRole.js";
import { Property } from "../models/property.js";

const router = Router();

router.post(
  "/",
  authMiddleware,
  requireRole("AGENT"),
  async (req, res, next) => {
    try {
      const ad = new Ad(req.body);
      ad.createdBy = req.user.userId;
      await ad.save();
      res.send({ message: "ad added successfully", ad });
    } catch (err) {
      next(err);
    }
  }
);

router.get("/:id/match-requests", async (req, res, next) => {
  try {
    const { pageNumber = 1, pageSize = 10 } = req.query;
    const ad = await Ad.findById(req.params.id);

    const priceTolerance = ad.price * 0.1;
    const matchStage = {
      $match: {
        district: ad.district,
        area: ad.area,
        price: {
          $lte: ad.price + priceTolerance,
          $gte: ad.price - priceTolerance,
        },
      },
    };

    const matchedPropertyRequests = await Property.aggregate([
      matchStage,
      { $sort: { refreshedAt: -1 } },
      { $skip: (pageNumber - 1) * pageSize },
      { $limit: pageSize },
    ]);

    res.send({ data: matchedPropertyRequests });
  } catch (err) {
    next(err);
  }
});

export { router as adsRouter };
