var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userSchema = new Schema({
    
    first_name: {
        type: String,
        required: true,
    },

    last_name: {
        type: String,
        required: true
    },

   cnic:{
        type:String,
        required: true,
        unique: true
    },

    phonenumber: {
        type:String,
        required: true,
        unique: true
    },
    
    email: {
        type:String,
        required: true,
        unique: true
    },

    password: {
        type:String,
        required: true,
    }
   
});

module.exports = mongoose.model('User', userSchema)
