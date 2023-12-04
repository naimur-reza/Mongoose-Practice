import mongoose from 'mongoose';
import { TErrorSource, TGenericResponse } from '../interfaces/error';

const handleValidationError = (
  err: mongoose.Error.ValidationError,
): TGenericResponse => {
  const errorSources: TErrorSource = Object.values(err.errors).map(
    (val: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
      return {
        path: val.path,
        message: val.message,
      };
    },
  );

  const statusCode = 400;
  return {
    statusCode,
    message: 'Validation error',
    success: false,
    errorSources,
  };
};

export default handleValidationError;
