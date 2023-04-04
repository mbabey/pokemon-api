const { asyncWrapper } = require("./asyncWrapper.js");
const logModel = require('./logModel.js');
const jwt = require("jsonwebtoken");
const { reserved } = require("mongoose/lib/schema.js");

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

    // store it in the database

    res.on('finish', () => {
        // get the information in the response
        let refresh_token;
        const auth_header = res.getHeaders()['authorization']?.split(',');
        if (auth_header) {
            refresh_token = (auth_header.length == 2) ? auth_header[1].split(' ')[1] : auth_header[0].split(' ')[1];
        } else {
            refresh_token = req.query.appid.split(' ')[1];
        }
        const token_payload = jwt.decode(refresh_token, process.env.REFRESH_TOKEN_SECRET);

        const time_end = Date.now();
        const user = token_payload.user;
        const status_code = res.statusCode;

        const time_diff = time_end - time_start;

        const new_log = {
            timestamp: timestamp,
            user_id: user._id,
            username: user.username,
            email: user.email,
            endpoint: req.url,
            method: req.method,
            status_code: status_code,
            response_time: time_diff
        };
        console.log(new_log);
        logModel.create(new_log);
    });

    next();
});

function getUser(req) {
    if (auth_header) {

    } else {
        console.log(req.body);
    }

}

module.exports = {
    authUser, authAdmin, logRequest
}