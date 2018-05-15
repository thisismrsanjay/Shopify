const mongoose = require('mongoose');
const crypto = require('crypto');
var userSchema = mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        match:/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password:{
        type:String,
        required:true     
    },
    profile:{
        name:{type:String},
        picture:{type:String,default:''}
    },
    address:String,
    history:[{
        date:Date,
        paid:{type:Number,default:0},
        //item:{type:Schema.Types.ObjectId,ref:''}
    }]
})
userSchema.methods.gravatar = function(size) {
  if (!this.size) size = 200;
  console.log(this.email);
  if (!this.email) return 'https://gravatar.com/avatar/?s=' + size + '&d=robohash';
  var md5 = crypto.createHash('md5').update(this.email).digest('hex');
  return 'https://gravatar.com/avatar/' + md5 + '?s=' + size + '&d=robohash';
}


module.exports = mongoose.model('User',userSchema);