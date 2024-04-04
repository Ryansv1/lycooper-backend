import { FastifyInstance } from "fastify";
import { prismaConnection } from "../lib/prisma";
import { z } from "zod";
import { hash } from "bcrypt";
import { checkIfUserExists } from "../services/check-if-user-exists";
import { newDate } from "../services/convert-date-to-string";
import fastifyFormbody from "@fastify/formbody";

export async function registerRoute(app: FastifyInstance) {
  app.register(fastifyFormbody);
  app.post("/register", async (req, res) => {
    const userSchema = z.object({
      userName: z.string(),
      userPassword: z.string().min(8),
      userEmail: z.string().email(),
    });
    const { userName, userPassword, userEmail } = userSchema.parse(req.body);

    try {
      const existingUser = await prismaConnection.users.findUnique({
        where: {
          email: userEmail,
        },
      });
      if (existingUser) {
        return res.status(409).send({
          LycooperAPI: {
            code: 409,
            message: "User already exists",
          },
        });
      } else {
        const hashedPassword = await hash(userPassword, 10);
        const newUser = await prismaConnection.users.create({
          data: {
            name: userName,
            email: userEmail,
            password: hashedPassword,
            createdAt: newDate(),
          },
        });
        return res.status(201).send({
          LycooperAPI: {
            code: 201,
            message: "User created successfully",
          },
        });
      }
    } catch (error) {
      return res.status(500).send({
        LycooperAPI: {
          code: 500,
          message: "Internal server error",
        },
      });
    }
  });
  app.post("/login", async (req, res) => {
    const userSchema = z.object({
      userEmail: z.string().email(),
      userPassword: z.string().min(8),
    });
    const { userEmail, userPassword } = userSchema.parse(req.body);

    try {
      const result = await checkIfUserExists(userEmail, userPassword);
      switch (result) {
        case 401:
          return res.status(401).send({
            LycooperAPI: {
              code: 401,
              message: "Password not set. Please register again",
            },
          });
        case true:
          return res.redirect(200, "/dashboard");
        default:
          return res.status(401).send({
            LycooperAPI: {
              code: 401,
              message: "Incorrect password",
            },
          });
      }
    } catch (e) {
      console.error(e);
    }
  });
}
