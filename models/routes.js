const Router = require('koa-router');
const database = require('./query');
const router = new Router();

router
    .get('/', async(ctx) => {
        ctx.redirect('/main');
    })
    .get('/main', async(ctx) => {
        let renderPage = await database.getAll();
        await ctx.render('mainPage', {renderPage})
        })
    .get('/:id', async(ctx) => {
        let betList = await database.getBets(ctx.params.id);
        let renderPage = await database.getById(ctx.params.id);
        await ctx.render('eventPage', {renderPage, betList})
    })
    .get('/2', async(ctx) => {
        ctx.body = await database.getAll();
    });



module.exports = router;
