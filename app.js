const config = require("./utils/config");
const express = require("express");
const app = express();
const cors = require("cors");
const noteRouter = require("./controllers/note");
const middleware = require("./utils/middleware");
const logger = require("./utils/logger");
const mongoose = require("mongoose");

logger.info('connection to', config.PORT)

mongoose
	.connect(config.MONGODB_URI)
	.then(() => {
		logger.info("connected successfully")
	})
	.catch((error) => {
		logger.error("error connecting to MongoDB", error.message);
	})

app.use(cors());
app.use(express.static("build"));
app.use(express.json());
app.use(middleware.requestLogger);
app.use("/api/notes", noteRouter);
app.use(middleware.errorHandler);
app.use(middleware.unknownEndpoint);

module.exports = app;


