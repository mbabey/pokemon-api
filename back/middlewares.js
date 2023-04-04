const { asyncWrapper } = require("./asyncWrapper.js");
const logModel = require('./logModel.js');
const jwt = require("jsonwebtoken");

const authUser = asyncWrapper(async (req, res, next) => {
    const auth_header = req.header('authorization');
    const token = (auth_header) ? auth_header : null;

    if (!(token && isAccess(token))) {
        throw new PokemonAuthError("No Token: Please provide the access token using the headers.")
    }
    try {
        const verified = jwt.verify(token.split(' ')[1], process.env.ACCESS_TOKEN_SECRET)
        next()
    } catch (err) {
        throw new PokemonAuthError("Invalid Token Verification. Log in again.")
    }
})

const authAdmin = asyncWrapper(async (req, res, next) => {
    const token = req.header('authorization').split(',')[0];
    const payload = jwt.verify(token.split(' ')[1], process.env.ACCESS_TOKEN_SECRET)
    if (payload?.user?.role == "admin") {
        return next()
    }
    throw new PokemonAuthError("Access denied")
})

const logRequest = asyncWrapper(async (req, res, next) => {
    // get the information in the request
    const timestamp = Date.now();
    const time_start = timestamp;
    const user_id = 1;
    const status_code = 420;

    // get the information in the response
    const time_end = Date.now();

    const time_diff = time_end - time_start;
    // store it in the database
    const new_log = {
        timestamp: timestamp,
        user_id: user_id,
        endpoint: req.url,
        method: req.method,
        status_code: status_code,
        response_time: time_diff    
    };
    console.log(new_log);
    logModel.create(new_log);
    next();
});

module.exports = {
    authUser, authAdmin, logRequest
}