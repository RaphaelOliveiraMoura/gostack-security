import 'dotenv/config';
import express from 'express';
import { resolve } from 'path';
import helmet from 'helmet';
import cors from 'cors';

import redis from 'redis';
import RateLimit from 'express-rate-limit';
import RateLimitRedis from 'rate-limit-redis';

import '~/database';
import routes from '~/routes';

class App {
  constructor() {
    this.server = express();

    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(helmet());
    this.server.use(
      cors({
        origin: 'https://fronturl.com',
        exposedHeaders: 'total_pages',
      })
    );
    this.server.use(express.json());

    this.server.use(
      '/public',
      express.static(resolve(__dirname, '..', 'public'))
    );

    this.server.use(
      new RateLimit({
        store: new RateLimitRedis({
          client: redis.createClient({
            host: process.env.REDIS_HOST,
            port: process.env.REDIS_PORT,
          }),
        }),
        windowMs: 1000 * 60 * 15,
        max: 100,
      })
    );
  }

  routes() {
    this.server.use(routes);
  }
}

export default new App().server;
