export type TErrorSource = {
  path: string | number;
  message: string;
}[];

export interface TGenericResponse {
  statusCode: number;
  success: boolean;
  message: string;
  errorSources: TErrorSource;
  stack?: string;
}
