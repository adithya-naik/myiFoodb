 const mangoose = require('mongoose');
 const { Schema } = mangoose;

  const UserSchema = new Schema({ 
    name:{
      type : String,
      required : true
    },
    email:{
      type : String,
      required : true
    },
    password:{
      type : String,
      required : true
    },
    date:{
      type : Date,
      default : Date.now
    },
    location:{
      type : String,
      required : true
    },
  });

module.exports =  mangoose.model('users', UserSchema);