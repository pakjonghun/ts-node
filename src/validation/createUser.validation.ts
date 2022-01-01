import Joi from "joi";
export const CreateUserValidation = Joi.object({
  role: Joi.string().required(),
  firstname: Joi.string().required(),
  lastname: Joi.string().required(),
  email: Joi.string().email().required(),
});
