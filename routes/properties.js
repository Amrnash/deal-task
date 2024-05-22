import { Router } from "express";

const router = Router();

router.post("/", (req, res, next) => {
  const {} = req.body;
});

export { router as properyRouter };
