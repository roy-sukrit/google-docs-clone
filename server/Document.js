const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const documentSchema = new Schema({
    _id: { type: String, trim: true },
    data: { type: Object},   
}, { timestamps: true });

module.exports = mongoose.model('Document', documentSchema);