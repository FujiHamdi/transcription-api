import { Request, Response } from "express";
import prisma from "../prisma";

export const createJob = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      caseName,
      duration,
      city,
      jobType,
    } = req.body;

    const job = await prisma.job.create({
      data: {
        caseName,
        duration,
        city,
        jobType,
      },
    });

    res.json(job);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Create job failed",
    });
  }
};

export const assignReporter = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    const job = await prisma.job.findUnique({
      where: { id },
    });

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    let reporter;

    // PHYSICAL job → same city preferred
    if (job.jobType === "PHYSICAL") {
      reporter = await prisma.user.findFirst({
        where: {
          role: "REPORTER",
          city: job.city,
          available: true,
        },
      });
    } else {
      // REMOTE job
      reporter = await prisma.user.findFirst({
        where: {
          role: "REPORTER",
          available: true,
        },
      });
    }

    if (!reporter) {
      return res.status(400).json({
        message: "No available reporter",
      });
    }

    const updatedJob = await prisma.job.update({
      where: { id },
      data: {
        reporterId: reporter.id,
        status: "ASSIGNED",
      },
    });

    res.json(updatedJob);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Reporter assignment failed",
    });
  }
};

export const markTranscribed = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    const updatedJob = await prisma.job.update({
      where: { id },
      data: {
        status: "TRANSCRIBED",
      },
    });

    res.json(updatedJob);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to update transcription status",
    });
  }
};

export const assignEditor = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    const job = await prisma.job.findUnique({
      where: { id },
    });

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    if (job.status !== "TRANSCRIBED") {
      return res.status(400).json({
        message:
          "Editor can only be assigned after transcription",
      });
    }

    const editor = await prisma.user.findFirst({
      where: {
        role: "EDITOR",
        available: true,
      },
    });

    if (!editor) {
      return res.status(400).json({
        message: "No available editor",
      });
    }

    const updatedJob = await prisma.job.update({
      where: { id },
      data: {
        editorId: editor.id,
        status: "REVIEWED",
      },
    });

    res.json(updatedJob);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Editor assignment failed",
    });
  }
};

export const calculatePayment = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    const job = await prisma.job.findUnique({
      where: { id },
    });

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    // Reporter paid per minute
    const reporterPayment =
      job.duration * 2000;

    // Editor flat fee
    const editorPayment = 50000;

    // Total payout
    const totalPayment =
      reporterPayment + editorPayment;

    const updatedJob = await prisma.job.update({
      where: { id },
      data: {
        reporterPayment,
        editorPayment,
        totalPayment,
        status: "COMPLETED",
      },
    });

    res.json(updatedJob);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Payment calculation failed",
    });
  }
};

export const getJobs = async (
  req: Request,
  res: Response
) => {
  try {
    const jobs = await prisma.job.findMany({
      include: {
        reporter: true,
        editor: true,
      },
    });

    res.json(jobs);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to fetch jobs",
    });
  }
};