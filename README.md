# Adequate library for input validation

```
npm i js-simple-validator
```

## Examples
### Basic usage

```javascript
import {Validator, errors} from 'js-simple-validator';

let validator = Validator.make({
    name    : Validator.rule.setRequired().isString().trim().length(1, 255),
    id      : Validator.rule.setRequired().isInt().min(1),
    comment : Validator.rule.isString().trim().length(0, 400),
    count   : Validator.rule.isInt().min(1).setDefault(1),
    reg     : Validator.rule.setRequired().isString().trim().regex(/^[A-z]+$/),
    test    : Validator.rule.isInt().in([1,2,3])
});

try{

    let data = {
        name : 'Name',
        id : 22,
        reg : 'Aaaa',
        test : 1
    };
	
    //Custom errors
    validator.setCustomErrors({
        [errors.DefaultErrors.STRING_VALIDATION_ERROR] : 'Value is not string'
    });

    let result = validator.validate(data);

    console.log('Example 1 success:', result);

}catch (e){
    console.log('Example 1 error:', e);
}
```
```javascript
{ 
  name: 'Name', 
  id: 22, 
  comment: null, 
  count: 1, 
  reg: 'Aaaa', 
  test: 1
}
```

### Simple field validation
```javascript
try {
    let value = 'Test';
	
    let field = Validator.rule
        .isString()
        .try('Something wrong here', field => {
            field.assert(v => v.length > 2)  //Custom condition
                 .custom(v => v + '--' + v)  //Custom modificator
        }); //Custom error message for "try" block
        
    let result = field.validate(value);

    console.log('Example 2 success:', result);
}catch (e){
    console.log('Example 2 error:', e);
}
```
For any errors in the **"try"** block - you will see *"Something wrong here"* error message. 

If you dont use **"try"** block - you will see *"Unknown error"* message. 

### No errors mode
```javascript
//Or u can use Validator.make({...}).errNo();
let value = 'Test';
let result = Validator.rule
    .isString()
    .length(1, 2)
    .errNo()
    .setDefault('No')
    .validate(value);

console.log('Example 3 success:', result);
```

```json
"No"
```

In case of an error, no exception will be thrown. Instead - the field will get a default value (or null).

## Validator class methods
```typescript
.errNo() //Disable error throws
```
```typescript
.setCustomErrors(errors) //Custom errors texts
```
```typescript
.validate(data) //Run validate
```

## ValidatorField (Validator.rule) class methods
```typescript
.custom(fn) //"fn" must return new value 
```
```typescript
.assert(fn) //"fn" must return true/false
```
```typescript
.try(myErrorMessage, fn) //Custom error message
```
```typescript
.errNo() //Disable error throws
```
```typescript
.setDefault(val) //Set default value
```
```typescript
.setRequired(val) //Set field required
```
```typescript
.setRequired(val) //Set field required
```
```typescript
.setCustomErrors(errors) //Custom errors texts
```
```typescript
.validate(data) //Run validate
```


## Validators
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


## Modes

```typescript
.trim()
```
```typescript
.toJSON(parse = false)
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
