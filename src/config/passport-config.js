import passport from 'passport';
import GitHubStrategy from 'passport-github2';
import { Strategy as LocalStrategy } from 'passport-local';
import userModel from '../dao/models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../config/env-config.js';

const initializePassport = () => {
    

    passport.use('github', new GitHubStrategy({
        clientID: config.clientId,
        clientSecret: config.clientSecret,
        callbackURL: 'http://localhost:8080/api/sessions/githubcallback',
        passReqToCallback: true,
        scope: ['user:email'],
    },
    (req, accessToken, refreshToken, profile, cb) => {
        const email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : '';
        const verifyUser = async () => {
            try {
               
                const user = await userModel.findOne({ email });
    
                if (user) {
                    return cb(null, user);
                }
    
                
                const newUser = {
                    first_name: profile.name || 'DefaultFirstName',
                    last_name: 'DefaultLastName',
                    email,
                    age: 18,
                    password: 'defaultPassword',
                };
                const createdUser = await userModel.create(newUser);
                return cb(null, createdUser);
            } catch (error) {
                return cb(error);
            }
        };
    
        verifyUser().catch((error) => cb(error));
    }));

    passport.use(
        'local-login',
        new LocalStrategy(
            { usernameField: 'email' },
            async (email, password, done) => {
                try {
                    const user = await userModel.findOne({ email });

                    if (!user) {
                        return done(null, false, { message: 'User does not exist' });
                    }

                    const isPasswordValid = await bcrypt.compare(password, user.password);

                    if (!isPasswordValid) {
                        return done(null, false, { message: 'Incorrect password' });
                    }


                    return done(null, user); 
                } catch (error) {
                    return done(error);
                }
            }));

    passport.use(
        'local-signup',
        new LocalStrategy(
            {
                usernameField: 'email',
                passwordField: 'password',
                passReqToCallback: true,
            },
            async (req, email, password, done) => {
                try {
                    const { first_name, last_name, email, age, password } = req.body;
                    const exists = await userModel.findOne({ email });
                    if (exists) {
                        return done(null, false, { message: 'User already exists' });
                    }

                    // Hash the password before saving it to the database
                    const hashedPassword = await bcrypt.hash(password, 10);

                    const user = {
                        first_name,
                        last_name,
                        email,
                        age,
                        password: hashedPassword,
                    };

                    await userModel.create(user);
                    return done(null, user);
                } catch (err) {
                    return done(err);
                }
            }
        )
    );

    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    passport.deserializeUser(function (user, done) {
        done(null, user);
    });

};

export default initializePassport;