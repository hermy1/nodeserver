import {Config} from './types'

const config: Config = {
    mongo: {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '27017'),
        username: process.env.DB_USERNAME || 'admin',
        password: process.env.DB_PASSWORD || 'root',
        database: process.env.DB_DATABASE || 'test'
    },
    server: {
        secret: process.env.SECRET || 'ISJFOWIEJOWJEOIWE'
    }
}

export default config