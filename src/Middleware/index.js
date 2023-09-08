const jwt = require("jsonwebtoken");
const { User } = require("../Database");

const { APP_SECRET_KEY } = process.env;
const { TokenExpiredError } = jwt;

const catchError = (err, res) => {

    if (err instanceof TokenExpiredError) {

        return res.status(401).send({
            message: "Unauthorized!",
            err: err.expiredAt.toUTCString()
        });
        
    }

    return res.status(401).send({ message: "Unauthorized!" });
}

module.exports.authorizeJwt = (req, res, done) => {

    let token = req.headers['x-access-token'];

    if (!token) {

        return res.status(403).send({ message: "No token provided!" });

    }

    jwt.verify(token, APP_SECRET_KEY, (err, decoded) => {

        if (err) {

            return catchError(err, res);
        }

        req.userId = decoded.id;

        done();
        
    });
}

module.exports.verifyUser = async (req, res, done) => {

    const user = await User.findById(req.userId);

    if (!user || !user.verified) {
        
        res.status(403).send({ message: "Unauthorized!"});

    }

    done();

}