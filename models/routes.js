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
    .post('/main', async(ctx) => {
        await database.createEvent(ctx.request.body);
        let lastId = await database.getLastId();
        ctx.redirect('/event/' + lastId[0].id);
    })
    .get('/event/:id', async(ctx) => {
        let betList = await database.getBets(ctx.params.id);
        let renderPage = await database.getById(ctx.params.id);
        await ctx.render('eventPage', {renderPage, betList})
    })
    .post('/event/:id', async(ctx) => {
        ctx.request.body.id = ctx.params.id;
        await database.addNewBet(ctx.request.body);
        ctx.redirect('/event/' + ctx.params.id);
    })
    .get('/2', async(ctx) => {
        ctx.body = await database.getAll();
    });



module.exports = router;
