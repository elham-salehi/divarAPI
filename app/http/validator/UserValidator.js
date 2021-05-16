const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const validateUser = (data) => {
  const schema = Joi.object({
    phoneNumber: Joi.number().required(),
  });
  return schema.validate(data);
};


module.exports = { validateUser };
