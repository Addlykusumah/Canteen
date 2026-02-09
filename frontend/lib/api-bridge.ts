import axios, { AxiosError } from "axios";
import { BASE_API_URL } from "@/global";

const axiosInstance = axios.create({
  baseURL: BASE_API_URL,
});

type ApiFail = { status: false; message: string };
type ApiOk<T> = { status: true; data: T };
type ApiResult<T> = ApiOk<T> | ApiFail;

function authHeader(token?: string) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function errorMessage(error: unknown) {
  const err = error as AxiosError<any>;
  if (err.response) {
    return (
      err.response.data?.msg ||
      err.response.data?.message ||
      err.response.data?.error ||
      `HTTP ${err.response.status}`
    );
  }
  return err.message || "Network error";
}

export const get = async <T = any>(url: string, token?: string): Promise<ApiResult<T>> => {
  try {
    const result = await axiosInstance.get<T>(url, {
      headers: { ...authHeader(token) },
    });

    return { status: true, data: result.data };
  } catch (error) {
    return { status: false, message: errorMessage(error) };
  }
};

export const post = async <T = any>(
  url: string,
  data: any | FormData,
  token?: string
): Promise<ApiResult<T>> => {
  try {
    const headers: any = { ...authHeader(token) };


    if (!(data instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    const result = await axiosInstance.post<T>(url, data, { headers });

    return { status: true, data: result.data };
  } catch (error) {
    return { status: false, message: errorMessage(error) };
  }
};

export const put = async <T = any>(
  url: string,
  data: any | FormData,
  token?: string
): Promise<ApiResult<T>> => {
  try {
    const headers: any = { ...authHeader(token) };

    if (!(data instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    const result = await axiosInstance.put<T>(url, data, { headers });

    return { status: true, data: result.data };
  } catch (error) {
    return { status: false, message: errorMessage(error) };
  }
};

export const drop = async <T = any>(url: string, token?: string): Promise<ApiResult<T>> => {
  try {
    const result = await axiosInstance.delete<T>(url, {
      headers: { ...authHeader(token) },
    });

    return { status: true, data: result.data };
  } catch (error) {
    return { status: false, message: errorMessage(error) };
  }
};
