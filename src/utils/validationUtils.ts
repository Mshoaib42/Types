import { Schema } from "joi";

export const validateRequest = (
  schema: Schema,
  source: "body" | "params" | "query" = "body"
) => {
  return (req: any, res: any, next: any) => {
    const data = req[source]; // Validate the specified source (body, params, or query)
    const result = schema.validate(data);
    if (result.error) {
      return res.status(400).json({
        error: result.error.details[0].message,
      });
    }
    if (!req.value) {
      req.value = {};
    }
    req.value[source] = result.value;
    next();
  };
};
