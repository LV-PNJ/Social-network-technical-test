interface FormattedErrorData {
  success: false;
  message: string;
  internalCode: string;
  formErrors?: object;
}

interface FormattedErrorResponse {
  data: FormattedErrorData;
}

export const errorFormat = (params: {
  status: number;
  codeValidate?: string | number;
  message?: string;
  internalCode?: string;
  field?: string;
  formErrors?: object;
}): FormattedErrorResponse => {
  let { status, codeValidate, message, internalCode, field, formErrors } = params;

  if (!message && field) {
    message = `El campo ${field} es obligatorio`;
  }

  const response: FormattedErrorResponse = {
    data: {
      success: false,
      message:
        message ||
        (status === 500
          ? 'La solicitud no ha sido procesada'
          : internalCode === 'BDI'
          ? 'Faltan campos obligatorios'
          : 'El acceso no está permitido'),
      internalCode: internalCode || 'ERR',
    },
  };

  if (formErrors && JSON.stringify(formErrors) !== '{}') {
    response.data.formErrors = formErrors;
  }

  console.error('Error:', response);
  return response;
};
