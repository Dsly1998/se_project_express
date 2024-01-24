// middleware/validation.js

const { Joi, celebrate } = require('celebrate');
const validator = require('validator');

// Custom URL validation function
const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error('string.uri');
};

// Validation for clothing item creation
module.exports.validateCardBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
    imageUrl: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "imageUrl" field must be filled in',
      "string.uri": 'The "imageUrl" field must be a valid URL',
    }),
  }),
});

// Validation for user creation
module.exports.validateUserBody = celebrate({
  body: Joi.object().keys({
    userName: Joi.string().min(2).max(30).messages({
      "string.min": 'The minimum length of the "userName" field is 2',
      "string.max": 'The maximum length of the "userName" field is 30',
    }),
    userAvatar: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "userAvatar" field must be filled in',
      "string.uri": 'The "userAvatar" field must be a valid URL',
    }),
    email: Joi.string().required().email().messages({
      "string.empty": 'The "email" field must be filled in',
      "string.email": 'The "email" field must be a valid email',
    }),
    password: Joi.string().required().messages({
      "string.empty": 'The "password" field must be filled in',
    }),
  }),
});

// Validation for user login
module.exports.validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      "string.empty": 'The "email" field must be filled in',
      "string.email": 'The "email" field must be a valid email',
    }),
    password: Joi.string().required().messages({
      "string.empty": 'The "password" field must be filled in',
    }),
  }),
});

// Validation for IDs
module.exports.validateId = celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex().required().messages({
      "string.length": 'The "id" must be a length of 24 characters',
      "string.hex": 'The "id" must be a hexadecimal value',
      "any.required": 'The "id" field is required',
    }),
  }),
});
