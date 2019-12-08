const Router = require('koa-router');
const passport = require('koa-passport');
const database = require('./query');
const payoff = require('./payoff');
const router = new Router();

router
    .get('/', async(ctx) => {
        await ctx.render('successPage');
    })
    .get('/main', async(ctx) => {
        if (ctx.isAuthenticated()) {
            let renderPage = await database.getAll();
            await ctx.render('mainPage', {renderPage})
        } else {
            ctx.body = { success: false };
            ctx.throw(401);
        }
    })
    .post('/main', async(ctx) => {
        if (ctx.isAuthenticated()) {
            await database.createEvent(ctx.request.body);
            let lastId = await database.getLastId();
            for (let i = 1; i < 3; i++) {
                await database.placeBet({
                    result: i,
                    sum: 500,
                    player: "Sanriko",
                    id: lastId[0].id
                });
            }
            ctx.redirect('/event/' + lastId[0].id);
        } else {
            ctx.body = { success: false };
            ctx.throw(401);
        }
    })
    .get('/event/:id', async(ctx) => {
        if (ctx.isAuthenticated()) {
            let user = ctx.state.user;
            let betList = await database.getTopBets(ctx.params.id);
            let renderPage = await database.getById(ctx.params.id);
            let betsResult1 = await database.getBets1(ctx.params.id);
            let betsResult2 = await database.getBets2(ctx.params.id);
            await ctx.render('eventPage', {renderPage, betList, betsResult1, betsResult2, user})
        } else {
            ctx.body = { success: false };
            ctx.throw(401);
        }
    })
    .post('/event/:id', async(ctx) => {
        if (ctx.isAuthenticated()) {
            let getResult = ctx.request.body;
            payoff(getResult.winner, ctx);
            await database.setWinner( getResult.winner, ctx.params.id );
            ctx.redirect('/event/' + ctx.params.id);
        } else {
            ctx.body = { success: false };
            ctx.throw(401);
        }
    })
    .post('/placeBet/:id', async(ctx) => {
        if (ctx.isAuthenticated()) {
            ctx.request.body.player = ctx.state.user.username;
            ctx.request.body.id = ctx.params.id;
            try {
                await database.writeOff(ctx.request.body);
            } catch (err) {
                let user = ctx.state.user;
                let errorText = "Недостаточно средств";
                await ctx.render('errorPage', {user, errorText});
                return false
            }
            await database.placeBet(ctx.request.body);
            ctx.redirect('/event/' + ctx.params.id);
        } else {
            ctx.body = { success: false };
            ctx.throw(401);
        }
    })
    .get('/login', async(ctx) => {
        await ctx.render('loginPage');
    })
    .post('/login',
        passport.authenticate('local', {
            successRedirect: '/main',
            failureRedirect: '/login'
        })
    )
    .get('/logout', async (ctx) => {
        if (ctx.isAuthenticated()) {
            ctx.logout();
            ctx.redirect('/login');
        } else {
            ctx.body = { success: false };
            ctx.throw(401);
        }
    })
    .get('/2', async(ctx) => {
        if (ctx.isAuthenticated()) {
            let auth = ctx.isAuthenticated();
            await ctx.render('successPage', auth);
        } else {
            ctx.body = { success: false };
            ctx.throw(401);
        }

    });



module.exports = router;
