import Validator from "./Validator/Validator";
import ValidatorField from "./Validator/ValidatorField";
import ValidatorError from "./Validator/Errors/ValidatorError";
import ValidatorFieldError from "./Validator/Errors/ValidatorFieldError";
import * as DefaultErrors from "./Validator/Errors/Dictionary/DefaultErrors";

let errors = {
	DefaultErrors
}

export {Validator, ValidatorField, ValidatorFieldError, ValidatorError, errors}