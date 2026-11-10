import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';

/**
 * Logs every HTTP request with the client IP. `req.ip` is the real client
 * address only if TRUST_PROXY_HOPS matches the number of proxies in front of
 * the app. The query string is dropped so that its values never reach the log.
 */
@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction): void {
    const startedAt = Date.now();
    res.on('finish', () => {
      const [path] = req.originalUrl.split('?');
      const duration = Date.now() - startedAt;
      this.logger.log(
        `${req.method} ${path} ${res.statusCode} ${duration}ms ip=${req.ip}`,
      );
    });
    next();
  }
}
