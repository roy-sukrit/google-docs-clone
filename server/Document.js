const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const documentSchema = new Schema({
    _id: { type: String, trim: true },
    email:{ type: String, trim: true ,default:"public"},
    title:{ type: String, trim: true , default:"Untitiled"},
    data: { type: Object},   
}, { timestamps: true });

module.exports = mongoose.model('Document', documentSchema);