const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const validateUser = (data) => {
  const schema = Joi.object({
    phoneNumber: Joi.string().required(),
  });
  return schema.validate(data);
};


module.exports = { validateUser };
