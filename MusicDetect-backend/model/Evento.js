const {Schema, model} = require('mongoose');

const EventoSchema = Schema({
    name: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: false,
    },
    title: {
        type: String,
        required: true,
    },
    tags: {
        type: Array,
        required: false
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }
});

EventoSchema.method('toJSON', function() {
    const {__v, _id, ...object} = this.toObject();
    object.id = _id;
    return object;
})

module.exports = model('Evento', EventoSchema);