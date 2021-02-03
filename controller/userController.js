const db = require('../database')
const cryptojs = require('crypto-js')
const {asyncQuery} = require('../helpers/queryHelp')
const { createToken} = require('../helpers/jwt')
const jwt = require('jsonwebtoken')
const SECRET_KEY = '!@#$%^&*'
const TOKEN_KEY = '!@#$%^&*'

module.exports = {
    register: async(req, res) => {
        let { username, password, email } = req.body
        let hashPass = cryptojs.HmacMD5(password, SECRET_KEY)

        try {
            const uid = Date.now().toString().slice(9)
            const querylog = `INSERT INTO users(username, password, email, uid) VALUES (${db.escape(username)}, ${db.escape(hashPass.toString())}, ${db.escape(email)}, ${db.escape(uid)})`
            console.log(querylog)
            await asyncQuery(querylog)
            const checkUsers = `SELECT id, username, email, uid FROM users WHERE username = ${db.escape(username)} AND password = ${db.escape(hashPass.toString())}`
            let rescheck = await asyncQuery(checkUsers)
            const tokens = createToken({ uid: rescheck[0].uid, role: rescheck[0].role })
            let body = {
                id: rescheck[0].id,
                uid: rescheck[0].uid,
                username: rescheck[0].username,
                email: rescheck[0].email, 
                token : tokens
            }
            res.status(200).send(body)
        }
        catch (err) {
            res.status(400).send(err)
        }

    },
    login: async(req, res) => {
        let {username, password} = req.body
        let hashPass = cryptojs.HmacMD5(password, SECRET_KEY)
        try{
            const querylog = `SELECT id, uid, username, email, status, role FROM users WHERE username = ${db.escape(username)} AND password = ${db.escape(hashPass.toString())} `
            const result = await asyncQuery(querylog)
            if(result[0].status === 2) res.status(200).send('Your Account has been Deactivated')
            if(result[0].status === 3) res.status(200).send('Your Account has been Closed')
            const tokens = createToken({ uid: result[0].uid, role: result[0].role })
            console.log('ulala ', tokens)
            console.log(result[0].uid)
            let body = {
                id: result[0].id,
                uid: result[0].uid,
                username: result[0].username,
                email: result[0].email, 
                token : tokens
            }
            res.status(200).send(body)
        }
        catch(err){
            res.status(400).send(err)
        }
    },
    deactiveAcc: async(req, res) => {
        let {token} = req.body
        console.log(token)
        const hasil = jwt.verify(token, TOKEN_KEY)
        console.log('hasil', hasil)

        try{    
            const querylog = `UPDATE users SET status = 2 WHERE uid = ${hasil.uid} AND role = ${hasil.role}`
            await asyncQuery(querylog)
            const checkUsers = `SELECT u.uid, s.status AS status FROM users u left join status s
                                ON u.status = s.id                   
                                WHERE u.uid = ${hasil.uid} AND u.role = ${hasil.role} `
            const result = await asyncQuery(checkUsers)
            res.status(200).send(result)
        }
        catch(err){
            res.status(400).send(err)
        }
    },
    closeAcc: async(req, res) => {
        let {token} = req.body
        console.log(token)
        const hasil = jwt.verify(token, TOKEN_KEY)
        console.log('hasil', hasil)

        try{    
            const querylog = `UPDATE users SET status = 3 WHERE uid = ${hasil.uid} AND role = ${hasil.role}`
            await asyncQuery(querylog)
            const checkUsers = `SELECT u.uid, s.status AS status FROM users u left join status s
                                ON u.status = s.id                   
                                WHERE u.uid = ${hasil.uid} AND u.role = ${hasil.role}  `
            const result = await asyncQuery(checkUsers)
            res.status(200).send(result)
        }
        catch(err){
            res.status(400).send(err)
        }
    },
    ActiveAcc: async(req, res) => {
        let {token} = req.body
        console.log(token)
        const hasil = jwt.verify(token, TOKEN_KEY)
        console.log('hasil', hasil)

        try{    
            const checkUsers = `SELECT u.uid, s.status AS status FROM users u left join status s
                                ON u.status = s.id                   
                                WHERE u.uid = ${hasil.uid} AND u.role = ${hasil.role} `
            const result = await asyncQuery(checkUsers)
            if (result[0].status === 'closed') return res.status(200).send('Your account has been Closed Please make new account')
            const querylog = `UPDATE users SET status = 1 WHERE uid = ${hasil.uid} AND role = ${hasil.role}`
            await asyncQuery(querylog)
            const result1 = await asyncQuery(checkUsers)
            res.status(200).send(result1)
        }
        catch(err){
            res.status(400).send(err)
        }
    }
}