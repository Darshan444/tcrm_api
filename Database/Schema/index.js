import fs from 'fs';
import path from 'path';
import { Sequelize, DataTypes } from 'sequelize';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const configModule = await import(path.join(__dirname, '../../Configs/database.js'));
const config = configModule.default[env];

const db = {};

let sequelize;
if (config.use_env_variable) {
    sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
    sequelize = new Sequelize(config.database, config.username, config.password, config);
}

const files = fs.readdirSync(__dirname).filter((file) => {
    return file.indexOf('.') !== 0 && file !== basename && file.endsWith('.js');
});

for (const file of files) {
    const modelModule = await import(path.join(__dirname, file));
    const model = modelModule.default(sequelize, DataTypes);
    db[model.name] = model;
}

for (const modelName of Object.keys(db)) {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
