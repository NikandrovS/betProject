const database = require('./query');

async function prizeCalc (winner, ctx) {
    let eventWinners;
    let totalBets = await database.getTotalBets(ctx.params.id);
    let totalSum = (totalBets[0].total1 + totalBets[0].total2);
    let coeff;
    switch (winner) {
        case "won1":
            eventWinners = await database.getBets1(ctx.params.id);
            coeff = (( totalSum / totalBets[0].total1 ) * 0.975 ).toFixed(2);
            await Payoff(eventWinners, coeff);
            break;
        case "won2":
            eventWinners = await database.getBets2(ctx.params.id);
            coeff = (( totalSum / totalBets[0].total2 ) * 0.975 ).toFixed(2);
            await Payoff(eventWinners, coeff);
            break;
        default:
            break;
    }
    function Payoff(eventWinners, coeff) {
        let i = 0;
        do {
            let prize = (eventWinners[i].bet * coeff);
            database.addBalance(prize, eventWinners[i].player);
            ++i;
        } while (eventWinners[i])
    }
}
module.exports = prizeCalc;
