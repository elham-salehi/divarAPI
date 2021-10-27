const Joi = require('joi');

const validateUser = (data) => {
  const schema = Joi.object({
    phoneNumber: Joi.string().min(11).max(11).required()
  });
  return schema.validate(data);
};


module.exports = { validateUser };
