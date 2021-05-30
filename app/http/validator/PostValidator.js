const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const validateCreatePost = (data) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number(),
    city: Joi.string().required(),
    district: Joi.string(),
    category: Joi.string().required(),
  });
  return schema.validate(data);
};
const validateUpdatePost = (data) => {
  const schema = Joi.object({
    title: Joi.string(),
    description: Joi.string(),
    price: Joi.number(),
    city: Joi.string(),
    district: Joi.string(),
    category: Joi.string(),
  });
  return schema.validate(data);
};

module.exports = { validateCreatePost,validateUpdatePost };
