const Joi = require("joi");

const show = {
  params: Joi.object({
    id: Joi.string().alphanum().length(24).required(),
  }),
};

const login = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};

const register = {
  body: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    store: Joi.string().alphanum().length(24).required(),
  }),
};

const update = {
  body: Joi.object({
    name: Joi.string().optional(),
    email: Joi.string().email().optional(),
    password: Joi.string().optional()
  }),
};

module.exports = {
  show,
  login,
  register,
  update,
};
