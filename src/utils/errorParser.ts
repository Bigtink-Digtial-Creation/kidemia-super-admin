/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError } from "axios";

export const apiErrorMessageParser = (message: string | string[]) => {
  if (Array.isArray(message)) {
    return message[0].toString();
  }

  return message.toString();
};

export const apiErrorParser = (
  requestError: unknown
): { name: string; message: string } => {
  const err = requestError as Error;

  console.warn(
    "[ERROR_PARSER]",
    JSON.parse(JSON.stringify(err, Object.getOwnPropertyNames(err), 2))
  );

  if (err instanceof ApiError || err.name === "ApiError") {
    const error = err as ApiError;
    const errorBody = error.body;

    return {
      name: error.name,
      message: apiErrorMessageParser(errorBody.message),
    };
  }

  if (err instanceof AxiosError || err.name === AxiosError.name) {
    const axiosError = err as AxiosError;
    console.log("AXIOS ERROR", axiosError.response?.data);
  }

  return { name: err.name, message: err.message };
};

export type ApiRequestOptions = {
  readonly method:
    | "GET"
    | "PUT"
    | "POST"
    | "DELETE"
    | "OPTIONS"
    | "HEAD"
    | "PATCH";
  readonly url: string;
  readonly path?: Record<string, any>;
  readonly cookies?: Record<string, any>;
  readonly headers?: Record<string, any>;
  readonly query?: Record<string, any>;
  readonly formData?: Record<string, any>;
  readonly body?: any;
  readonly mediaType?: string;
  readonly responseHeader?: string;
  readonly errors?: Record<number, string>;
};

export class ApiError extends Error {
  public readonly url: string;
  public readonly status: number;
  public readonly statusText: string;
  public readonly body: any;
  public readonly request: ApiRequestOptions;

  constructor(
    request: ApiRequestOptions,
    response: ApiResult,
    message: string
  ) {
    super(message);

    this.name = "ApiError";
    this.url = response.url;
    this.status = response.status;
    this.statusText = response.statusText;
    this.body = response.body;
    this.request = request;
  }
}

export type ApiResult = {
  readonly url: string;
  readonly ok: boolean;
  readonly status: number;
  readonly statusText: string;
  readonly body: any;
};
