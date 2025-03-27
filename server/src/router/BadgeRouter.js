import { Router } from "express";
import Badge from "../model/Badge.js";
import { StatusCodes } from "http-status-codes";

class BadgeRouter {
  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    // Get all badges
    this.router.get("/", async (req, res, next) => {
      try {
        const badges = await Badge.getAllBadges();
        res.status(StatusCodes.OK).json(badges);
      } catch (error) {
        next(error);
      }
    });

    // Create a new badge
    this.router.post("/", async (req, res, next) => {
      const { name, description, hint } = req.body;
      try {
        const badge = await new Badge().create(name, description, hint);
        res.status(StatusCodes.CREATED).json({ id: badge.id });
      } catch (error) {
        next(error);
      }
    });

    // Update badge unlocked status
    this.router.patch("/:id/unlocked", async (req, res, next) => {
      const { id } = req.params;
      const { unlocked } = req.body;
      try {
        const badge = new Badge(id);
        const result = await badge.updateUnlocked(unlocked);
        res.status(StatusCodes.OK).json({ message: result });
      } catch (error) {
        next(error);
      }
    });

    // Update badge redeemed status
    this.router.patch("/:id/redeemable", async (req, res, next) => {
      const { id } = req.params;
      const { redeemable } = req.body;
      try {
        const badge = new Badge(id);
        const result = await badge.updateRedeemable(redeemable);
        res.status(StatusCodes.OK).json({ message: result });
      } catch (error) {
        next(error);
      }
    });
  }
}

export default BadgeRouter;
