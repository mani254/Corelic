import type { CorsOptions } from "cors";
import { loadConfig } from "./env";

const cfg = loadConfig();

export const corsOptions: CorsOptions = {
  origin: Array.isArray(cfg.frontendUri)
    ? cfg.frontendUri
    : [String(cfg.frontendUri), "*"],
  credentials: true,
};
