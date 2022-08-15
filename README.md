# Convenient data validation library!
Validate data with the comfort of your soul!
```
npm i js-simple-validator
```

- [Examples](#examples)
  - [Basic usage](#examples_basic)
  - [Simple field validation](#examples_field)
  - [No errors mode](#examples_noerr)
- [Custom validation](#custom_validation)
  - [assert](#assert)
  - [custom](#custom)
  - [try](#try)
- [Custom error messages](#messages)
- [Validator methods](#validator)
- [Validator.rule methods](#rule)
  - [Default validate methods](#rule_defaults)

<a name="examples"></a>
## Examples
<a name="examples_basic"></a>
### Basic usage

```typescript
import {Validator} from 'js-simple-validator';
```

```javascript
let validator = Validator.make({
    id      : Validator.rule.setRequired().isInt(),
    name    : Validator.rule.setRequired().isString().trim().length(1, 255),
    comment : Validator.rule.isString().trim().length(0, 4096),
    star    : Validator.rule.setDefault(1).isInt().range(1, 5)  
});

try{

    let data = {
        id : 22,
        name : 'Name'
    };
	
    let result = validator.validate(data);

    console.log('Example 1 success:', result);

}catch (e){ //ValidatorError
    console.log('Example 1 error:', e);
}
```
```javascript
{
  id: 22, 
  name: 'Name',
  comment: null,
  star : 1
}
```
<a name="examples_field"></a>
### Simple field validation
```javascript
let field = Validator.rule
    .isString()
    .regex(/^[A-z]+$/);

try {
	
    let value = 'Test';
        
    let result = field.validate(value);

    console.log('Example 2 success:', result);
}catch (e){ //ValidatorFieldError
    console.log('Example 2 error:', e);
}
```

<a name="examples_noerr"></a>
### No errors mode
In case of an error, no exception will be thrown. Instead - the field will get a default value (or null).

**For all fields in Validator:**
```javascript
Validator
    .make(...)
    .errNo();
```
**For simple field:**
```javascript
Validator.rule
    .isString()
    .length(1, 2)
    .errNo()
    .setDefault('No');
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
