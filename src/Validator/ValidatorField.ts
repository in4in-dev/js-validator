import ValidatorFieldError from "./ValidatorFieldError";

interface ValidatorFieldFn{
	(item : any) : any
}

export default class ValidatorField
{

	protected required : boolean = false;
	protected default : any = null;
	protected message : string = 'Unknown validate error';
	protected errorsEnabled : boolean = true;

	protected queue : ValidatorFieldFn[] = [];

	protected addQueue(fn : ValidatorFieldFn) : this
	{
		this.queue.push(fn);
		return this;
	}

	/**
	 * Сообщение об ошибке
	 */
	public setMessage(message : string) : this
	{
		return this.addQueue(item => {
			this.message = message;
		})
	}

	/**
	 * Устанавливает дефолтное значение
	 */
	public setDefault(def : any) : this
	{
		this.default = def;
		return this;
	}

	/**
	 * Помечает поле обязательным
	 */
	public setRequired() : this
	{
		this.required = true;
		return this;
	}

	/**
	 * Значние является строкой
	 */
	public isString() : this
	{
		return this
			.setMessage('isString validation error')
			.custom(item => String(item))
			.assert(item => typeof item === 'string');
	}

	/**
	 * Значение является числом
	 */
	public isNumeric() : this
	{
		return this
			.setMessage('isNumeric validation error')
			.custom(item => +item)
			.assert(item => item >= -Infinity && item <= Infinity);
	}

	/**
	 * Значение является целым числом
	 */
	public isInt() : this
	{
		return this
			.setMessage('isInt validation error')
			.custom(item => parseInt(item))
			.isNumeric();
	}

	/**
	 * Значение является булевым
	 */
	public isBoolean() : this
	{
		return this.custom(item => !!item);
	}

	/**
	 * Проверка длинны строки
	 */
	public length(min : number, max : number) : this
	{
		return this
			.setMessage('length validation error')
			.assert(item => item.length >= min && item.length <= max);
	}

	/**
	 * Проверка числа
	 */
	public range(min : number, max : number) : this
	{
		return this
			.setMessage('range validation error')
			.assert(item => item >= min && item <= max);
	}

	/**
	 * Число больше или равно
	 */
	public min(min : number) : this
	{
		return this.range(min, Infinity);
	}

	/**
	 * Число меньше или равно
	 */
	public max(max : number) : this
	{
		return this.range(-Infinity, max);
	}

	/**
	 * Обрезает пробельные символы строки
	 */
	public trim() : this
	{
		return this.custom(item => item.trim())
	}

	/**
	 * Является массивом
	 */
	public isArray() : this
	{
		return this
			.setMessage('isArray validation error')
			.assert(item => item instanceof Array);
	}

	/**
	 * Значение одно из
	 */
	public in(values : any[]) : this
	{
		return this
			.setMessage('in validation error')
			.assert(item => values.indexOf(item) >= 0);
	}

	/**
	 * Значение НЕ одно из
	 */
	public notIn(values : any[]) : this
	{
		return this
			.setMessage('notIn validation error')
			.assert(item => values.indexOf(item) < 0);
	}

	/**
	 * Регулярное выражение
	 */
	public regex(reg : RegExp) : this
	{
		return this
			.setMessage('Regex validation error')
			.assert(item => reg.test(item));
	}

	public assert(fn : (item : any) => boolean) : this
	{

		return this.addQueue(item => {
			if(!fn(item)){
				throw new ValidatorFieldError(this.message);
			}
		});

	}

	public custom(fn : (item : any) => any)
	{
		return this.addQueue(fn);
	}

	public errNo() : this
	{
		this.errorsEnabled = false;
		return this;
	}


	public validate(value : any) : any
	{

		if(value === undefined || value === null){

			if(this.required && this.errorsEnabled){
				throw new ValidatorFieldError('required validation error');
			}

			return this.default;

		}

		try{

			return this.queue.reduce((prev, fn ) => {

				let next = fn(prev);

				if(next === undefined){
					return prev;
				}

				return next;

			}, value);

		}catch (e){

			if(this.errorsEnabled){

				if(e instanceof ValidatorFieldError){
					throw e;
				}

				throw new ValidatorFieldError(this.message);
			}

			return this.default;

		}

	}

}