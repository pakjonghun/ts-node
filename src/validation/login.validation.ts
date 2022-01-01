import Joi from "joi";

export const LoginValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required().min(2),
});
