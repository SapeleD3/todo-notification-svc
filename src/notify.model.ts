import { Document, model, Schema } from 'mongoose';

export interface iNotificationDocument extends Document {
  description: string;
  email: string;
  title: string;
  createdAt: Date;
  seen: boolean;
}

const notificationSchema = new Schema({
  description: {
    type: String,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  seen: {
    type: Boolean,
    required: true,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

export const Notify = model<iNotificationDocument>(
  'Notify',
  notificationSchema
);
