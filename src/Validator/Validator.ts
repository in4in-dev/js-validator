import ValidatorField from "./ValidatorField";
import ValidatorError from "./Errors/ValidatorError";
import ValidatorErrorMessagesList from "./Errors/ValidatorErrorMessagesList";

interface ValidatorRules{
	[key : string] : ValidatorField
}

interface ValidatorInput{
	[key : string] : any
}

interface ValidatorOutput{
	[key : string] : any
}

export default class Validator
{

	protected rules;

	constructor(rules : ValidatorRules) {
		this.rules = rules;
	}

	public static get rule(){
		return new ValidatorField;
	}

	protected each(fn : (rule : ValidatorField, name : string) => void) : this
	{
		for(let name in this.rules){
			fn(this.rules[name], name);
		}
		return this;
	}

	public static make(rules : ValidatorRules) : ValidatorOutput
	{
		return new Validator(rules);
	}

	public validate(data : ValidatorInput) : ValidatorOutput
	{

		let result : ValidatorOutput = {};

		this.each((rule, name) => {

			let value = (name in data) ? data[name] : undefined;

			try {

				result[name] = rule.validate(value);

			}catch (e : any){
				throw new ValidatorError(name, value, e.message || 'Validator Unknown Error');
			}

		});

		return result;

	}

	public errNo() : this
	{
		return this.each(rule => rule.errNo());
	}

	public setCustomErrors(errors : ValidatorErrorMessagesList) : this
	{
		return this.each(rule => rule.setCustomErrors(errors));
	}

}