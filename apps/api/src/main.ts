import { config } from "./config.js";
import { buildServer } from "./server.js";

const app = buildServer();
app.listen({ host: "0.0.0.0", port: config.PORT }).catch((error) => {
  app.log.error(error);
  process.exit(1);
});
