import { validationResult } from 'express-validator';

/**
 * Validation error handler
 * @class
 *
 * @returns {Error} error object
 */
export class ValidationError extends Error {
  /**
   * @param {string} message error message
   * @param {number} statusCode error code
   */
  constructor(message, statusCode) {
    super(message);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ValidationError);
    }
    const date = new Date();
    this.name = 'ValidationError';
    this.status = statusCode;
    this.date = date.toISOString();
  }
}

/**
 * Function to validate request input and check validation result
 *
 * @param {Array} schema - schema to be validated
 *
 * @returns {Array} array of validation schema and middleware to check validation result
 */
export const validator = schema => {
  /**
   * Middleware to check validation results
   *
   * @param {Object} req - express request object
   * @param {Object} res - express response object
   * @param {Function} next - express next function
   *
   * @returns {Function} next function
   */
  const validationCheck = (req, res, next) => {
    const errors = validationResult(req);
    const hasErrors = !errors.isEmpty();

    if (hasErrors) {
      const arrayOfErrors = Object.values(errors.mapped()).map(
        value => value.msg
      );
      throw new ValidationError(arrayOfErrors[0], 422);
    }

    return next();
  };

  return [schema, validationCheck];
};
