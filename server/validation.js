const Joi = require("joi");

const registerValidation = (data) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(25).required(),
    email: Joi.string().min(6).max(50).email().required(),
    password: Joi.string().min(8).max(25).required(),
    role: Joi.string().required().valid("Student", "Instructor"),
  });
  return schema.validate(data);
};

const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().min(6).max(50).email().required(),
    password: Joi.string().min(8).max(25).required(),
  });
  return schema.validate(data);
};

const courseValidation = (data) => {
  const schema = Joi.object({
    title: Joi.string().min(6).max(50).required(),
    description: Joi.string().min(6).max(200).required(),
    price: Joi.number().min(0).max(9999).required(),
  });
  return schema.validate(data);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.courseValidation = courseValidation;
