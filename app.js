const router = require('./models/routes');
const koaBody = require('koa-body');
const serve = require("koa-static");
const Koa = require('koa');
const app = new Koa();

const path = require('path');
const Pug = require('koa-pug');

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
        console.log('Сервер запущен -> http://localhost:3000/admin')
});
