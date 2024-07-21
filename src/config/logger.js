import { createLogger, transports, format} from "winston";
const logFormat = format.combine(
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => {
        return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
    })
);

const logLevels = {
    debug: 0,
    http: 1,
    info: 2,
    warning: 3,
    error: 4,
    fatal: 5,
};



const developmentLogger = createLogger({
    levels: logLevels,
    format: logFormat,
    transports: [new transports.Console()],
    level: 'debug',
});

const productionLogger = createLogger({
    levels: logLevels,
    format: logFormat,
    transports: [
        new transports.File({ filename: './logs/errors.log', level: 'error' }),
    ],
    level: 'info',
});


export { developmentLogger, productionLogger };