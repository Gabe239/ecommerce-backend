import passport from 'passport';
import User from '../dao/models/userModel.js';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import config from '../config/env-config.js';

const mailConfig = {
  service: 'gmail',
  auth: {
      user: config.mailing.user,
      pass: config.mailing.password,
  },
}

const transport = nodemailer.createTransport(mailConfig);

export const registerUser = (req, res, next) => {
  passport.authenticate('local-signup', (err, user, info) => {
    if (err) {
      return res.status(500).send({ status: 'error', error: 'An error occurred' });
    }
    if (!user) {
      return res.status(400).send({ status: 'error', error: info.message });
    }
    req.login(user, (err) => {
      if (err) {
        return next(err);
      }
      res.send({ status: 'success', message: 'User registered' });
    });
  })(req, res, next);
};

export const loginUser = (req, res, next) => {
  passport.authenticate('local-login', (err, user, info) => {
    if (err) {
      console.log(user, info, err);
      return res.status(500).json({ error: 'An error occurred' });
    }
    if (!user) {
      return res.status(400).json({ error: info.message });
    }

    req.login(user, (err) => {
      if (err) {
        res.clearCookie("token");
        return next(err);
       
      }

      const token = jwt.sign({ userId: user._id }, config.accessToken, { expiresIn: '1h' });

      const cookieOptions = {
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production', 
        maxAge: 3600000,
        sameSite: 'Lax', 
      };

      res.cookie('jwt', token, cookieOptions);

      req.session.user = {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        age: user.age,
        role: user.role,
      };

      return res.json({ status: 'success', payload: { user }, message: 'Login successful' });
    });
  })(req, res, next);
};

export const logoutUser = (req, res) => {
  req.session.destroy();
  res.redirect('/login');
};

export const github = (req, res, next) => {
  passport.authenticate('github', { scope: ['user:email'] })(req, res, next);
};

export const githubAuthCallback = (req, res, next) => {
  passport.authenticate('github', { failureRedirect: 'api/sessions/login' }, (err, user) => {
      if (err) {
          return next(err);
      }
      if (!user) {
          return res.redirect('/');
      }
      req.session.user = {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        age: user.age,
        role: user.role,
      };
      return res.redirect('/products');
  })(req, res, next);
};
export const recoverMail = async (req, res) => {
  const email = req.params.email;
  try {
    const userEmail = await User.findOne({ email });
    if (!userEmail) {
      console.error(err);
      return res.status(404).json({ message: 'User not found' });
    }
    const token = jwt.sign({ email }, config.accessToken, { expiresIn: '1h' });

    const myMail = {
      from: `Coder test <${config.mailing.user}>` ,
      to: email,
      subject: 'Password Reset',
      text: `Click the following link to reset your password: http://localhost:8080/api/sessions/reset-password/${token}`,
    };


    transport.sendMail(myMail, (error, info) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ message: 'Failed to send reset email' });
      } else {
        console.log('Email sent: ' + info.response);
        return res.status(200).json({ message: 'Password reset link sent' });
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export const resetPassword = async (req, res) => {
  try {
    const decoded = jwt.verify(token, config.accessToken);
    const { email } = decoded;

    User.findOneAndUpdate({ email }, { password: newPassword }, (err, doc) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
      } else {
        if (!doc) {
          res.status(404).json({ message: 'User not found' });
        } else {
          res.status(200).json({ message: 'Password reset successful' });
        }
      }
    });
  }
  catch (err) {
    console.error(err);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
}
