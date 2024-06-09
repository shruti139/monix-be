const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
              return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
            },
            message: props => `${props.value} is not a valid email!`
          },
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
        default:"user"
    },
    
},{timestamps:true});

//Export the model
module.exports = mongoose.model('User', userSchema);