import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  jwt_secret: process.env.JWT_SECRET || 'some-super-secret-key',
  database: {
    port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
    type: process.env.POSTGRES_TYPE || 'postgres',
    host: process.env.POSTGRES_HOST || 'localhost',
    database: process.env.POSTGRES_DB || 'kupipodariday',
    username: process.env.POSTGRES_USER || 'student',
    password: process.env.POSTGRES_PASSWORD || 'student',
    entities: [__dirname + '/../**/*.entity.js'],
    schema: process.env.POSTGRES_SCHEMA || 'public',
    synchronize: true
  } as PostgresConnectionOptions
});
