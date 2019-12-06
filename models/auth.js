const passport = require('koa-passport');
const LocalStrategy = require('passport-local').Strategy;
const database = require('./query');

let fetchUser = ( async (username) => {
  let user = await database.findOne(username);
  if (user[0]) {
    return user[0];
  } else {
    return false
  }
});

passport.serializeUser((user, done) => {
  done(null, user.username);
});

passport.deserializeUser(async (username, done) => {
  try {
    const user = await fetchUser(username);
    done(null, user);
  } catch(err) {
    done(err);
  }
});

passport.use(new LocalStrategy((username, password, done) => {
  fetchUser(username)
      .then(user => {
        console.log(user);
        if (username === user.username && password === user.password) {
          done(null, user);
        } else {
          done(null, false);
        }
      })
      .catch((err) => { done(err) });
}));
