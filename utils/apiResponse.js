import config from '../env.config';

export const apiError = (res, status, message, validation, result) => {
  if (status === 500) message = 'Something went wrong. Please contact with administration!';

  if (!validation && status !== 500) {
    validation = { error: false, filed: [] }
  }

  if (config.env === 'dev') console.log(validation);

  return res.status(status).send({ status, message, validation, result });
}

export const apiSuccess = (res, status, message, result) => {
  return res.status(status).send({ status, message, result });
}