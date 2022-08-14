export default class ValidatorError extends Error
{
	public field : string;
	public value : any;

	constructor(field : string, value : any, message : string) {
		super(message);
		this.field = field;
		this.value = value;
	}

}