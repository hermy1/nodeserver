import devConfig from './config.dev'
import prodConfig from './config.prod'

const type = process.env.NODE_ENV || 'development';
const config = type === 'development' ? devConfig : prodConfig;
export default config