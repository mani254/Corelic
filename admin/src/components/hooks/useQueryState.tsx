'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';

type QueryValue = string | number | null;
type QueryParams = Record<string, QueryValue>;
type StringQueryParams = Record<string, string>;

export const useQueryParams = (defaults: StringQueryParams = {}) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const getCleanQuery = useCallback((): StringQueryParams => {
    const clean: StringQueryParams = {};
    for (const [key, value] of searchParams.entries()) {
      clean[key] = value;
    }
    return clean;
  }, [searchParams]);

  const mergedQuery = useMemo(() => {
    const current = getCleanQuery();
    return { ...defaults, ...current };
  }, [getCleanQuery, defaults]);

  const getParam = useCallback(
    (key: string): string => {
      return searchParams.get(key) ?? '';
    },
    [searchParams]
  );

  const setParam = useCallback(
    (key: string, value: QueryValue) => {
      const currentParams = new URLSearchParams(searchParams.toString());

      if (value === null || value === undefined || value === '') {
        currentParams.delete(key);
      } else {
        currentParams.set(key, String(value));
      }

      router.push(`${pathname}?${currentParams.toString()}`);
    },
    [searchParams, pathname, router]
  );

  const setBulk = useCallback(
    (params: QueryParams) => {
      const currentParams = new URLSearchParams(searchParams.toString());

      Object.entries(params).forEach(([key, value]) => {
        if (value === null || value === undefined || value === '') {
          currentParams.delete(key);
        } else {
          currentParams.set(key, String(value));
        }
      });

      router.push(`${pathname}?${currentParams.toString()}`);
    },
    [searchParams, pathname, router]
  );

  const resetParams = useCallback(() => {
    const reset = new URLSearchParams();
    Object.entries(defaults).forEach(([key, value]) => {
      reset.set(key, value);
    });

    router.push(`${pathname}?${reset.toString()}`);
  }, [defaults, pathname, router]);

  return {
    getParam,
    setParam,
    setBulk,
    resetParams,
    searchParams: mergedQuery,
  };
};
