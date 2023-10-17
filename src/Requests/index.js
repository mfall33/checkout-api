// AUTH

module.exports.loginFields = [
    {
        field: 'email',
        rules: {
            required: true
        }
    },
    {
        field: 'password',
        rules: {
            required: true,
        }
    }
];

module.exports.registerFields = [
    {
        field: 'email',
        rules: {
            required: true,
            email: true,
        }
    },
    {
        field: 'password',
        rules: {
            required: true,
            minLength: 8,
            includesUpperCaseChars: 1,
            includesSpecialChars: 1,
        }
    }
];