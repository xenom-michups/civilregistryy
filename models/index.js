const { Sequelize } = require('sequelize');
const config = require('../config/database');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];
const useMemoryStore = !dbConfig || !process.env.DB_HOST || process.env.DB_HOST === 'localhost' || process.env.DB_HOST === '127.0.0.1';

function buildMemoryModel(modelName) {
  const collection = [];

  function decorateRecord(record) {
    record.update = async function (changes = {}) {
      const target = collection.find((item) => String(item.id) === String(record.id));
      if (!target) return record;
      Object.assign(target, changes, { updatedAt: new Date() });
      Object.assign(record, target);
      return record;
    };

    record.destroy = async function () {
      const index = collection.findIndex((item) => String(item.id) === String(record.id));
      if (index >= 0) collection.splice(index, 1);
      return record;
    };

    return record;
  }

  const model = {
    create: async (payload = {}) => {
      const nextId = collection.length ? Math.max(...collection.map((item) => Number(item.id) || 0)) + 1 : 1;
      const record = decorateRecord({
        id: nextId,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...payload,
      });
      collection.push(record);
      return record;
    },
    findAll: async ({ where = {}, limit, order } = {}) => {
      let rows = [...collection];

      if (where) {
        rows = rows.filter((row) =>
          Object.entries(where).every(([key, value]) => {
            if (value && typeof value === 'object' && '$in' in value) {
              return value.$in.includes(row[key]);
            }
            return row[key] === value;
          })
        );
      }

      if (order && order.length) {
        const [field, direction] = order[0];
        rows.sort((a, b) => {
          const av = a[field] ?? '';
          const bv = b[field] ?? '';
          if (av < bv) return direction === 'DESC' ? 1 : -1;
          if (av > bv) return direction === 'DESC' ? -1 : 1;
          return 0;
        });
      }

      if (limit) rows = rows.slice(0, Number(limit));
      return rows;
    },
    findOne: async ({ where = {} } = {}) => {
      const rows = await model.findAll({ where });
      return rows[0] || null;
    },
    findByPk: async (id) => collection.find((item) => String(item.id) === String(id)) || null,
    count: async ({ where = {} } = {}) => (await model.findAll({ where })).length,
  };

  model.associate = undefined;
  return model;
}

if (useMemoryStore) {
  const memoryDb = {
    sequelize: {
      authenticate: async () => ({ ok: true }),
      sync: async () => ({ ok: true }),
      close: async () => ({ ok: true }),
    },
    Sequelize,
    User: buildMemoryModel('User'),
    Birth: buildMemoryModel('Birth'),
    Marriage: buildMemoryModel('Marriage'),
    Death: buildMemoryModel('Death'),
    ResidencyCertificate: buildMemoryModel('ResidencyCertificate'),
    CertificateRequest: buildMemoryModel('CertificateRequest'),
  };

  module.exports = memoryDb;
  return;
}

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

Object.keys(db).forEach((modelName) => {
  if (db[modelName] && db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;
