export const ErrorMessageType = {
    message: 'String',
    status: 500,
    code: 'String',
};
export const errorCodes = {
    PRODUCT_NOT_FOUND: 'PRODUCT_NOT_FOUND',
    PRODUCT_ADD_FAILED_ADD_FAILED: 'PRODUCT_ADD_FAILED',
    MISSING_DATA: 'MISSING_DATA',
    INVALID_DATA: 'INVALID_DATA',
};

export const errorMessages = {
    PRODUCT_NOT_FOUND: {
        message: 'The product couldnt be found',
        status: 404,
        code: 'PRODUCT_NOT_FOUND',
    },
    PRODUCT_ADD_FAILED: {
        message: 'No se pudo agregar el producto',
        status: 500,
        code : 'PRODUCT_ADD_FAILED',
    },
    MISSING_DATA: {
        message: 'Faltan datos',
        status: 401,
        code : 'MISSING_DATA',
    },
    INVALID_DATA: {
        message: 'Los datos proporcionados no son válidos',
        status: 402,
        code : 'INVALID_DATA',
    }
};

