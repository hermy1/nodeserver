import {Config} from './types'
import dotenv from 'dotenv';
dotenv.config();

const config: Config = {
    mongo: {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '27017'),
        username: process.env.DB_USERNAME || '',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_DATABASE || ''
    },
    server: {
        secret: process.env.SECRET || 'ISJFOWIEJOWJEOIWE',
        mongoConnect: `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DATABASE}`
    },
    logging: {
        levels: {
            emerg: 0,
            alert: 1,
            error: 2,
            warning: 3,
            info: 4,
            debug: 5
        },
        colors: {
            emerg: 'strikethrough gray',
            alert: 'gray',
            error: 'red',
            warning: 'yellow',
            info: 'green',
            debug: 'blue'
        },
        silent: false,
        level: "debug",
        file: "",
      }
}

export default config