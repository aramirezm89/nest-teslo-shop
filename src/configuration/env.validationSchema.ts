/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import * as Joi from 'joi';

export const envSchema = Joi.object({
  PORT: Joi.number().default(3000),
});
