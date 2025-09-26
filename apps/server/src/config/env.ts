export type AppConfig = {
  port: number;
  mongodbUri: string;
  frontendUri: string | string[];
};

export function loadConfig(): AppConfig {
  const port = Number(process.env.PORT ?? 8080);
  const mongodbUri = process.env.MONGODB_URI;
  const frontendUri = process.env.FRONTEND_URI ?? "*";

  if (!mongodbUri) {
    throw new Error("MONGODB_URI is required");
  }

  return { port, mongodbUri, frontendUri };
}
