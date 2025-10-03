import * as Joi from 'joi';

export const envSchema = Joi.object({
  PORT: Joi.number().default(3000),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().default(5432),
  DB_USER: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  CLOUDINARY_URL: Joi.string().required(),
  HOST_API: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
});
