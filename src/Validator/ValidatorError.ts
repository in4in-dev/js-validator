export default class ValidatorError extends Error
{
	public field : string;

	constructor(field : string, message : string) {
		super(message);
		this.field = field;
	}

}