import type { AxiosError } from "axios";

export interface GeneralError {
  error: string;
}
export interface ValidationError {
  [key: string]: string[];
}

export type SignError = GeneralError | ValidationError;

export function isGeneralError(
  error: AxiosError<unknown>
): error is AxiosError<GeneralError> {
  const responseData = error.response?.data;

  return (
    !!responseData &&
    typeof responseData === "object" &&
    "error" in responseData &&
    typeof (responseData as GeneralError).error === "string"
  );
}
