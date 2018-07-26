const mongoose = require('mongoose');

let monsterDbSchema = new mongoose.Schema({
    name: String,
    color: String
});

let Monster = mongoose.model('Monster', monsterDbSchema);
module.exports = Monster;