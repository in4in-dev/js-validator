import ValidatorFieldError from "./Errors/ValidatorFieldError";
import IsEmail from "isemail";
import moment from "moment";
import * as DefaultErrors from './Errors/Dictionary/DefaultErrors';
import ValidatorErrorMessagesList from "./Errors/ValidatorErrorMessagesList";

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
	protected errors : ValidatorErrorMessagesList = DefaultErrors;

	protected addQueue(fn : ValidatorFieldFn) : this
	{
		this.queue.push(fn);
		return this;
	}

	public try(message : string, fn : (field : this) => void) : this
	{
		return this.setMessage(message), fn(this), this.clearMessage();
	}

	/**
	 * Заменяет стандартные сообщения об ошибках
	 */
	public setCustomErrors(errors : ValidatorErrorMessagesList = {}){
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

	protected setMessage(message : string) : this
	{
		return this.addQueue(item => {
			this.message = message;
		})
	}

	protected clearMessage()
	{
		return this.addQueue(item => {
			this.message = 'Unknown validate error';
		});
	}

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
			.try(this.errors.STRING_VALIDATION_ERROR, () => {

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
			.try(this.errors.NUMERIC_VALIDATION_ERROR, () => {

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
			.try(this.errors.INT_VALIDATION_ERROR, () => {

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
			.try(this.errors.STRING_LENGTH_VALIDATION_ERROR, () => {
				this.assert(item => item.length >= min && item.length <= max);
			})
	}

	/**
	 * Проверка числа
	 */
	public range(min : number, max : number) : this
	{
		return this
			.try(this.errors.RANGE_VALIDATION_ERROR, () => {
				this.assert(item => item >= min && item <= max);
			})
	}

	/**
	 * Число больше или равно
	 */
	public min(min : number) : this
	{
		return this
			.try(this.errors.MIN_VALIDATION_ERROR, () => {
				this.assert(item => item >= min)
			})
	}

	/**
	 * Число меньше или равно
	 */
	public max(max : number) : this
	{
		return this
			.try(this.errors.MAX_VALIDATION_ERROR, () => {
				this.assert(item => item <= max);
			})
	}

	/**
	 * Число больше
	 */
	public after(min : number) : this
	{
		return this
			.try(this.errors.AFTER_VALIDATION_ERROR, () => {
				this.assert(item => item > min);
			})
	}

	/**
	 * Число меньше
	 */
	public before(max : number) : this
	{
		return this
			.try(this.errors.BEFORE_VALIDATION_ERROR, () => {
				this.assert(item => item < max)
			})
	}

	/**
	 * Валидная карта
	 */
	public isCreditCard() : this
	{
		return this
			.try(this.errors.CARD_VALIDATION_ERROR, () => {
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
			.try(this.errors.DATE_VALIDATION_ERROR, () => {
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
			.try(this.errors.EMAIL_VALIDATION_ERROR, () => {
				this.assert(item => IsEmail.validate(item));
			})
	}

	/**
	 * Валидный json
	 */
	public isJSON(parse : boolean = true) : this
	{
		return this
			.try(this.errors.JSON_VALIDATION_ERROR, () => {

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
			.try(this.errors.LC_VALIDATION_ERROR, () => {
				this.assert(item => item === item.toLowerCase());
			})
	}

	/**
	 * Верхний регистр
	 */
	public isUpperCase() : this
	{
		return this
			.try(this.errors.UC_VALIDATION_ERROR, () => {
				this.assert(item => item === item.toUpperCase());
			})
	}


	/**
	 * Обрезает пробельные символы строки
	 */
	public trim() : this
	{
		return this
			.try(this.errors.TRIM_ERROR, () => {
				this.custom(item => item.trim());
			})
	}

	/**
	 * Является массивом
	 */
	public isArray() : this
	{
		return this
			.try(this.errors.ARRAY_VALIDATION_ERROR, () => {
				this.assert(item => item instanceof Array);
			})
	}

	public isObject() : this
	{
		return this
			.try(this.errors.OBJECT_VALIDATION_ERROR, () => {
				this.assert(item => (item instanceof Object));
			})
	}

	/**
	 * Значение одно из
	 */
	public in(values : any[]) : this
	{
		return this
			.try(this.errors.IN_VALIDATION_ERROR, () => {
				this.assert(item => values.indexOf(item) >= 0);
			})
	}

	/**
	 * Значение НЕ одно из
	 */
	public notIn(values : any[]) : this
	{
		return this
			.try(this.errors.NOT_IN_VALIDATION_ERROR, () => {
				this.assert(item => values.indexOf(item) < 0);
			})
	}

	/**
	 * Тест регуляркой
	 */
	public regex(reg : RegExp) : this
	{
		return this
			.try(this.errors.REGEX_VALIDATION_ERROR, () => {
				this.assert(item => reg.test(item));
			})
	}

	/**
	 * Поиск по регулярке
	 */
	public regexSearch(reg : RegExp) : this
	{
		return this
			.try(this.errors.REGEX_VALIDATION_ERROR, () => {
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
			.try(this.errors.STRIP_TAGS_ERROR, () => {
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
			.try(this.errors.ENCODE_HTML_CHARS_ERROR, () => {
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
			.try(this.errors.URL_DECODE_ERROR, () => {
				this.custom(item => encodeURIComponent(item));
			})
	}

	/**
	 * Строка является ключем в объекте
	 */
	public inObjectKeys(obj : any) : this
	{
		return this
			.try(this.errors.IN_OBJECT_KEYS_VALIDATION_ERROR, () => {
				this.assert(item => (item in obj))
			})
	}

	////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////


	public assert(fn : (item : any) => boolean, message : string | null = null) : this
	{

		if(message){
			return this.try(message, () => {
				this.assert(fn);
			})
		}

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


	public validate(value : any) : any
	{

		if(value === undefined || value === null){

			if(this.required && this.errorsEnabled){
				throw new ValidatorFieldError(this.errors.REQUIRED_VALIDATION_ERROR);
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