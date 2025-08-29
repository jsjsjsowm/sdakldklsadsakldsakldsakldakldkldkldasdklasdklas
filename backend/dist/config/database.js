"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const config_1 = require("./config");
// Initialize Sequelize based on database type
let sequelize;
if (config_1.config.database.dialect === 'postgres') {
    exports.sequelize = sequelize = new sequelize_1.Sequelize(config_1.config.database.url, {
        dialect: 'postgres',
        logging: config_1.config.nodeEnv === 'development' ? console.log : false,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
    });
}
else {
    // SQLite configuration
    const dbPath = config_1.config.database.url.replace('sqlite:', '');
    exports.sequelize = sequelize = new sequelize_1.Sequelize({
        dialect: 'sqlite',
        storage: dbPath,
        logging: config_1.config.nodeEnv === 'development' ? console.log : false,
    });
}
//# sourceMappingURL=database.js.map