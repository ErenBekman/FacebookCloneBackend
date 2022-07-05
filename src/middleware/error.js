const catchError = (err,req,res,next) => {
    res.json({ msg : err.message })
}
module.exports = catchError