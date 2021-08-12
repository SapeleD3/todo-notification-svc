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
  console.log('INITIAL_REQ_BODY', req.body);
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

export async function recievePubsubMessage(
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log('PUB_SUB_INITIAL_REQ_BODY', req.body);
  if (!req.body) {
    const msg = 'no Pub/Sub message received';
    console.error(`error: ${msg}`);
    res.status(400).send(`Bad Request: ${msg}`);

    return;
  }

  if (!req.body.message) {
    const msg = 'invalid Pub/Sub message format';
    console.error(`error: ${msg}`);
    res.status(400).send(`Bad Request: ${msg}`);

    return;
  }

  if (req.body.message.body) {
    const body = req.body.message.body;
    const pubSubMessageData = Buffer.from(body, 'base64').toString();
    req.body = JSON.parse(pubSubMessageData);
  }

  next();
}
