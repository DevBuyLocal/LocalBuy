import type {
  GetNextPageParamFunction,
  GetPreviousPageParamFunction,
} from '@tanstack/react-query';

import type { PaginateQuery } from '../types';

type KeyParams = {
  [key: string]: any;
};
export const DEFAULT_LIMIT = 10;

export function getQueryKey<T extends KeyParams>(key: string, params?: T) {
  return [key, ...(params ? [params] : [])];
}

// for infinite query pages  to flatList data
// export function normalizePages<T>(pages?: PaginateQuery<T>[]): T[] {
//   if (!Array.isArray(pages) || pages.length === 0) return [];

//   return pages.reduce((prev: T[], current) => {
//     if (!current || !Array.isArray(current.results)) return prev; // Ensure `results` is an array
//     return [...prev, ...current.results];
//   }, []);
// }

export function normalizePages<T>(pages?: PaginateQuery<T>[]): T[] {
  return pages && pages?.length > 0
    ? pages?.reduce((prev: T[], current) => [...prev, ...current?.results], [])
    : [];
}

// a function that accept a url and return params as an object
export function getUrlParameters(
  url: string | null
): { [k: string]: string } | null {
  if (url === null) {
    return null;
  }
  let regex = /[?&]([^=#]+)=([^&#]*)/g,
    params = {},
    match;
  while ((match = regex.exec(url))) {
    if (match[1] !== null) {
      //@ts-ignore
      params[match[1]] = match[2];
    }
  }
  return params;
}

export const getPreviousPageParam: GetNextPageParamFunction<
  unknown,
  PaginateQuery<unknown>
> = (page) => getUrlParameters(page.previous) ?? null;

export const getNextPageParam: GetPreviousPageParamFunction<
  unknown,
  PaginateQuery<unknown>
> = (page) => getUrlParameters(page.next) ?? null;
