const query = require('mysql-query-promise');
const config = require('config');
const tableName = config.product.mainTable;


const crud = {
    getAll: async () => {
        return query(`SELECT id, event, until, result1, SUM(bet1) as total1, result2, SUM(bet2) as total2,status
            FROM events, deposits WHERE events.id=deposits.event_id
            GROUP BY id
            ORDER BY FIELD(status, "active") DESC, id desc
            LIMIT 20 OFFSET 0;`);
    },
    getById: async (id) => {
        return query(`SELECT id, event, until, result1, SUM(bet1) as total1, result2, SUM(bet2) as total2,status
            FROM events, deposits WHERE events.id=deposits.event_id AND id = ?
            GROUP BY id
            ORDER BY status;`, [Number(id)]);
    },
    getTopBets: async (id) => {
        return query(`SELECT sum(bet1)+sum(bet2) as bet, player FROM deposits
            WHERE event_id = ?
            GROUP BY player
            ORDER BY bet desc
            LIMIT 5 OFFSET 0;`, [Number(id)]);
    },
    getBets1: async (id) => {
        return query(`SELECT sum(bet1) as bet, player FROM deposits
            WHERE event_id = ? and bet1 > 0
            GROUP BY player
            ORDER BY bet desc;`, [id]);
    },
    getBets2: async (id) => {
        return query(`SELECT sum(bet2) as bet, player FROM deposits
            WHERE event_id = ? and bet2 > 0
            GROUP BY player
            ORDER BY bet desc;`, [id]);
    },
    getTotalBets: async (id) => {
        return query(`SELECT SUM(bet1) as total1, SUM(bet2) as total2
            FROM events, deposits WHERE events.id=deposits.event_id AND id = ?
            GROUP BY id;`, [id]);
    },
    createEvent: async ( {title, until, result1, result2} ) => {
        return query(`INSERT INTO ${tableName} (event, until, result1, result2) 
            VALUES (?, ?, ?, ?);`,  [title, until, result1, result2]);
    },
    getLastId: async () => {
        return query(`SELECT max(id) AS id FROM ${tableName}`);
    },
    placeBet: async ( {result, sum, player, id} ) => {
        return query(`INSERT INTO deposits (event_id, bet?, player)
            VALUES (?, ?, ?);`, [Number(result), Number(id), Number(sum), player]);
    },
    addBalance: async ( sum, player ) => {
        return query(`UPDATE users SET balance = balance + ?
	        where username = ?;`, [Number(sum), player]);
    },
    coinsPaid: async ( sum ) => {
        return query(`UPDATE stats SET coinsPaid = coinsPaid + ?
	        where id_stats = 1;`, [Number(sum)]);
    },
    getStats: async () => {
        return query(`SELECT coinsPaid, id as totalEvents, transaction_id as totalBets 
            FROM stats, events, deposits
            ORDER BY id desc, transaction_id desc
            LIMIT 1;`);
    },
    getUsernames: async () => {
        return query(`SELECT player FROM bets.deposits GROUP BY player;`);
    },
    writeOff: async ( sum, user ) => {
        return query(`UPDATE users SET balance = balance - ?
	        where username = ?;`, [Number(sum), user]);
    },
    newWithdraw: async ( sum, user ) => {
        return query(`INSERT INTO bets.withdraw (user, sum) 
            VALUES (?, ?);`, [user, Number(sum)]);
    },
    getWithdraws: async () => {
        return query(`SELECT * FROM bets.withdraw
            WHERE status = "pending";`);
    },
    setWithdraw: async (id) => {
        return query(`UPDATE bets.withdraw SET status = 'done' 
            WHERE (id_withdraw = ?);`, [id]);
    },
    lastWithdraws: async (user) => {
        return query(`SELECT * FROM bets.withdraw 
            WHERE user = ?
            ORDER BY id_withdraw desc
            LIMIT 20;`, [user]);
    },
    setWinner: async ( winner, id ) => {
        return query(`UPDATE events SET status = ? WHERE (id = ?);`, [winner, Number(id)]);
    },
    newUser: async ( {username, password} ) => {
        return query(`INSERT INTO bets.users (username, password) 
            VALUES (?, ?);`, [username, password]);
    },
    findOne: async (username) => {
        return query(`SELECT id, username, password, balance FROM bets.users
            where username = ?;`, [username]);
    },
};
module.exports = crud;
