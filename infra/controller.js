
import { InternalServerError, MethodNotAllowedError, ValidationError } from "infra/errors";

function onErrorHandler(error, req, res) {
  if (error instanceof ValidationError) {
    return res.status(error.statusCode).json(error);
  }
  const publicErrorObject = new InternalServerError({
    statusCode: error.statusCode,
    cause: error,
  });

  console.error(publicErrorObject);

  res.status(publicErrorObject.statusCode).json(publicErrorObject);
}

function onNoMatchHandler(req, res) {
  const publicErrorObject = new MethodNotAllowedError();

  res.status(publicErrorObject.statusCode).json(publicErrorObject);
}

const controller = {
  errorHandlers: {
    onError: onErrorHandler,
    onNoMatch: onNoMatchHandler,
  },
};

export default controller;
