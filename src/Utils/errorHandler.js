class ErrorHandler {
    /**
     * Creates an instance of ErrorHandler.
     */
    constructor() {
        this.errors = {};
    }

    /**
     * Add an error message to the specified field.
     * @param {string} field - The field to which the error message is associated.
     * @param {string} message - The error message to add.
     */
    addError(field, message) {
        if (this.errors[field]) {
            this.errors[field].push(message);
        } else {
            this.errors[field] = [message];
        }
    }


    /**
     * Validate a request object against a set of validation rules.
     * @param {Object} request - The request object to validate.
     * @param {Array} fieldValidations - An array of field validation objects.
     */
    validateRequest(request, fieldValidations) {
        for (const fieldValidation of fieldValidations) {
            const field = fieldValidation.field;
            const rules = fieldValidation.rules;
            const value = request[field];

            for (const rule in rules) {
                if (rules.hasOwnProperty(rule)) {
                    const ruleValue = rules[rule];

                    switch (rule) {
                        case 'required':
                            if (ruleValue && (value === undefined || value === null || value === '')) {
                                this.addError(field, `${field} is required.`);
                            }
                            break;
                        case 'email':
                            if (ruleValue && !this.validateEmail(value)) {
                                this.addError(field, `${field} must be a valid email.`);
                            }
                            break;
                        case 'minLength':
                            if (ruleValue && value.length < ruleValue) {
                                this.addError(field, `${field} must be at least ${ruleValue} characters long.`);
                            }
                            break;
                        case 'includesUpperCaseChars':
                            if (ruleValue && !/[A-Z]/.test(value)) {
                                this.addError(field, `${field} must contain at least ${ruleValue} uppercase character(s).`);
                            }
                            break;
                        case 'includesSpecialChars':
                            if (ruleValue && !/[!@#$%^&*]/.test(value)) {
                                this.addError(field, `${field} must contain at least ${ruleValue} special character(s).`);
                            }
                            break;
                    }
                }
            }
        }
    }

    validateEmail(email) {
        // Add your email validation logic here
        // This is a basic example, and you can replace it with a more comprehensive email validation function.
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    /**
     * Check if there are errors
     * @returns {Boolean} - Whether or not there is more than 0 errors.
    */
    hasErrors() {
        return Object.keys(this.errors).length > 0;
    }

    /**
     * Get the error messages in a structured format.
     * @returns {Object} - An object containing error messages for each field.
     */
    toString() {
        return this.errors;
    }
}

module.exports = ErrorHandler;