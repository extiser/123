import config from './env.config.js';
import express from 'express';
import bodyParser from 'body-parser';
import routes from './routes';
import { autoAddPermission } from './utils/addPermission';

const PORT = config.PORT;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', routes);

app.use((req, res, next) => {
  res.status(404).send({
    status: 404,
    message: 'Not found'
  });
});

if (config.env === 'dev') {
  (async() => {
    await autoAddPermission(app);
  })();
}

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));