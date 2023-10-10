const jwt = require("jsonwebtoken");
const { User } = require("../Database");

const { TokenExpiredError } = jwt;

// @snx-mfallon You either call done, or make the method async (or return promise directly), but not both.

const catchError = (err, res) => {

    if (err instanceof TokenExpiredError) {

        return res.status(401).send({ message: "Unauthorized!" });

    }

    return res.status(401).send({ message: "Unauthorized!" });

}

module.exports.authorizeJwt = async (req, res) => {

    let token = req.headers['x-access-token'];

    if (!token) {

        return res.status(403).send({ message: "No token provided!" });

    }

    jwt.verify(token, process.env.APP_SECRET_KEY, (err, decoded) => {

        if (err) {

            return catchError(err, res);
        }

        req.userId = decoded.id;


    });
}

module.exports.verifyUser = async (req, res) => {

    const user = await User.findById(req.userId);

    if (!user || !user.verified) {

        res.status(403).send({ message: "Unauthorized!" });

    }

}