import { Router } from "express";
import Step from "../model/Step.js";
import { StatusCodes } from "http-status-codes";

class StepRouter {
  constructor() {
    this.router = Router({ mergeParams: true });
    this.initializeRoutes();
  }

  initializeRoutes() {
    // Get all steps for a specific recipe
    this.router.get("/", async (req, res, next) => {
      const { recipeId } = req.params;
      try {
        const steps = await Step.getStepsByRecipeId(recipeId);
        res.status(StatusCodes.OK).json(steps);
      } catch (error) {
        next(error);
      }
    });

    // Create a new step
    this.router.post("/", async (req, res, next) => {
      const {
        name,
        description,
        image,
        estimatedTime,
        stepNumber,
        precedence,
      } = req.body;

      const { recipeId } = req.params;

      try {
        const step = new Step(
          null,
          name,
          description,
          image,
          estimatedTime,
          stepNumber,
          precedence,
          recipeId
        );
        await step.create();
        res.status(StatusCodes.CREATED).json({ id: step.id });
      } catch (error) {
        next(error);
      }
    });

    // Update the name of a step
    this.router.patch("/:stepId", async (req, res, next) => {
      const { stepId } = req.params;
      const { name } = req.body;
      try {
        const step = await Step.getStepById(stepId);
        await step.updateName(name);
        res
          .status(StatusCodes.OK)
          .json({ message: "Step name updated", step: step });
      } catch (error) {
        next(error);
      }
    });
  }
}

export default StepRouter;
