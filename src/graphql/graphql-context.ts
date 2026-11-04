import type { Request } from 'express';
import type { Loaders } from '../dataloader/loaders';

/** Per-request GraphQL context. A fresh set of loaders is created for every request. */
export interface GqlContext {
  req: Request;
  loaders: Loaders;
}
