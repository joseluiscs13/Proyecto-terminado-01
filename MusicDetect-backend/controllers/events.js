const { response } = require("express")
const Evento = require('../model/Evento');
// const { GridFSBucket } = require('mongodb');
// const {Readable} = require('stream');
// const multer = require('multer');
const fs = require('fs');
const mediaserver = require('mediaserver');
const path = require("path");


const getEventos = async(req, res = response) => {
    const eventos = await Evento.find().populate('user','name');

    res.json({
        ok: true,
        eventos
    })
}

const crearEvento = async(req, res = response) => {
    // const storage = multer.memoryStorage();

    // const upload = multer({
    //     storage,
    //     limits: {
    //         fields: 1,
    //         fileSize: 10000000,
    //         files: 1,
    //         parts: 2,
    //     }
    // })

    // upload.single('track', (req, res, (err) => {
    //     if(err){
    //         console.log(err);
    //         return res.status(400).json({message: err.message});
    //     }
    //     else if(!req.body.name) {
    //         return res.status(400).json({message: 'No track name in request body'})
    //     }
    // }));

    // let trackName = req.body.name;
    // const readableTrackStream = new Readable();
    // readableTrackStream.push(req.file);
    // readableTrackStream.push(null);

    // const db = getConnection();

    // const bucket = new GridFSBucket(db, {
    //     bucketName: 'tracks',
    // })

    // let uploadStream = bucket.openUploadStream(trackName);
    // const id = uploadStream.id;

    // readableTrackStream.pipe(uploadStream);

    // uploadStream.on('error', () => {
    //     return res.status(500).json({msg: 'Error uploading your file'});
    // })

    // uploadStream.on('finish', () => {
    //     return res.status(201).json({msg: 'File upload successfuly', id});
    // })

    const evento = new Evento(req.body);

    try {
        evento.user = req.uid;
        const eventoGuardado = await evento.save();

        res.json({
            ok: true,
            evento: eventoGuardado
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}

const actualizarEvento = async(req, res = response) => {
    const eventoID = req.params.id;
    const uid = req.uid;

    try {
        const evento = await Evento.findById(eventoID);

        if(!evento) {
            return res.status(404).json({
                ok: false,
                msg: 'Evento no existe por ese ID'
            });
        }

        if(evento.user.toString() !== uid){
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegio de editar este evento'
            });
        }

        const nuevoEvento = {
            ...req.body,
            user: uid
        }

        const eventoActualizado = await Evento.findByIdAndUpdate(eventoID,nuevoEvento, {new: true});

        res.json({
            ok: true,
            evento: eventoActualizado
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}

const eliminarEvento = async(req, res= response) => {
    const eventoID = req.params.id;
    const uid = req.uid;

    try {
        const evento = await Evento.findById(eventoID);

        if(!evento) {
            return res.status(404).json({
                ok: false,
                msg: 'Evento no existe por ese ID'
            });
        }

        if(evento.user.toString() !== uid){
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegio de eliminar este evento'
            });
        }

        await Evento.findByIdAndDelete(eventoID);

        res.json({
            ok: true
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}

module.exports = {
    getEventos,
    crearEvento,
    actualizarEvento,
    eliminarEvento
}
