const Router = require('koa-router');
const passport = require('koa-passport');
const database = require('./query');
const payoff = require('./payoff');
const router = new Router();

router
    .get('/', async(ctx) => {
        await ctx.render('successPage');
    })
    .get('/bets/main', async(ctx) => {
        if (ctx.isAuthenticated()) {
            let renderPage = await database.getAll();
            let stats = await database.getStats();
            await ctx.render('mainPage', {renderPage, stats})
        } else {
            await ctx.render('loginPage');
            ctx.throw(401);
        }
    })
    .get('/bets/event/:id', async(ctx) => {
        if (ctx.isAuthenticated()) {
            let user = ctx.state.user;
            let renderPage = await database.getById(ctx.params.id);
            if (!renderPage[0]) {
                let errorText = "Эта страница удалена или еще не создана";
                await ctx.render('errorPage', {errorText});
                return false
            } else {
                let betList = await database.getTopBets(ctx.params.id);
                let betsResult1 = await database.getBets1(ctx.params.id);
                let betsResult2 = await database.getBets2(ctx.params.id);
                await ctx.render('eventPage', {renderPage, betList, betsResult1, betsResult2, user})
            }
        } else {
            ctx.body = { success: false };
            ctx.throw(401);
        }
    })
    .post('/bets/event/:id', async(ctx) => {
        if (ctx.isAuthenticated()) {
            let getResult = ctx.request.body;
            payoff(getResult.winner, ctx);
            await database.setWinner( getResult.winner, ctx.params.id );
            ctx.redirect('/bets/event/' + ctx.params.id);
        } else {
            ctx.body = { success: false };
            ctx.throw(401);
        }
    })
    .post('/bets/placeBet/:id', async(ctx) => {
        if (ctx.isAuthenticated()) {
            let sum = ctx.request.body.sum;
            let user = ctx.state.user.username;
            ctx.request.body.id = ctx.params.id;
            ctx.request.body.player = user;
            try {
                await database.writeOff(sum, user);
            } catch (err) {
                let errorText = "Недостаточно средств";
                await ctx.render('errorPage', {errorText});
                return false
            }
            await database.placeBet(ctx.request.body);
            ctx.redirect('/bets/event/' + ctx.params.id);
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
            successRedirect: '/bets/main',
            failureRedirect: '/login'
        })
    )
    .post('/registration', async(ctx) => {
        try {
            await database.newUser(ctx.request.body);
        } catch (err) {
            let errorText = "Имя пользователя или никнейм уже занят";
            await ctx.render('errorPage', {errorText});
            return false
        }
    })
    .get('/logout', async (ctx) => {
        if (ctx.isAuthenticated()) {
            ctx.logout();
            ctx.redirect('/login');
        } else {
            ctx.body = { success: false };
            ctx.throw(401);
        }
    })
    .get('/bets/balance', async (ctx) => {
        if (ctx.isAuthenticated()) {
            let withdraws = await database.lastWithdraws(ctx.state.user.username);
            await ctx.render('balance', {withdraws});
        } else {
            ctx.body = { success: false };
            ctx.throw(401);
        }
    })
    .get('/bets/admin', async(ctx) => {
        if (ctx.isAuthenticated() && ctx.state.user.username === "Sanriko") {
            let withdraws = await database.getWithdraws();
            let usernames = await database.getUsernames();
            await ctx.render('adminPage', {withdraws, usernames});
        } else {
            ctx.body = "Доступ запрещен";
            ctx.throw(401);
        }

    })
    .post('/bets/admin', async(ctx) => {
        if (ctx.isAuthenticated() && ctx.state.user.username === "Sanriko") {
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
            ctx.redirect('/bets/event/' + lastId[0].id);
        } else {
            ctx.body = "Доступ запрещен";
            ctx.throw(401);
        }

    })
    .post('/addBalance', async(ctx) => {
        if (ctx.isAuthenticated() && ctx.state.user.username === "Sanriko") {
            database.addBalance(ctx.request.body.sum, ctx.request.body.username);
            ctx.redirect('/bets/admin');
        } else {
            ctx.body = "Доступ запрещен";
            ctx.throw(401);
        }

    })
    .post('/writeOff', async(ctx) => {
        if (ctx.isAuthenticated()) {
            let user;

            if (ctx.state.user.username === "Sanriko") {
                user = ctx.request.body
            } else {
                user = ctx.state.user;
            }
            let sum = ctx.request.body.sum;
            let username = user.username;
            try {
                await database.writeOff(sum, username);
                await database.newWithdraw(sum, username);
            } catch (err) {
                let errorText = "Недостаточно средств";
                await ctx.render('errorPage', {errorText});
                return false
            }
            ctx.redirect('/bets/balance', {user});
        } else {
            ctx.body = "Доступ запрещен";
            ctx.throw(401);
        }
    })
    .post('/bets/done/:id', async(ctx) => {
        if (ctx.isAuthenticated()) {
            let result = await database.setWithdraw(ctx.request.body.id);

            let promise = new Promise(function(res){
                if (result.affectedRows) {
                    res('done');
                }
            });

            ctx.body = await promise;
        } else {
            ctx.body = "Доступ запрещен";
            ctx.throw(401);
        }

    });



module.exports = router;
