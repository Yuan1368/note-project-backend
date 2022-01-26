const logger = require("./logger");

const requestLogger = (request, response, next) => {
	logger.info("request's method", request.method);
	logger.info("request's path", request.path);
	logger.info("request's body", request.body);
}

const unknownEndpoint = (request, response) => {
	response.status(404).send("unknown ");
}

const errorHandler = (error, request, response, next) => {
	logger.error(error.message)
	if(error.name === "CastError"){
		return response.status(400).send({error: 'malformatted id'})
	}else if(error.name === 'ValidationError'){
		return response.status(400).json({error: error.message})
	}

	next(error)
}

module.exports = {
	requestLogger,
	unknownEndpoint,
	errorHandler
}