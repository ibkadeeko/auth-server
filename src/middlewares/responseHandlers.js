/* istanbul ignore file */
import Debug from 'debug';
import config from '../config';

const isProduction = config.env === 'production';
const debug = Debug('api:middleware:errors:');

/**
 * Returns response to the user
 *
 * @param {Object} res express response object
 * @param {string} message message to be returned
 * @param {number} statusCode Response Status Code
 * @param {Object | string | undefined} data data payload if any
 *
 * @returns {Object} express response object
 */
export const successResponse = (res, message, statusCode = 200, data) =>
  res.status(statusCode).send({
    status: 'success',
    message,
    data,
  });
/**
 * Global App Error Handler
 *
 * @param {Object} error express error object
 * @param {Object} request express request object
 * @param {Object} response express response object
 * @param {Function} next express next function
 *
 * @returns {void}
 */
export const errorHandler = (error, request, response, next) => {
  if (response.headersSent) {
    return next(error);
  }
  debug(error);
  return response
    .status(error.status >= 100 && error.status < 600 ? error.status : 500)
    .send({
      status: 'error',
      error: error.message,
      ...(!isProduction && { trace: error.stack }),
    });
};
