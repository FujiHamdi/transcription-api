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

export const assignReporter =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const id = Number(
        req.params.id
      );

      const job =
        await prisma.job.findUnique({
          where: { id },
        });

      if (!job) {
        return res.status(404).json({
          message: "Job not found",
        });
      }

      if (job.status !== "NEW") {
        return res.status(400).json({
          message:
            "Reporter can only be assigned to NEW jobs",
        });
      }

      const reporter =
        await prisma.user.findFirst({
          where: {
            role: "REPORTER",
            available: true,
          },
          orderBy: {
            city: "asc",
          },
        });

      if (!reporter) {
        return res.status(404).json({
          message:
            "No available reporter",
        });
      }

      const reporterPayment =
        job.duration * 2000;

      const updatedJob =
        await prisma.job.update({
          where: { id },
          data: {
            reporterId:
              reporter.id,
            reporterPayment,
            status:
              "ASSIGNED",
          },
        });

      res.json(updatedJob);
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message:
          "Assign reporter failed",
      });
    }
  };

export const markTranscribed =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const id = Number(
        req.params.id
      );

      const job =
        await prisma.job.findUnique({
          where: { id },
        });

      if (!job) {
        return res.status(404).json({
          message: "Job not found",
        });
      }

      if (
        job.status !== "ASSIGNED"
      ) {
        return res.status(400).json({
          message:
            "Only ASSIGNED jobs can be transcribed",
        });
      }

      const updatedJob =
        await prisma.job.update({
          where: { id },
          data: {
            status:
              "TRANSCRIBED",
          },
        });

      res.json(updatedJob);
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message:
          "Failed to update transcription status",
      });
    }
  };

export const assignEditor =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const id = Number(
        req.params.id
      );

      const job =
        await prisma.job.findUnique({
          where: { id },
        });

      if (!job) {
        return res.status(404).json({
          message: "Job not found",
        });
      }

      if (
        job.status !==
        "TRANSCRIBED"
      ) {
        return res.status(400).json({
          message:
            "Editor can only be assigned after transcription",
        });
      }

      const editor =
        await prisma.user.findFirst({
          where: {
            role: "EDITOR",
            available: true,
          },
        });

      if (!editor) {
        return res.status(404).json({
          message:
            "No available editor",
        });
      }

      const updatedJob =
        await prisma.job.update({
          where: { id },
          data: {
            editorId: editor.id,
            editorPayment: 50000,
            status:
              "REVIEWED",
          },
        });

      res.json(updatedJob);
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message:
          "Assign editor failed",
      });
    }
  };

export const calculatePayment =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const id = Number(
        req.params.id
      );

      const job =
        await prisma.job.findUnique({
          where: { id },
        });

      if (!job) {
        return res.status(404).json({
          message: "Job not found",
        });
      }

      if (
        job.status !== "REVIEWED"
      ) {
        return res.status(400).json({
          message:
            "Payment can only be calculated after review",
        });
      }

      const totalPayment =
        (job.reporterPayment || 0) +
        (job.editorPayment || 0);

      const updatedJob =
        await prisma.job.update({
          where: { id },
          data: {
            totalPayment,
            status:
              "COMPLETED",
          },
        });

      res.json(updatedJob);
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message:
          "Calculate payment failed",
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
       orderBy: {
        id: "asc",
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