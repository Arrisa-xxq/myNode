let bcrypt = require("bcryptjs");
let password = "alex123";

//加密： hashSync
var hash = bcrypt.hashSync(password,10);
console.log(hash);

//校验： compareSync
let pass = bcrypt.compareSync(password,hash);//true/false
console.log(pass);