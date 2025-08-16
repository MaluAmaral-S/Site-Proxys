const Sequelize = require('sequelize');
const sequelize = new Sequelize('gerenciamento_proxyxpress', 'root', '7599', {
    host: 'localhost',
    dialect: 'mysql'

});

module.exports = {
    Sequelize: Sequelize,
    sequelize: sequelize
}