import { responsesTypes } from './httpResponse';
import { errorFormat } from './errors';

interface FormattedResponse {
  statusCode: number;
  statusMessage: string;
  statusDescription: string;
  data: {
    success: boolean;
    message?: string;
    internalCode?: string;
    [key: string]: any;
  };
}

export const formatResponse = (statusCode: number, data: any): FormattedResponse => {
  // En esta versión no se aplica cifrado, solo retorna la respuesta formateada.
  try {
    // Si es un error formateado, mantener su estructura
    if (data?.data?.success === false) {
      return {
        statusCode,
        statusMessage: responsesTypes[statusCode]?.statusMessage || 'Unknown',
        statusDescription: responsesTypes[statusCode]?.statusDescription || '',
        data: data.data
      };
    }

    // Si es una respuesta exitosa, formatear con estructura similar
    return {
      statusCode,
      statusMessage: responsesTypes[statusCode]?.statusMessage || 'Unknown',
      statusDescription: responsesTypes[statusCode]?.statusDescription || '',
      data: {
        success: true,
        ...data
      }
    };
  } catch (error: any) {
    console.error('ERROR formateando respuesta:', error);
    return {
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      statusDescription: 'Error formateando la respuesta',
      data: {
        success: false,
        message: error.message || 'Error interno del servidor',
        internalCode: 'FRM'
      }
    };
  }
};
