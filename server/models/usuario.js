const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let rolesValidos= {
    values: ['ADMIN_ROLE','USER_ROLE'],
    message: '{VALUE} no es un rol válido' //mensaje de error, el value va a ser super_role por ejemplo.
}

let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    email: {
        type: String,
        unique: true,
        required: [true,'El email es necesario']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    img: {
        type: String,
        required: false
    },// no es obg
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos //los datos tiene que ser algunos de este enumeracion
    },// default: 'USER_ROLE
    estado: {
        type: Boolean,
        default: true
    }, //boolean
    google: {
        type: Boolean,
        default: false
    } //boolean
});

//con esto hacemos que la contraseña no aparerzca en postman
usuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject
}

usuarioSchema.plugin( uniqueValidator, {message: '{PATH} debe de ser unico'} );

module.exports = mongoose.model( 'Usuario', usuarioSchema); 