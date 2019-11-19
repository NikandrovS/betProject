const query = require('mysql-query-promise');
const config = require('config');

const crud = {
    getAll: async () => {
        return query('SELECT id, event, until, result1, SUM(bet1) as total1, result2, SUM(bet2) as total2,status\n' +
            'FROM events, deposits WHERE events.id=deposits.event_id\n' +
            'GROUP BY id\n' +
            'ORDER BY status;');
        // return query(`SELECT * FROM events ORDER BY status;`);
    },
    getById: async (id) => {
        return query(`SELECT id, event, until, result1, SUM(bet1) as total1, result2, SUM(bet2) as total2,status
            FROM events, deposits WHERE events.id=deposits.event_id AND id='?'
            GROUP BY id
            ORDER BY status;`,[Number(id)]);
    },
    getBets: async (id) => {
        return query(`SELECT bet1 + bet2 as bet, player FROM deposits
            where event_id='?'
            order by bet desc
            LIMIT 5 OFFSET 0;`, [Number(id)]);
    }
};
module.exports = crud;
