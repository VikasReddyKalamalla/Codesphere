const { errorResponse } = require('../utils/apiResponse');

/**
 * Validate request body against a Joi schema
 * Usage: router.post('/route', validate(schema), handler)
 */
const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    const messages = error.details.map((d) => d.message).join(', ');
    return errorResponse(res, 422, messages);
  }

  next();
};

module.exports = { validate };
