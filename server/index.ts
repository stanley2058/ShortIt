import Env from "./src/Env";
import Logger from "./src/Logger";

import express from "express";
import cors from "cors";
import compression from "compression";

Logger.setGlobalLogLevel(Env.logLevel);
Logger.verbose("Configuration loaded:");
Logger.plain.verbose("", Env);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(compression());
// app.use(Routes.getInstance().getRoutes());

(async () => {
  app.listen(Env.port, () => {
    Logger.info(`Express server started on port: ${Env.port}`);
  });
})();
