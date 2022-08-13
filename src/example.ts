import {Validator} from "./index";

//EXAMPLE 1
//Default use
let validator = Validator.make({
	name    : Validator.rule.setRequired().isString().trim().length(1, 255),
	id      : Validator.rule.setRequired().isInt().min(1),
	comment : Validator.rule.isString().trim(),
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


//Simple validate rule
try {
	let value = 'Test';
	let field = Validator.rule
		.isString()
		.setMessage('Length must be > 2') //Custom error message before assert method
		.assert(v => v.length > 2)  //Custom condiftion
		.custom(v => v + '--' + v)  //Custom modificator
		.validate(value);

	console.log('Example 2 success:', field);
}catch (e){
	console.log('Example 2 error:', e);
}

//No errors mode
//Or u can use Validator.make({...}).errNo();
let value2 = 'Test';
let field2 = Validator.rule
	.isString()
	.length(1, 2)
	.errNo()
	.setDefault('No')
	.validate(value2);

console.log('Example 3 success:', field2);

