import Joi from "joi";
export const CreateUserValidation = Joi.object({
  roleId: Joi.string().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
});
