const mongoose = require("mongoose");

// create Schema
const userSchema = mongoose.Schema({
    name:{type:String, require:true},
    email:{type:String, require:true},
    password:{type:String, require:true},
    age:{type:Number, require:true},
},
{
    versionKey:false,
});
// creating UserModel

const UserModel = mongoose.model("user",userSchema)

// export
module.exports = {
    UserModel
}
