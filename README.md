# Adequate library for input validation

## Examples
### Basic usage

```javascript
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

    let result = validator.validate(data);

    console.log('Example 1 success:', result);

}catch (e){
    console.log('Example 1 error:', e);
}
```
```json
{ 
  name: 'Name', 
  id: 22, 
  comment: null, 
  count: 1, 
  reg: 'Aaaa', 
  test: 1
}
```

### Simple validation
```javascript
try {
    let value = 'Test';
    let result = Validator.rule
        .isString()
        .setMessage('Length must be > 2') //Custom error message before assert method
        .assert(v => v.length > 2)  //Custom condiftion
        .custom(v => v + '--' + v)  //Custom modificator
        .validate(value);

    console.log('Example 2 success:', result);
}catch (e){
    console.log('Example 2 error:', e);
}
```
```json
"Test--Test"
```

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

## Validators
```typescript
setMessage(message)
```
```typescript
setDefault(value)
```
```typescript
setRequired()
```
```typescript
isString()
```
```typescript
isNumeric()
```
```typescript
isInt()
```
```typescript
isBoolean()
```
```typescript
length(min, max)
```
```typescript
range(min, max)
```
```typescript
min(min)
```
```typescript
max(max)
```
```typescript
trim()
```
```typescript
isArray()
```
```typescript
in(values)
```
```typescript
notIn(values)
```
```typescript
regex(regularExpression)
```
```typescript
assert(fn)
```
```typescript
custom(fn)
```
```typescript
errNo(values)
```
