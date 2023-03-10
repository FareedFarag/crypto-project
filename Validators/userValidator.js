"use strict";
const joi = require("joi");

const validateOpts = {
  abortEarly: false,
  stripUnknown: true,
  errors: {
    escapeHtml: true,
  },
  errors: {
    wrap: {
      label: "",
    },
  },
};

/*************************************
 * Validate User Creation Body
 *************************************/

const createUserSchema = joi.object({
  username: joi
    .string()
    .min(3)
    .token()
    .lowercase()
    .required()
    .label("Username"),

  email: joi.string().email().label("Email"),

  firstName: joi.string().min(1).token().required().label("First Name"),

  lastName: joi.string().min(1).token().required().label("Last Name"),

  password: joi.string().min(6).required().label("Password"),

  passwordConfirmation: joi
    .any()
    .equal(joi.ref("password"))
    .required()
    .label("Confirm password")
    .messages({ "any.only": "{{#label}} does not match" }),
});

function validateUserCreationBody(req, res, next) {
  const { value, error } = createUserSchema.validate(req.body, validateOpts);

  // check for validation erros
  if (error) {
    console.error(error);

    // get errors
    const errorMessages = error.details.map((detail) => detail.message);

    // respond with errors
    // return res.status(400).json({"error" : errorMessages});

    // errorMessages.forEach(error => {
    //     console.log("error:" + error.message);
    // })

    console.log("error messages debug", errorMessages);

    req.flash("validationErrors", errorMessages);
    return res.redirect("/register");
  }

  // overwrite body with valid data
  req.body = value;

  // pass control to next function
  next();
}

/*************************************
 * Validate Login Body
 *************************************/
const loginSchema = joi.object({
  username: joi.string().min(3).token().lowercase().required(),

  password: joi.string().min(6).required(),
});

function validateLoginBody(req, res, next) {
  const { value, error } = loginSchema.validate(req.body, validateOpts);

  // check for validation erros
  if (error) {
    console.error(error);

    // get errors
    const errorMessages = error.details.map((detail) => detail.message);

    // respond with errors
    // return res.status(400).json({"error" : errorMessages});
    console.log("errorMessages: ", errorMessages);
    return res.status(400).render("./login", { errorMessages });
  }

  // overwrite body with valid data
  req.body = value;

  // pass control to next function
  next();
}

module.exports = {
  validateUserCreationBody,
  validateLoginBody,
};
