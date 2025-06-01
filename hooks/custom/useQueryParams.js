import {
  useRouter,
  useParams,
  usePathname,
  useSearchParams,
} from "next/navigation";
import { useCallback } from "react";

const useQueryParams = () => {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name, value) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  const updateQueryParam = useCallback(
    (name, value) => {
      router.push(`${pathname}?${createQueryString(name, value)}`, {
        scroll: false,
      });
    },
    [router, pathname, createQueryString]
  );

  const removeQueryParam = useCallback(
    (name) => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete(name);

      router.push(
        `${pathname}${params.toString() ? `?${params.toString()}` : ""}`,
        {
          scroll: false,
        }
      );
    },
    [router, pathname, searchParams]
  );

  const updateQueryParamLink = useCallback(
    (name, value) => {
      return `${pathname}?${createQueryString(name, value)}`;
    },
    [pathname, createQueryString]
  );

  const getSearchParam = useCallback(
    (name) => {
      return searchParams.get(name);
    },
    [searchParams]
  );

  return {
    createQueryString,
    updateQueryParam,
    updateQueryParamLink,
    getSearchParam,
    removeQueryParam,
    pathname,
    router,
    params,
    searchParams,
  };
};

export default useQueryParams;
