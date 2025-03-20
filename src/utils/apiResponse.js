class ApiResponse {
    constructor(statusCode, data, message = "Success")
    {
        this.statusCode = statusCode
        this.data = data,
        this.message = message,
        this.success = statusCode < 400  //api server has statusCodes ranging from (100-599)

    }
}

export {ApiResponse}