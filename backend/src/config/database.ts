import { Sequelize } from 'sequelize';
import { config } from './config';

// Initialize Sequelize based on database type
let sequelize: Sequelize;

if (config.database.dialect === 'postgres') {
  sequelize = new Sequelize(config.database.url, {
    dialect: 'postgres',
    logging: config.nodeEnv === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  });
} else {
  // SQLite configuration
  const dbPath = config.database.url.replace('sqlite:', '');
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: dbPath,
    logging: config.nodeEnv === 'development' ? console.log : false,
  });
}

export { sequelize };
