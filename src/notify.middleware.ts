import { Request, Response, NextFunction } from 'express';
import StatusCodes from 'http-status-codes';
import { responseHandler } from './index.constants';
import { boolean, object, string } from 'joi';

const { UNPROCESSABLE_ENTITY } = StatusCodes;

export const NotifyInputValidationSchema = object({
  userId: string().min(5).required().trim(),
  title: string().min(5).required().trim(),
  email: string().min(5).required().trim(),
  description: string().required(),
  seen: boolean().default(false),
});
/**
 * validate the inputs served to login and register
 * @param req express request
 * @param res express response
 * @param next express next function
 * @returns
 */
export async function validateNotifyInputData(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const validValues = await NotifyInputValidationSchema.validateAsync(
      req.body
    );
    req.body = validValues;
    return next();
  } catch (error) {
    return responseHandler(res, UNPROCESSABLE_ENTITY, {
      message: error.details[0].message,
      data: error.details,
    });
  }
}
