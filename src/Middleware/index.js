const jwt = require("jsonwebtoken");
const { User } = require("../Database");

const { TokenExpiredError } = jwt;

const catchError = (err, res) => {

    if (err instanceof TokenExpiredError) {

        return res.status(401).type('application/json').send({ message: "Unauthorized!" });

    }

    return res.status(401).type('application/json').send({ message: "Unauthorized!" });

}

module.exports.authorizeJwt = async (req, res) => {

    let token = req.headers['x-access-token'];

    if (!token) {

        return res.status(403).type('application/json').send({ message: "No token provided!" });

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

        res.status(403).type('application/json').send({ message: "Unauthorized!" });

    }

}