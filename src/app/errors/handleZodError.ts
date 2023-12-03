import { ZodError } from 'zod';
import { TErrorSource } from '../interfaces/error';

const handleZodError = (err: ZodError) => {
  const errorSources: TErrorSource = err.issues.map((issue) => {
    return {
      path: issue.path[issue.path.length - 1],
      message: issue.message,
    };
  });

  const statusCode = 400;
  return {
    statusCode,
    message: 'Validation error',
    success: false,
    errorSources,
  };
};

export default handleZodError;
