const fs = require('fs');
const path = require('path');
const { Sequelize } = require('sequelize');
const config = require('../config/database');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];
const useLocalStorageMode = !dbConfig || !process.env.DB_HOST || process.env.DB_HOST === 'localhost' || process.env.DB_HOST === '127.0.0.1';
const storeFile = path.join(__dirname, '..', 'data', 'local-storage.json');

function ensureStoreFile() {
  const dir = path.dirname(storeFile);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(storeFile)) {
    fs.writeFileSync(storeFile, JSON.stringify({}, null, 2), 'utf8');
  }
}

function readStore() {
  ensureStoreFile();
  try {
    return JSON.parse(fs.readFileSync(storeFile, 'utf8'));
  } catch (error) {
    return {};
  }
}

function writeStore(data) {
  ensureStoreFile();
  fs.writeFileSync(storeFile, JSON.stringify(data, null, 2), 'utf8');
}

function buildLocalModel(modelName) {
  function getCollection() {
    const store = readStore();
    if (!store[modelName]) store[modelName] = [];
    return store[modelName];
  }

  function persistCollection(collection) {
    const store = readStore();
    store[modelName] = collection;
    writeStore(store);
  }

  function decorateRecord(record) {
    record.update = async function (changes = {}) {
      const rows = getCollection();
      const target = rows.find((item) => String(item.id) === String(record.id));
      if (!target) return record;
      Object.assign(target, changes, { updatedAt: new Date() });
      Object.assign(record, target);
      persistCollection(rows);
      return record;
    };

    record.destroy = async function () {
      const rows = getCollection();
      const index = rows.findIndex((item) => String(item.id) === String(record.id));
      if (index >= 0) rows.splice(index, 1);
      persistCollection(rows);
      return record;
    };

    return record;
  }

  const model = {
    create: async (payload = {}) => {
      const rows = getCollection();
      const nextId = rows.length ? Math.max(...rows.map((item) => Number(item.id) || 0)) + 1 : 1;
      const record = decorateRecord({
        id: nextId,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...payload,
      });
      rows.push(record);
      persistCollection(rows);
      return record;
    },
    findAll: async ({ where = {}, limit, order } = {}) => {
      let rows = [...getCollection()];

      if (where) {
        rows = rows.filter((row) =>
          Object.entries(where).every(([key, value]) => {
            if (value && typeof value === 'object' && '$in' in value) {
              return Array.isArray(value.$in) ? value.$in.includes(row[key]) : true;
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
    findByPk: async (id) => getCollection().find((item) => String(item.id) === String(id)) || null,
    count: async ({ where = {} } = {}) => (await model.findAll({ where })).length,
  };

  model.associate = undefined;
  return model;
}

if (useLocalStorageMode) {
  const bcrypt = require('bcryptjs');

  const localDb = {
    sequelize: {
      authenticate: async () => ({ ok: true }),
      sync: async () => ({ ok: true }),
      close: async () => ({ ok: true }),
    },
    Sequelize,
    User: buildLocalModel('User'),
    Birth: buildLocalModel('Birth'),
    Marriage: buildLocalModel('Marriage'),
    Death: buildLocalModel('Death'),
    ResidencyCertificate: buildLocalModel('ResidencyCertificate'),
    CertificateRequest: buildLocalModel('CertificateRequest'),
  };

  // Initialize demo data synchronously on startup
  try {
    const existingUsers = readStore().User || [];
    if (existingUsers.length === 0) {
      const store = readStore();
      
      const adminPassword = require('bcryptjs').hashSync('admin123', 12);
      const userPassword = require('bcryptjs').hashSync('user123', 12);

      store.User = [
        {
          id: 1,
          name: 'Admin User',
          email: 'admin@demo.com',
          password: adminPassword,
          role: 'admin',
          passwordConfirm: 'admin123',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          name: 'Demo User',
          email: 'user@demo.com',
          password: userPassword,
          role: 'user',
          passwordConfirm: 'user123',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      store.Birth = [
        {
          id: 1,
          givenName: 'John',
          surname: 'Doe',
          birthDate: '2020-01-15',
          gender: 'Male',
          birthPlace: 'City Hospital',
          fatherName: 'James Doe',
          motherName: 'Mary Doe',
          registrationNumber: 'BR-2020-001',
          status: 'completed',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          givenName: 'Sarah',
          surname: 'Smith',
          birthDate: '2021-06-20',
          gender: 'Female',
          birthPlace: 'Central Hospital',
          fatherName: 'Michael Smith',
          motherName: 'Jennifer Smith',
          registrationNumber: 'BR-2021-002',
          status: 'completed',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      store.Marriage = [
        {
          id: 1,
          groomName: 'Robert Johnson',
          brideName: 'Emily Davis',
          marriageDate: '2022-05-10',
          marriagePlace: 'City Hall',
          registrationNumber: 'MR-2022-001',
          status: 'completed',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      store.Death = [
        {
          id: 1,
          deceased: 'William Brown',
          deathDate: '2023-03-25',
          deathPlace: 'City Medical Center',
          causeOfDeath: 'Natural causes',
          registrationNumber: 'DR-2023-001',
          status: 'completed',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      store.ResidencyCertificate = [
        {
          id: 1,
          name: 'Patricia Miller',
          address: '123 Main Street, City',
          yearsOfResidency: 5,
          registrationNumber: 'RC-2023-001',
          status: 'completed',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      store.CertificateRequest = [
        {
          id: 1,
          requestType: 'Birth Certificate',
          certificateType: 'birth',
          fullName: 'John Doe',
          email: 'john@example.com',
          status: 'pending',
          priority: 'normal',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          requestType: 'Marriage Certificate',
          certificateType: 'marriage',
          fullName: 'Robert Johnson',
          email: 'robert@example.com',
          status: 'approved',
          priority: 'high',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      writeStore(store);
      console.log('✅ Demo data initialized (sync)');
      console.log('   Admin: admin@demo.com / admin123');
      console.log('   User: user@demo.com / user123');
    }
  } catch (err) {
    console.warn('⚠️ Could not initialize demo data:', err.message);
  }

  // Initialize demo data if none exist
  (async () => {
    try {
      const existingUsers = await localDb.User.findAll();
      if (existingUsers.length === 0) {
        const adminPassword = await bcrypt.hash('admin123', 12);
        const userPassword = await bcrypt.hash('user123', 12);

        await localDb.User.create({
          name: 'Admin User',
          email: 'admin@demo.com',
          password: adminPassword,
          role: 'admin',
          passwordConfirm: 'admin123',
        });

        await localDb.User.create({
          name: 'Demo User',
          email: 'user@demo.com',
          password: userPassword,
          role: 'user',
          passwordConfirm: 'user123',
        });

        console.log('✅ Demo users initialized');
        console.log('   Admin: admin@demo.com / admin123');
        console.log('   User: user@demo.com / user123');

        // Add sample birth certificates
        await localDb.Birth.create({
          givenName: 'John',
          surname: 'Doe',
          birthDate: '2020-01-15',
          gender: 'Male',
          birthPlace: 'City Hospital',
          fatherName: 'James Doe',
          motherName: 'Mary Doe',
          registrationNumber: 'BR-2020-001',
          status: 'completed',
        });

        await localDb.Birth.create({
          givenName: 'Sarah',
          surname: 'Smith',
          birthDate: '2021-06-20',
          gender: 'Female',
          birthPlace: 'Central Hospital',
          fatherName: 'Michael Smith',
          motherName: 'Jennifer Smith',
          registrationNumber: 'BR-2021-002',
          status: 'completed',
        });

        // Add sample marriages
        await localDb.Marriage.create({
          groomName: 'Robert Johnson',
          brideNam: 'Emily Davis',
          marriageDate: '2022-05-10',
          marriagePlace: 'City Hall',
          registrationNumber: 'MR-2022-001',
          status: 'completed',
        });

        // Add sample deaths
        await localDb.Death.create({
          deceased: 'William Brown',
          deathDate: '2023-03-25',
          deathPlace: 'City Medical Center',
          causeOfDeath: 'Natural causes',
          registrationNumber: 'DR-2023-001',
          status: 'completed',
        });

        // Add sample residency certificates
        await localDb.ResidencyCertificate.create({
          name: 'Patricia Miller',
          address: '123 Main Street, City',
          yearsOfResidency: 5,
          registrationNumber: 'RC-2023-001',
          status: 'completed',
        });

        // Add sample certificate requests
        await localDb.CertificateRequest.create({
          requestType: 'Birth Certificate',
          certificateType: 'birth',
          fullName: 'John Doe',
          email: 'john@example.com',
          status: 'pending',
          priority: 'normal',
        });

        await localDb.CertificateRequest.create({
          requestType: 'Marriage Certificate',
          certificateType: 'marriage',
          fullName: 'Robert Johnson',
          email: 'robert@example.com',
          status: 'approved',
          priority: 'high',
        });

        console.log('✅ Demo data initialized with sample records');
      }
    } catch (err) {
      console.warn('⚠️ Could not initialize demo data:', err.message);
    }
  })();

  module.exports = localDb;
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
