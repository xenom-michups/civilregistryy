const { Sequelize } = require('sequelize');
const config = require('../config/database');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
    define: dbConfig.define,
    pool: dbConfig.pool,
  }
);

const db = {
  sequelize,
  Sequelize,
  User: require('./User')(sequelize, Sequelize.DataTypes),
  Birth: require('./Birth')(sequelize, Sequelize.DataTypes),
  Marriage: require('./Marriage')(sequelize, Sequelize.DataTypes),
  Death: require('./Death')(sequelize, Sequelize.DataTypes),
  ResidencyCertificate: require('./ResidencyCertificate')(sequelize, Sequelize.DataTypes),
  CertificateRequest: require('./CertificateRequest')(sequelize, Sequelize.DataTypes),
};

// Run associations if defined
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;
