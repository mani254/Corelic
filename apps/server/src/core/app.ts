import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application } from "express";
import path from "path";
import { corsOptions } from "../config/cors";
import { errorHandler } from "../middlewares/error";
import { notFoundHandler } from "../middlewares/not-found";
import apiRouter from "../routes";

export function createApp(): Application {
  const app: Application = express();

  app.use(cors(corsOptions));
  app.use(bodyParser.json());
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, "../../public")));

  app.get("/", (_req, res) => {
    res.json({ message: "Server is running!" });
  });

  app.use("/api", apiRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
