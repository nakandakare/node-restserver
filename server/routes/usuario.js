const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const Usuario = require('../models/usuario');
const app = express();  

app.get('/usuario', (req, res) => {

    let desde = req.query.desde || 0; //desde la pagina desde o 0
    desde = Number(desde);

    let limite = req.query.limite || 5; //query es lo que viene despues de ? en el link
    limite = Number(limite);

    let flag = req.query.flag || true;

    Usuario.find({estado: flag}, 'nombre email role estado google img') //si no pongo nada, me trae todo.
            .skip(desde) //trae usuarios desde...
            .limit(limite) //solo me trae 5 como si fuera paginacion
            .exec( (err,usuarios) => { //el exec hace que ejecute

                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                Usuario.countDocuments({ estado: flag }, (err, conteo) =>{
                    res.json({
                        ok: true,
                        usuarios,
                        cuantos: conteo
                    })
                })
            });
});

app.post('/usuario', (req, res) => {

    let body = req.body; //El body esta gracias a body-parser

    let usuario = new Usuario({ //mongoose 
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10), //10 = nivel de seguridad
        role: body.role
    }); 

    usuario.save( (err, usuarioDB) => {
        if(err) {
           return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuarioDB
        })
    });

});

app.put('/usuario/:id', (req, res) => {
    let id = req.params.id;
    let body =_.pick(req.body, ['nombre','email','img','role','estado'] );

    Usuario.findByIdAndUpdate( id, body, {new: true, runValidators: true} /*esto lo pongo para que me actualice el userDB*/, (err,usuarioDB) => { //Busca y actualiza a la vez.
        //no se tiene que actualizar ni el pw ni el google

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuarioDB
        });
    })

});

app.delete('/usuario/:id', (req, res) => {
    
    let id = req.params.id;

    Usuario.findByIdAndUpdate(id, {estado: false},{new: true},(err, usuarioBorrado) => {
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if(!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'usuario no encontrado'    
                }
            });
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        });
    })

});

module.exports = app;