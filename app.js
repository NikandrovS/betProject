const Koa = require('koa');
const serve = require("koa-static");
const koaBody = require('koa-body');
const session = require('koa-session');
const passport = require('koa-passport');
const router = require('./models/routes');
const app = new Koa();

const path = require('path');
const Pug = require('koa-pug');

app.keys = ['super-secret-key'];
app.use(session(app));

require('./models/auth');
app.use(passport.initialize());
app.use(passport.session());

app.use(koaBody());
app.use(router.routes());
app.use(router.allowedMethods());
app.use(serve('public'));

const pug = new Pug({
    viewPath: path.resolve(__dirname, './views'),
    basedir: './views',
    app: app
});

app.listen(3000, () => {
    console.log('Сервер запущен -> http://localhost:3000/');
});
