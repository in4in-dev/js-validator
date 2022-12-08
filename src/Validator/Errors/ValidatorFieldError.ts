import ValidatorThrowable from "./ValidatorThrowable";

export default class ValidatorFieldError extends ValidatorThrowable
{
	constructor(message : string) {
		super(message);
	}

}