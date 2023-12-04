/* eslint-disable @typescript-eslint/no-explicit-any */
import { TErrorSource, TGenericResponse } from '../interfaces/error';

const handleDuplicateError = (err: any): TGenericResponse => {
  const match = err.message.match(/"([^"]*)"/);
  const extractedMessage = match && match[0];

  const errorSources: TErrorSource = [
    {
      path: '',
      message: `${extractedMessage} is already exist`,
    },
  ];

  const statusCode = 400;
  return {
    statusCode,
    message: 'Validation error',
    success: false,
    errorSources,
  };
};

export default handleDuplicateError;
