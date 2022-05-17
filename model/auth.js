const bcrypt = require("bcryptjs/dist/bcrypt");

const { default: mongoose } = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'name must be provided'],
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'email must be provided'],
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                'Please provide a valid email',
        ]
    },
    password: {
        type: String,
        required: [true, 'Password must be provided'],
    },
    avatar: {
        type: String,
        default: ''
    }, 
    active: {
        type: Boolean,
        default: false,
    },
    activeToken: String,
    activeExpires: Date
})

UserSchema.methods.matchPassword = async function(password){
    return await bcrypt.compare(password, this.password);
}

UserSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt)

})

module.exports = mongoose.model('User', UserSchema);