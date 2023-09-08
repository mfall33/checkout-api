module.exports.generateRandomNumber = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

module.exports.paginationOptions = (req) => {

    return {
        page: parseInt(req.query.page, 10) || 0,
        limit: parseInt(req.query.limit, 10) || 10
    }

}

module.exports.roundDownToNearestTen = (number) => {
    return Math.floor(number / 10) * 10;;
}