import { authMiddleware } from "../middlewares/authMiddleware.js";
import { requireRole } from "../middlewares/requireRole.js";
import { User } from "../models/user.js";
import { Ad } from "../models/ad.js";
import { Property } from "../models/property.js";
import { Router } from "express";

const router = Router();
router.get(
  "/:userId",
  authMiddleware,
  requireRole("ADMIN"),
  async (req, res, next) => {
    try {
      const userId = req.params.userId;
      const user = await User.findById(userId);
      let collection;
      if (user.role === "AGENT") collection = Ad;
      else if (user.role === "CLIENT") collection = Property;

      const pipeline = [
        {
          $facet: {
            totalDocs: [
              {
                $count:
                  user.role === "AGENT"
                    ? "totalAdsAmount"
                    : "totalRequestsAmount",
              },
            ],
            filteredDocs: [
              { $match: { createdBy: user._id } },
              { $count: user.role === "AGENT" ? "adsCount" : "requestsCount" },
            ],
          },
        },
      ];
      const stats = (await collection.aggregate(pipeline))[0];

      const userData = user.toObject();
      delete userData.password;

      const response = {
        ...userData,
        ...stats.filteredDocs[0],
        ...stats.totalDocs[0],
      };
      res.send({ data: response });
    } catch (err) {
      next(err);
    }
  }
);

export { router as statsRouter };
