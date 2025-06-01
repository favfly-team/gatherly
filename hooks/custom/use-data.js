"use client";

import {
  createDataAction,
  loadAllDataAction,
  loadSingleDataAction,
  updateDataAction,
} from "@/components/actions/data-actions";
import { useState, useCallback, useEffect } from "react";
import { errorHandler } from "../error";
import { toast } from "sonner";

// ===== USE LOAD DATA =====
const useLoadAllData = ({ data = null, dependencies = [] } = {}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [value, setValue] = useState([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const fetchData = useCallback(async (data, isPagination = false) => {
    if (isPagination) {
      setIsFetchingMore(true);
    } else {
      setIsLoading(true);
    }
    setSuccess(false);
    setError(null);

    try {
      const res = await loadAllDataAction(data);

      if (res.error) {
        throw new Error(res.error.message);
      }

      // Update hasMore flag based on if we got less results than requested
      if (data.query?.take && res.length < data.query.take) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }

      if (isPagination) {
        setValue((prev) => [...prev, ...res]);
      } else {
        setValue(res);
      }

      return res;
    } catch (err) {
      const error = errorHandler(err);
      setSuccess(false);
      setError(error);

      toast.error(error.error.message);
      return error;
    } finally {
      setIsLoading(false);
      setIsFetchingMore(false);
    }
  }, []);

  useEffect(() => {
    if (data) {
      fetchData(data);
    }
  }, dependencies);

  return {
    refetch: fetchData,
    isLoading,
    isFetchingMore,
    hasMore,
    success,
    error,
    value,
    setValue,
  };
};

// ===== USE UPDATE DATA =====
const useUpdateData = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState(null);
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const updateData = useCallback(async (query) => {
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    try {
      const res = await updateDataAction(query);

      if (res.error) {
        throw new Error(res.error.message);
      }

      setValue(res);
      setIsSuccess(true);
      return res;
    } catch (err) {
      const error = errorHandler(err);
      setError(error);
      return error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    updateData,
    isLoading,
    error,
    isSuccess,
    value,
    setValue,
  };
};

// ===== USE LOAD SINGLE DATA =====
const useLoadSingleData = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [value, setValue] = useState(null);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);

  const loadSingleData = useCallback(async (data) => {
    setIsLoading(true);
    setIsError(false);
    setError(null);

    try {
      const res = await loadSingleDataAction(data);

      if (res.error) {
        throw new Error(res.error.message);
      }

      setValue(res);
      return res;
    } catch (err) {
      setIsError(true);
      setError(err.message);
      return errorHandler(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    loadSingleData,
    isLoading,
    isError,
    error,
    value,
    setValue,
  };
};

// ===== USE CREATE DATA =====
const useCreateData = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState(null);
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const createData = useCallback(async (data) => {
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    try {
      const res = await createDataAction(data);

      if (res.error) {
        throw new Error(res.error.message);
      }

      setValue(res);
      setIsSuccess(true);
      return res;
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
      return errorHandler(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    createData,
    isLoading,
    setIsLoading,
    error,
    isSuccess,
    value,
    setValue,
  };
};

export { useUpdateData, useLoadAllData, useLoadSingleData, useCreateData };
