module.exports = class ServiceResponseHelper
{
    static Ok(data, additionalInformation) {
        return new ServiceResponse(200, 'success', data, additionalInformation);
    }

    static Partial(data, additionalInformation) {
        return new ServiceResponse(202, 'partial', data, additionalInformation);
    }

    static InternalServerError(data, additionalInformation) {
        return new ServiceResponse(500, 'Ambigious Exception Occured', data, additionalInformation);
    }

    static NotFound(data, additionalInformation) {
        return new ServiceResponse(404, 'Not Found', data, additionalInformation);
    }

    static Gone(data, additionalInformation) {
        return new ServiceResponse(300, 'Gone', data, additionalInformation);
    }
}

class ServiceResponse
{
    constructor(code, message, data, additionalInformation) {
        this.code = code;
        this.message = message;
        this.data = data;
        this.additionalInformation = Array.isArray(additionalInformation) 
                                        ? additionalInformation 
                                        : additionalInformation === undefined 
                                            ? undefined 
                                            : [additionalInformation];
    }

    get Code() {
        return this.code;
    }

    get Message() {
        return this.message;
    }

    get Data() {
        return this.data;
    }

    get AdditionalInformation() {
        return this.additionalInformation;
    }
}