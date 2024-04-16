const {response} = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../model/Usuario');
const { generarJWT } = require('../helpers/jwt');

const crearUsuario = async(req, res = response) => {
    const { email, password} = req.body;

    try {
        let usuario = await Usuario.findOne({email});

        if(usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'Ya existe un usuario con ese nombre'
            });
        }

        usuario = new Usuario(req.body);

        // Encriptar contrasena
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);
    
        await usuario.save();

        // Generar JWT
        const token = await generarJWT(usuario.id, usuario.name);
    
        res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        })
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administardor'
        })
    }
};

const loginUsuario = async(req, res = response) => {
    const {email, password} = req.body;

    try {
        const usuario = await Usuario.findOne({email});

        if(!usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no existe con ese email'
            });
        }

        // Confirmar los password
        const validarPassword = bcrypt.compareSync(password, usuario.password);
        if(!validarPassword){
            return res.status(400).json({
                ok: false,
                msg: 'Password incorrecto'
            });
        }

        // Generar JWT
        const token = await generarJWT(usuario.id, usuario.name);

        res.json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        })
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administardor'
        })
    }
};

const revalidarToken = async(req, res = response) => {
    const uid = req.uid;
    const name = req.name;

    // Generar nuevo JWT y retornarlo en esta peticion
    const token = await generarJWT(uid, name);
    res.json({
        ok: true,
        uid,
        name,
        token,
    })
};

module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
};