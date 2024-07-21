import { developmentLogger, productionLogger } from '../config/logger.js';
import config from '../config/env-config.js';
export const addLogger = (req, res, next) => {
   
    const isDevelopment = config.envirponment === 'development';
    const logger = isDevelopment ? developmentLogger : productionLogger;
    logger.info(`Request URL: ${req.url}`);
  
    next();
  };