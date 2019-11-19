const app = require('../app');
const Pug = require('koa-pug');
const pug = new Pug({
    viewPath: './views',
    basedir: './views',
    app: app,
});

const crud = {
    startBooks: 3,
    page: undefined,
    max: undefined,
    pug: () =>
        pug.render('test', {
            max: 1,
        })
};
module.exports = crud;
