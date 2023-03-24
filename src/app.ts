import express, {Express} from 'express';
import config from 'config';
import log from './logger';
import connect from './db/connect';
import routes from "./router";
import cors from 'cors';
import morgan from 'morgan';
import router from "./router";

const port: number = config.get("port") as number;
const host: string = config.get("host") as string;
import db from './db/connect'
// An App
const app: Express = express();

//middleware
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors());
app.use(morgan('tiny'));
app.disable('x-powered-by')


// Router
app.use('/api', router);
app.listen(port, host, () => {
  log.info(`Server is Listening at http://${host}:${port}`);
  connect();
});