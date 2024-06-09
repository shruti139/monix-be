const { Joi } = require("express-validation")


const companyValidation ={
    addCompany:{
        body:Joi.object({
            name:Joi.string().required(),
            emaployeeId:Joi.string().required()
        })
    }
}

module.exports = companyValidation