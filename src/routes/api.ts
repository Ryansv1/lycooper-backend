import { FastifyInstance } from "fastify";
import { prismaConnection } from "../lib/prisma";
import { z } from "zod";
import { newDate } from "../services/convert-date-to-string";

interface request {
  date: string;
  sensorId: string;
}

export async function apiRoutes(app: FastifyInstance) {
  app.get("/collect", async (req, res) => {
    const { date, sensorId }: request = req.query as request;
    try {
      const data = await prismaConnection.sensorData.findMany({
        where: {
          sensorId: sensorId,
          createdAt: date,
        },
      });
      const response = JSON.stringify(data);
      return res.status(200).send({
        LycooperAPI: {
          code: 200,
          message: "Data collected successfully",
          apiResponse: {
            data: response,
          },
        },
      });
    } catch (err) {
      return res.status(500).send({
        LycooperAPI: {
          code: 500,
          message: "Internal server error",
          err,
        },
      });
    }
  });

  app.post("/input", async (req, res) => {
    const requestSchema = z.object({
      sensorId: z.string(),
      value: z.number().int(),
    });
    const { sensorId, value } = requestSchema.parse(req.body);
    try {
      await prismaConnection.sensorData.create({
        data: {
          sensorId: sensorId,
          sensorData: value,
          createdAt: newDate(),
        },
      });
    } catch (error) {
      return res.status(500).send({
        LycooperAPI: {
          code: 500,
          message: "Internal server error",
          error,
        },
      });
    }
  });

  app.post("/delete", async (req, res) => {
    try {
      const apiKey = 8989; // key para deletar

      const requestSchema = z.object({
        key: z.number().int(),
      });
      const { key } = requestSchema.parse(req.body);
      if (key !== apiKey) {
        return res.status(401).send({
          LycooperAPI: {
            code: 401,
            message: "Unauthorized",
          },
        });
      }
      const data = await prismaConnection.sensorData.deleteMany({});
      res.send("Data deleted successfully");
    } catch (error) {
      return res.status(500).send({
        LycooperAPI: {
          code: 500,
          message: "Internal server error",
          error,
        },
      });
    }
  });
}
