import Joi from "joi";

export const updatePasswordValidation = Joi.object({
  password: Joi.string().required(),
  passwordConfirm: Joi.string().required(),
});
