import type { RequestHandler } from 'express';
import type { ParamsDictionary } from 'express-serve-static-core';
import type { ParsedQs } from 'qs';

type ApiRequestHandler<
  TReq = unknown,
  TRes = unknown,
  TParams = unknown,
  TQuery = unknown
> = RequestHandler<
  ParamsDictionary & TParams,
  TRes,
  TReq,
  ParsedQs & TQuery,
  Record<string, unknown>
>;

export default ApiRequestHandler;
