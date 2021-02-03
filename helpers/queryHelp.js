const util = require('util')
const database = require('../database')

module.exports = {
    generateQuery: (body) => {
        let result = ''
        for (let key in body) {
            result += ` ${key} = ${database.escape(body[key])} AND`
        }
        return result.slice(0, -3)
    },
    asyncQuery: util.promisify(database.query).bind(database)
}