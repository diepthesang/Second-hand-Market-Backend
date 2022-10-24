const passport = require("passport");
const { ExtractJwt } = require("passport-jwt");
const db = require("../db/models");
const { v4: uuidv4 } = require('uuid');
const JWTStrategy = require('passport-jwt').Strategy
var GoogleStrategy = require('passport-google-oauth20').Strategy;


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'https://7bd3-2a09-bac0-23-00-827-7f9a.ngrok.io/auth/google/callback',
    // passReqToCallback: false
},
    async (accessToken, refreshToken, profile, cb) => {
        console.log('profile::::', profile);
        let _first_name = profile.name.familyName;
        let _last_name = profile.name.givenName;
        let _img_avt = profile.photos[0].value;
        let _email = profile.emails[0].value;

        try {
            let [user, created] = await db.User.findOrCreate(
                {
                    where: {
                        email: _email
                    },
                    defaults: {
                        userId: uuidv4(),
                        firstName: _first_name,
                        lastName: _last_name,
                        avatarImg: _img_avt,
                        emailType: 'google'
                    }
                }
            )

            if (user) {
                // req.user = user;
                return cb(null, user)
            } else {
                return cb(null, false)
            }

        } catch (error) {
            return cb(error, false)
        }
    }
));



passport.use(new JWTStrategy(
    {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken('Authorization'),
        secretOrKey: process.env.JWT_SECRETKEY
    },
    async (payload, done) => {
        console.log(payload);
        try {
            let user = await db.User.findOne(
                {
                    where: {
                        userId: payload.sub
                    }
                }
            )
            if (!user) {
                return done(null, false)
            }
            if (user) {
                return done(null, user)
            }
        } catch (error) {
            return done(error, false)
        }
    }
))


