const { Joi } = require("express-validation")


const suggestionValidation = {
    addSuggestion: {
        body: Joi.object({
            name: Joi.string().min(3).max(50).required(),
            suggestion: Joi.string().min(5).max(255).required()
        })
    }
}

module.exports = suggestionValidation