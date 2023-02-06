import type { RequestHandler } from 'express';
import type { ParamsDictionary } from 'express-serve-static-core';
import type { ParsedQs } from 'qs';

type ApiRequestHandler<TReq = unknown, TRes = unknown> = RequestHandler<
  ParamsDictionary,
  TRes,
  TReq,
  ParsedQs,
  Record<string, unknown>
>;

export default ApiRequestHandler;
