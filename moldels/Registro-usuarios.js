
const db = require('./db');


const Registro = db.sequelize.define('usuarios', {
    'nome': {
        type: db.Sequelize.STRING
    },
    'sobrenome': {
        type: db.Sequelize.STRING
    },
    'email': {
        type: db.Sequelize.STRING
    },
    'ddi': {
        type: db.Sequelize.STRING
    },
    'telefone': {
        type: db.Sequelize.STRING
    },
    'senha': {
        type: db.Sequelize.STRING
    }
});




module.exports = Registro