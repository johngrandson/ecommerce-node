const Joi = require("joi");
const { model } = require("mongoose");

const User = model("User");

const admin = async (req, res, next) => {
  try {
    if (!req.payload.id) {
      return res.sendStatus(401);
    }

    const { store } = req.query;

    if (!store) {
      return res.sendStatus(401);
    }

    const user = await User.findById(req.payload.id);
    if (!user) {
      return res.sendStatus(401);
    }
    
    if (!user.store) {
      return res.sendStatus(401);
    }
    
    if (!user.role.includes("admin")) {
      return res.sendStatus(401);
    }

    if (!user.store.toString() !== store) {
      return res.sendStatus(401);
    }
  } catch (error) {
    next(error);
  }
};

const show = {
  params: Joi.object({
    id: Joi.string().alphanum().length(24).required(),
  }),
};

const create = {
  body: Joi.object({
    name: Joi.string().required(),
    cnpj: Joi.string().length(18).required(),
    email: Joi.string().email().required(),
    phones: Joi.array().items(Joi.string()).required(),
    address: Joi.object({
      place: Joi.string().required(),
      number: Joi.string().required(),
      complement: Joi.string().optional(),
      neighborhood: Joi.string().required(),
      city: Joi.string().required(),
      zip: Joi.string().required(),
    }).required(),
  }),
};

const update = {
  body: Joi.object({
    name: Joi.string().optional(),
    cnpj: Joi.string().length(18).optional(),
    email: Joi.string().email().optional(),
    phones: Joi.array().items(Joi.string()).optional(),
    address: Joi.object({
      place: Joi.string().required(),
      number: Joi.string().required(),
      complement: Joi.string().required(),
      neighborhood: Joi.string().required(),
      city: Joi.string().required(),
      zip: Joi.string().required(),
    }).optional(),
  }),
};

module.exports = {
  admin,
  show,
  create,
  update,
};
