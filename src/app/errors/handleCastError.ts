import mongoose from 'mongoose';
import { TErrorSource, TGenericResponse } from '../interfaces/error';

const handleCastError = (err: mongoose.Error.CastError): TGenericResponse => {
  const errorSources: TErrorSource = [
    {
      path: err.path,
      message: err.message,
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

export default handleCastError;
