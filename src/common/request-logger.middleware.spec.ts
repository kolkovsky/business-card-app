import { Logger } from '@nestjs/common';
import type { Request, Response } from 'express';
import { EventEmitter } from 'node:events';
import { RequestLoggerMiddleware } from './request-logger.middleware';

describe('RequestLoggerMiddleware', () => {
  const req = {
    method: 'POST',
    originalUrl: '/graphql?token=secret',
    ip: '203.0.113.7',
  } as Request;
  let res: EventEmitter & { statusCode: number };
  let log: jest.SpyInstance;
  let next: jest.Mock;

  beforeEach(() => {
    res = Object.assign(new EventEmitter(), { statusCode: 200 });
    log = jest.spyOn(Logger.prototype, 'log').mockImplementation();
    next = jest.fn();
    new RequestLoggerMiddleware().use(req, res as unknown as Response, next);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('passes the request on without logging until the response is sent', () => {
    expect(next).toHaveBeenCalledTimes(1);
    expect(log).not.toHaveBeenCalled();
  });

  it('logs method, path, status and client IP without the query string', () => {
    res.emit('finish');

    expect(log).toHaveBeenCalledTimes(1);
    expect(log).toHaveBeenCalledWith(
      expect.stringMatching(/^POST \/graphql 200 \d+ms ip=203\.0\.113\.7$/),
    );
  });
});
