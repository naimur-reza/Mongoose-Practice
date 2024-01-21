import { TErrorSource, TGenericResponse } from '../interfaces/error';

const handleJwtError = (): TGenericResponse => {
  const errorSources: TErrorSource = [
    {
      path: '',
      message: '',
    },
  ];

  const statusCode = 401;
  return {
    statusCode,
    message: 'Unauthorized access',
    success: false,
    errorSources,
  };
};

export default handleJwtError;
