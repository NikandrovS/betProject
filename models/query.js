const query = require('mysql-query-promise');
const config = require('config');
const tableName = config.product.mainTable;


const crud = {
    getAll: async () => {
        return query(`SELECT id, event, until, result1, SUM(bet1) as total1, result2, SUM(bet2) as total2,status
            FROM events, deposits WHERE events.id=deposits.event_id
            GROUP BY id
            ORDER BY status
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
    writeOff: async ( {result, sum, player, id} ) => {
        return query(`UPDATE users SET balance = balance - ?
	        where username = ?;`, [Number(sum), player]);
    },
    setWinner: async ( winner, id ) => {
        return query(`UPDATE events SET status = ? WHERE (id = ?);`, [winner, Number(id)]);
    },
    newUser: async ( {username, nickname, password} ) => {
        return query(`INSERT INTO bets.users (username, nickname, password) 
            VALUES (?, ?, ?);`, [username, nickname, password]);
    },
    findOne: async (username) => {
        return query(`SELECT id, username, password, balance FROM bets.users
            where username = ?;`, [username]);
    },
};
module.exports = crud;
