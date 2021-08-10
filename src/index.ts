//load dependencies
import express from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import { APP_USE_LIMIT, connectToDB } from './index.constants';
import router from './notify.router';

config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(APP_USE_LIMIT);
app.use(router);

connectToDB();

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App is running on port: ${PORT}`);
});
