// const asyncHandler = (requestHandler) => {
//     (requestHandler,res,next) => {
//         Promise.resolve(requestHandler(req,res,next)).catch((err) => next(err))
//     }
// } Promises way of writing utility function for production grade code 


const asyncHandler = (fn) => async (err,req,res,next) => {
    try {
        await fn(req,res,next)
    } catch (error) {
        res.status(err.code || 500).json({
            success : false,
            message: err.message
        })
        
    }
}

export {asyncHandler}