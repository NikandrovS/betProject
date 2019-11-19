module.exports = {
    app: {
        name: 'betProject',
        version: '1.0.0'
    },
    server: {
        port: 3000
    },
    product: {
        tableName: 'events'
    },
    database: {
        master: {
            host: "localhost",
            user: "root",
            password: "password",
            port: "3306",
            database: "bets",
            connectionLimit: 5,
        }
    }
};