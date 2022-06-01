import express, { Express } from "express";
import Routes from "./routes";
import ENV from "./config";

const app: Express = express();

app.use(Routes);
app.listen(ENV.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(
    `⚡️[server]: Server is running at https://localhost:${ENV.PORT}`
  );
});
