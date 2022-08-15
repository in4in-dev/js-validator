import ValidatorFieldError from "./Errors/ValidatorFieldError";
import IsEmail from "isemail";
import moment from "moment";
import DefaultErrors from './Errors/Dictionary/DefaultErrors';
import ValidatorErrorDictionary from "./Errors/ValidatorErrorDictionary";

interface ValidatorFieldFn{
	(item : any) : any
}

export default class ValidatorField
{

	protected required : boolean = false;
	protected default : any = null;
	protected message : string | null = null;
	protected errorsEnabled : boolean = true;

	protected queue : ValidatorFieldFn[] = [];
	protected errors : ValidatorErrorDictionary;

	constructor() {
		this.errors = Object.assign({}, DefaultErrors);
	}


	protected addQueue(fn : ValidatorFieldFn) : this
	{
		this.queue.push(fn);
		return this;
	}

	/**
	 * Заменяет стандартные сообщения об ошибках
	 */
	public setCustomErrors(errors : ValidatorErrorDictionary = {}){
		this.errors = Object.assign({}, this.errors, errors);
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
	 * Устанавливает актуальное Сообщение об ошибке
	 */
	protected setMessage(message : string) : this
	{
		return this.addQueue(item => {
			this.message = message;
		})
	}

	/**
	 * Сбрасывает актуальное сообщение об ошибке
	 */
	protected clearMessage() : this
	{
		return this.addQueue(item => {
			this.message = null;
		});
	}

	/**
	 * NO ERRORS мод
	 */
	public errNo() : this
	{
		this.errorsEnabled = false;
		return this;
	}


	////////////////////////////////////////////////////////////
	////////////////// Validation methods //////////////////////
	////////////////////////////////////////////////////////////

	/**
	 * Значние является строкой
	 */
	public isString() : this
	{
		return this
			.try(this.errors.isString, () => {

				this.custom(item => String(item))
					.assert(item => typeof item === 'string')

			});
	}

	/**
	 * Значение является числом
	 */
	public isNumeric() : this
	{
		return this
			.try(this.errors.isNumeric, () => {

				this.custom(item => +item)
					.assert(item => item >= -Infinity && item <= Infinity)

			});
	}

	/**
	 * Значение является целым числом
	 */
	public isInt() : this
	{
		return this
			.try(this.errors.isInt, () => {

				return this.custom(item => parseInt(item))
							.assert(item => !isNaN(item));

			});
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
			.try(this.errors.length, () => {
				this.assert(item => item.length >= min && item.length <= max);
			})
	}

	/**
	 * Проверка числа
	 */
	public range(min : number, max : number) : this
	{
		return this
			.try(this.errors.range, () => {
				this.assert(item => item >= min && item <= max);
			})
	}

	/**
	 * Число больше или равно
	 */
	public min(min : number) : this
	{
		return this
			.try(this.errors.min, () => {
				this.assert(item => item >= min)
			})
	}

	/**
	 * Число меньше или равно
	 */
	public max(max : number) : this
	{
		return this
			.try(this.errors.max, () => {
				this.assert(item => item <= max);
			})
	}

	/**
	 * Число больше
	 */
	public after(min : number) : this
	{
		return this
			.try(this.errors.after, () => {
				this.assert(item => item > min);
			})
	}

	/**
	 * Число меньше
	 */
	public before(max : number) : this
	{
		return this
			.try(this.errors.before, () => {
				this.assert(item => item < max)
			})
	}

	/**
	 * Валидная карта
	 */
	public isCreditCard() : this
	{
		return this
			.try(this.errors.isCreditCard, () => {
				this.assert(item => {

					if(item.length < 16){
						return false;
					}

					let s = item.split('').reverse().join('');

					let sum = 0;
					for (let i = 0, j = s.length, val; i < j; i++) {

						if ((i % 2) == 0) {
							val = +s[i];
						} else {
							val = +s[i] * 2;
							if (val > 9){
								val -= 9;
							}
						}

						sum += val;
					}

					return ((sum % 10) == 0);

				});
			});
	}

	/**
	 * Преобразование в дату
	 */
	public isDate(format : string = 'YYYY-MM-DD') : this
	{
		return this
			.try(this.errors.isDate, () => {
				this.custom(item => moment(item, format, true))
					.assert(item => item.isValid())
					.custom(item => item.toDate());
			})
	}

	/**
	 * Корректный E-mail
	 */
	public isEmail() : this
	{
		return this
			.try(this.errors.isEmail, () => {
				this.assert(item => IsEmail.validate(item));
			})
	}

	/**
	 * Валидный json
	 */
	public isJSON(parse : boolean = true) : this
	{
		return this
			.try(this.errors.isJSON, () => {

				if(parse){
					return this.custom(item => JSON.parse(item));
				}

				return 	this.assert(item => JSON.parse(item));

			});
	}

	/**
	 * Нижний регистр
	 */
	public isLowerCase() : this
	{
		return this
			.try(this.errors.isLowerCase, () => {
				this.assert(item => item === item.toLowerCase());
			})
	}

	/**
	 * Верхний регистр
	 */
	public isUpperCase() : this
	{
		return this
			.try(this.errors.isUpperCase, () => {
				this.assert(item => item === item.toUpperCase());
			})
	}


	/**
	 * Обрезает пробельные символы строки
	 */
	public trim() : this
	{
		return this
			.try(this.errors.trim, () => {
				this.custom(item => item.trim());
			})
	}

	/**
	 * Является массивом
	 */
	public isArray() : this
	{
		return this
			.try(this.errors.isArray, () => {
				this.assert(item => item instanceof Array);
			})
	}

	public isObject() : this
	{
		return this
			.try(this.errors.isObject, () => {
				this.assert(item => (item instanceof Object));
			})
	}

	/**
	 * Значение одно из
	 */
	public in(values : any[]) : this
	{
		return this
			.try(this.errors.in, () => {
				this.assert(item => values.indexOf(item) >= 0);
			})
	}

	/**
	 * Значение НЕ одно из
	 */
	public notIn(values : any[]) : this
	{
		return this
			.try(this.errors.notIn, () => {
				this.assert(item => values.indexOf(item) < 0);
			})
	}

	/**
	 * Тест регуляркой
	 */
	public regex(reg : RegExp) : this
	{
		return this
			.try(this.errors.regex, () => {
				this.assert(item => reg.test(item));
			})
	}

	/**
	 * Поиск по регулярке
	 */
	public regexSearch(reg : RegExp) : this
	{
		return this
			.try(this.errors.regex, () => {
				this.custom(item => reg.exec(item))
					.assert(item => item !== null);
			})
	}

	/**
	 * Удаление тегов
	 */
	public stripTags() : this
	{
		return this
			.try(this.errors.stripTags, () => {
				this.custom(item => item.replace(/<.+?(>|$)/g, ''));
			})
	}

	/**
	 * Экранирует специальные символы HTML
	 */
	public encodeHtmlChars() : this
	{

		let replaces = <any>{
			'&' : '&amp;',
			'"' : '&quot;',
			"'" : '&#039;',
			"<" : '&lt;',
			">" : '&gt;'
		}

		return this
			.try(this.errors.encodeHtmlChars, () => {
				this.custom(item => {

					if(typeof document !== 'undefined'){
						let el = document.createElement('div');
						el.textContent = item;

						return el.innerHTML;
					}

					for(let symbol in replaces){
						item = item.replace(
							new RegExp(symbol, 'g'),
							replaces[symbol]
						);
					}

					return item;

				});
			})

	}

	/**
	 * Декодирует URL-компонент
	 */
	public urlDecode() : this
	{
		return this
			.try(this.errors.urlDecode, () => {
				this.custom(item => encodeURIComponent(item));
			})
	}

	/**
	 * Строка является ключем в объекте
	 */
	public inObjectKeys(obj : any) : this
	{
		return this
			.try(this.errors.inObjectKeys, () => {
				this.assert(item => (item in obj))
			})
	}

	////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////

	public try(message : string, fn : (field : this) => void) : this
	{
		return this.setMessage(message), fn(this), this.clearMessage();
	}

	public assert(fn : (item : any) => boolean, message : string | null = null) : this
	{

		if(message){
			return this.try(message, () => {
				this.assert(fn);
			})
		}

		return this.addQueue(item => {
			if(!fn(item)){
				throw new ValidatorFieldError(this.message || 'Unknown validate error');
			}
		});

	}

	public custom(fn : (item : any) => any) : this
	{
		return this.addQueue(fn);
	}

	public validate(value : any) : any
	{

		if(value === undefined || value === null){

			if(this.required && this.errorsEnabled){
				throw new ValidatorFieldError(this.errors.required);
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

				throw new ValidatorFieldError(this.message || 'Unknown validate error');
			}

			return this.default;

		}

	}

}