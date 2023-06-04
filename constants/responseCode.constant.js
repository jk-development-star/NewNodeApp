exports.code404 = (message) => {
    return {
        success: false,
        message: message,
        statusCode: 404,
        response: [],
    };
};

exports.code400 = (message) => {
    return {
        success: false,
        message: message,
        statusCode: 400,
        response: [],
    };
};
exports.code500 = (message) => {
    return {
        success: false,
        message: message,
        statusCode: 500,
        response: [],
    };
};

exports.code200 = (result = [], message) => {
    return {
        success: true,
        message: message,
        statusCode: 200,
        response: result,
    };
};

exports.code201 = (result, message) => {
    return {
        success: true,
        message: message,
        statusCode: 201,
        response: result
    };
};

exports.code204 = (message) => {
    return {
        success: true,
        message: message,
        statusCode: 204,
        response: []
    };
};

exports.code401 = (message) => {
    return {
        success: false,
        message: message,
        statusCode: 401,
        response: [],
    };
};

//conflict
exports.code409 = (response, message) => {
    return {
        success: false,
        message: message,
        statusCode: 409,
        response: response,
    };
};

//conflict
exports.code403 = (response, message) => {
    return {
        success: false,
        message: message,
        statusCode: 403,
        response: response,
    };
};
exports.code405 = (response, message) => {
    return {
        success: false,
        message: message,
        statusCode: 405,
        response: response,
    };
};
