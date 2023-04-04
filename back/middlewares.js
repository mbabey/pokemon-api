const { asyncWrapper } = require("./asyncWrapper.js");
const logModel = require('./logModel.js');
const userModel = require('./userModel.js');
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

    const url = req.url;
    const method = req.method;
    const timestamp = Date.now();
    const time_start = timestamp;

    res.on('finish', async () => {
        const time_end = Date.now();
        const user = getUserFromToken(req, res);
        const status_code = res.statusCode;
        const origin = req.header('origin');

        const time_diff = time_end - time_start;
        const new_log = {
            timestamp: timestamp,
            user_id: user._id,
            username: user.username,
            email: user.email,
            origin: origin,
            endpoint: url,
            method: method,
            status_code: status_code,
            response_time_ms: time_diff
        };
        console.log(new_log);
        logModel.create(new_log);
    });

    next();
});

function getUserFromToken(req, res) {
    let user;
    let refresh_token;
    let access_token;
    let token_payload;
   
    // Get the auth header either from the response or the request.
    let auth_header = res.getHeaders()['authorization']?.split(',');
    if (!auth_header) {
        auth_header = req.header('authorization')?.split(',');
    }


    // Get the refresh token.
    if (auth_header) {
        refresh_token = (auth_header.length == 2) ? auth_header[1].split(' ')[1] : auth_header[0].split(' ')[1];
    }
    // If there is no refresh token, get the access token.
    if (!refresh_token && auth_header) {
        access_token = auth_header[0].split(' ')[1];
    }
    // If there is no access token and no refresh token, get the appid as the refresh token (/logout)
    if (!refresh_token && !access_token) {
        refresh_token = req.query?.appid?.split(' ')[1]
    }


    // Get the user from a token.
    if (refresh_token) {
        token_payload = jwt.decode(refresh_token, process.env.REFRESH_TOKEN_SECRET);
        user = token_payload?.user;
    } else if (access_token) {
        token_payload = jwt.decode(access_token, process.env.ACCESS_TOKEN_SECRET);
        user = token_payload?.user;
    }

    // Just set data stuff if ya gotta
    if (!user)
    {
        user = {
            _id: 0,
            username: 'Unknown name',
            email: 'Unknown email'
        }
    }

    return user;
}

module.exports = {
    authUser, authAdmin, logRequest
}