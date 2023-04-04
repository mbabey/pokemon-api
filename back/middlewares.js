const { asyncWrapper } = require("./asyncWrapper.js");
const logModel = require('./logModel.js');
const userModel = require('./userModeal.js');
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

    const timestamp = Date.now();
    const time_start = timestamp;

    res.on('finish', () => {
        const time_end = Date.now();
        const user = getUser(req, res);
        const status_code = res.statusCode;
        const origin = req.headers('origin');

        const time_diff = time_end - time_start;
        const new_log = {
            timestamp: timestamp,
            user_id: user._id,
            username: user.username,
            email: user.email,
            origin: origin,
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

function getUser(req, res) {
    let refresh_token;
    const auth_header = res.getHeaders()['authorization']?.split(',');
    // Get the refresh token if it is in the auth header or if it is in the request query as 'appid'
    (auth_header)?(refresh_token=(auth_header.length==2)?auth_header[1].split(' ')[1]:auth_header[0].split(' ')[1]):(refresh_token=req.query?.appid?.split(' ')[1]);
    
    if (!refresh_token && (req.url == '/login' || req.url == '/register')) {
        
    }
    const token_payload = jwt.decode(refresh_token, process.env.REFRESH_TOKEN_SECRET);
    const user = token_payload.user;

    return user;
}

module.exports = {
    authUser, authAdmin, logRequest
}