import fastify from "fastify";
import { fastifyCors } from "@fastify/cors";
import { registerRoute } from "./routes/auth";
import "dotenv/config";
import { config } from "dotenv";
import { apiRoutes } from "./routes/api";

config({ path: "../.env" });
const app = fastify();

app.register(registerRoute, { prefix: "/auth" });
app.register(apiRoutes, { prefix: "/api" });
app.register(fastifyCors, {
  origin: "*",
});

app.listen({ port: 8000 }).then(() => {
  console.log("Server is running on port 8000");
});
