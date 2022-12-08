# Convenient data validation library!
Validate data with the comfort of your soul!
```
npm i js-simple-validator
```

- [Examples](#examples)
  - [Basic usage](#examples_basic)
  - [Simple field validation](#examples_field)
  - [No errors mode](#examples_noerr)
- [Validator methods](#validator)
- [Validator.rule methods](#rule)
  - [Default validate methods](#rule_defaults)
- [Custom validation](#custom_validation)
  - [assert](#assert)
  - [custom](#custom)
  - [try](#try)
- [Custom error messages](#messages)

<a name="examples"></a>
## Examples
<a name="examples_basic"></a>
### Basic usage

```typescript
import {Validator} from 'js-simple-validator';
```

```javascript
try{
	
    let data = {
        id : 1,
        name : 'Tomato',
        price : 25.22
    }
	
    let {id, name, price, comment} = Validator.make(
        {
            id      : Validator.rule.setRequired().isInt(),
            name    : Validator.rule.setRequired().isString().trim().length(1, 255),
            price   : Validator.rule.setRequired().isNumeric().after(0).max(10000),
            comment : Validator.rule.setDefault(null).isString().length(1, 4096)
        }
    ).validate(data);
	
    console.log(id);      //Number(1)
    console.log(name);    //String('Tomato')
    console.log(price);   //Number(25.22)
    console.log(comment); //Null
	
}catch(ValidatorError e){
    console.log(e);
}
```
<a name="examples_field"></a>
### Simple validation
```javascript
try{

    let validator = Validator.rule
        .isString()
        .regex(/^[A-z]+$/);
	
	let result = validator.validate('Value');
	
}catch (ValidatorFieldError e){
    console.log(e);
}
```

<a name="examples_noerr"></a>
### No errors mode
In case of an error, no exception will be thrown. Instead - the field will get a default value (or null).

**For all fields in Validator:**
```javascript
Validator.make(...).errNo().validate(...);
```
**For current rule:**
```javascript
Validator.rule.isString().errNo();
```

<a name="validator"></a>
## Validator methods
```typescript
Validator.errNo()
```
```typescript
Validator.setCustomErrors(errors)
```
```typescript
Validator.validate(data)
```

<a name="rule"></a>
## Validator.rule methods
```typescript
.custom(fn)
```
```typescript
.assert(fn [, message])
```
```typescript
.try(message, fn)
```
```typescript
.errNo()
```
```typescript
.setDefault(val)
```
```typescript
.setRequired()
```
```typescript
.setCustomErrors(errors)
```
```typescript
.validate(data)
```

<a name="rule_defaults"></a>
### Default validate methods
```typescript
.isString()
```
```typescript
.isNumeric()
```
```typescript
.isInt()
```
```typescript
.isBoolean()
```
```typescript
.length(min, max)
```
```typescript
.range(min, max)
```
```typescript
.min(min)
```
```typescript
.max(max)
```
```typescript
.in(values)
```
```typescript
.notIn(values)
```
```typescript
.regex(regularExpression)
```
```typescript
.regexSearch(regularExpression)
```
```typescript
.after(min)
```
```typescript
.before(max)
```
```typescript
.isCreditCard()
```
```typescript
.isDate(format = 'YYYY-MM-DD')
```
```typescript
.isEmail()
```
```typescript
.isJSON(parse = true)
```
```typescript
.isLowerCase()
```
```typescript
.isUpperCase()
```
```typescript
.isArray()
```
```typescript
.isObject()
```
```typescript
.inObjectKeys(obj)
```
```typescript
.trim()
```
```typescript
.isJSON(parse = false)
```
```typescript
.stripTags()
```
```typescript
.encodeHtmlChars()
```
```typescript
.urlDecode()
```

<a name="custom_validation"></a>
## Custom validation
<a name="assert"></a>
### assert(fn [,errorMessage])
The function must return true or false.
```typescript
Validator.rule
    .isString()
    .assert(item => item.length > 5)
    .stripTags();
```
<a name="custom"></a>
### custom(fn)
The function must throw an error or return a new value. Any type.
You can throw only **ValidatorFieldError** from the **custom** callback.
```typescript
Validator.rule.isString().custom(item => {

    if (item.length > 5) {
        throw new ValidatorFieldError('Bad length');
    }

    return item.substr(0, 2);

});
````
<a name="try"></a>
### try(errorMessage, fn)
Everything that happens inside this function will cause a specific error:
```typescript
Validator.rule.isString().try('Specific error message', field => {
	
    field.custom(item => item.split("|"))
         .assert(item => item.length > 5);
    
});
````

<a name="messages"></a>
## Custom error messages
To change default error messages - use **setCustomErrors**
```typescript
import {errors} from 'js-simple-validator';

console.log(errors.DefaultErrors);

let myErrorMessages = {
    'isString' : 'String is bad',
    'trim' : 'Trim error'
}
```
```typescript
Validator.make({...}).setCustomErrors(myErrorMessages)
```

```typescript
Validator.rule.isString().setCustomErrors(myErrorMessages);
````