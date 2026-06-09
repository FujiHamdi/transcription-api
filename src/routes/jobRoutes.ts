import { Router } from "express";

import {
  createJob,
  assignReporter,
  markTranscribed,
  assignEditor,
  calculatePayment,
  getJobs,
} from "../controllers/jobController";

const router = Router();

/**
 * Create new job
 */
router.post("/", createJob);

/**
 * Assign reporter
 */
router.put(
  "/:id/assign-reporter",
  assignReporter
);

/**
 * Mark transcription completed
 */
router.put(
  "/:id/transcribed",
  markTranscribed
);

/**
 * Assign editor after transcription
 */
router.put(
  "/:id/assign-editor",
  assignEditor
);

/**
 * Calculate payment
 */
router.put(
  "/:id/calculate-payment",
  calculatePayment
);

/**
 * Get all jobs
 */
router.get("/", getJobs);

export default router;