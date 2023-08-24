const mongoose = require('mongoose'),
      passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema( //cada vez que haya una informacion
    {
        //variables que tomo del registro
        username: String,
        password: String,
        phone: Number,
        telephone: Number
    }
)

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User",userSchema); //exporto el archivo a app con el nombre de "Usuario" (coleccion)