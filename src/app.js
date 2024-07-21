import express from 'express';
import session from 'express-session';
import __dirname from './utils.js';
import handlebars from 'express-handlebars';
import viewsRouter from './routes/views.router.js';
import { configureSocket } from './socket.js';
import { connectToDatabase } from './config/database-config.js';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import initializePassport from './config/passport-config.js';
import config from './config/env-config.js';
import cookieParser from 'cookie-parser';

import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUIExpress from 'swagger-ui-express';

const mongoUrl = config.mongoUrl;

const app = express();
connectToDatabase();


import productsRouter from './routes/products.router.js';
import cartRouter from './routes/carts.router.js';
import messagesRouter from './routes/messages.router.js';
import sessionsRouter from './routes/sessions.router.js';
import usersRouter from './routes/users.router.js';


const swaggerOptions = {

    definition: {

        openapi: '3.0.1',

        info: {

            title: 'Documentacion API Adopme',

            description: 'Documentacion para uso de swagger!!'

        }

    },

    apis: [`./docs/**/*.yaml`]

}
const specs = swaggerJSDoc(swaggerOptions);
app.use('/apidocs', swaggerUIExpress.serve, swaggerUIExpress.setup(specs));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.engine('handlebars', handlebars.engine());
app.set('views', `${__dirname}/views`);
app.set('view engine', 'handlebars');
app.use(
    session({
        secret: config.secretKey,
        resave: false,
        saveUninitialized: true,
        store: MongoStore.create({
            mongoUrl: mongoUrl,
            ttl: 3600,
            mongoOptions: {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            },
        }),
        cookie: {
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production', 
            maxAge: 3600000, 
            sameSite: 'Lax', 
          }
    })
);

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(__dirname + '/public'));


app.use('/api/products', productsRouter);
app.use('/api/carts', cartRouter);
app.use('/api/messages', messagesRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/users',usersRouter);
app.use('/', viewsRouter);


const server = app.listen(config.port, () => console.log(`Servidor Express escuchando en el puerto ${config.port}`));

export const io = configureSocket(server);
