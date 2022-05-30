import express from "express";
import swaggerUi from 'swagger-ui-express';

import { router } from "./routes";
import swaggerConfig from "./swagger.json";

const app = express();

app.use(express.json());

app.use(router);

app.use("/api-doc", swaggerUi.serve, swaggerUi.setup(swaggerConfig));

app.listen(3333, () => {
	console.log("🌐 Server is running on port 3333");
});
