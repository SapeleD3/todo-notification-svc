import { Router, Request, Response } from 'express';
import httpCodes, { ReasonPhrases } from 'http-status-codes';
import { responseHandler, ROUTES, SendMail } from './index.constants';
import {
  recievePubsubMessage,
  validateNotifyInputData,
} from './notify.middleware';
import { Notify } from './notify.model';

const router = Router();
const { INTERNAL_SERVER_ERROR, OK } = httpCodes;

//create notifcation route
router.post(
  ROUTES.CREATE_NOTIFICATION,
  recievePubsubMessage,
  validateNotifyInputData,
  async (req: Request, res: Response) => {
    console.log('REQ.BODY', req.body);
    try {
      const { userId, email, title, description, seen } = req.body;
      const { _id } = await Notify.create({
        userId,
        title,
        description,
        seen,
      });

      if (_id) {
        await SendMail(email, title, description);
      }
      return responseHandler(res, OK, {
        message: ReasonPhrases.OK,
        data: {},
      });
    } catch (error) {
      console.log('ERRPR', error);
      return responseHandler(res, INTERNAL_SERVER_ERROR, {
        message: ReasonPhrases.INTERNAL_SERVER_ERROR,
        data: {},
      });
    }
  }
);

router.get(ROUTES.GET_NOTIFICATION, async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const notifications = await Notify.find({ userId });

    return responseHandler(res, OK, {
      message: ReasonPhrases.OK,
      data: { notifications },
    });
  } catch (error) {
    return responseHandler(res, INTERNAL_SERVER_ERROR, {
      message: ReasonPhrases.INTERNAL_SERVER_ERROR,
      data: {},
    });
  }
});

router.post(ROUTES.SEND_MAIL, async (req: Request, res: Response) => {
  try {
    const { to, subject, text } = req.body;
    await SendMail(to, subject, text);
    return responseHandler(res, OK, {
      message: ReasonPhrases.OK,
      data: {},
    });
  } catch (error) {
    return responseHandler(res, INTERNAL_SERVER_ERROR, {
      message: ReasonPhrases.INTERNAL_SERVER_ERROR,
      data: {},
    });
  }
});
router.get(ROUTES.HOME, (req: Request, res: Response) => {
  res.send('Welcome to my Updated Notification service Text');
});

export default router;
