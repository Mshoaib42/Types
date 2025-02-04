import Joi from "joi";

// params ID validation schema
export const paramsIdSchema = Joi.object().keys({
  id: Joi.string().alphanum().required(),
});
