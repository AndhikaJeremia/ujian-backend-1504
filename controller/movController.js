const { query } = require('../database')
const db = require('../database')
const {asyncQuery, generateQuery} = require('../helpers/queryHelp')
const jwt = require('jsonwebtoken')
const TOKEN_KEY = '!@#$%^&*'

module.exports = {
    getAll: async(req, res) => {
        try{
            const querylog = `SELECT * FROM movies`
            const result = await asyncQuery(querylog)
            res.status(200).send(result)
        }
        catch(err){
            res.status(400).send(err)
        }
    },
    get: async(req, res) => {
        try{
            // status masih belum bisa
            const querylog = `Select m.name, m.release_date, m.release_month, m.release_year, m.duration_min, m.genre, m.description, st.time as time, l.location as location, ms.status as status from schedules s
                                inner join movies m
                                inner join show_times st
                                inner join locations l
                                inner join movie_status ms
                                where ${generateQuery(req.query)};`
            const result = await asyncQuery(querylog)
            res.status(200).send(result)
        }
        catch(err){
            res.status(400).send(err)
        }
    },
    add: async(req, res) => {
        const {name, release_date, release_month, release_year, duration_min, genre, description} = req.body
        try{
            const querylog = `INSERT INTO movies(name, release_date, release_month, release_year, duration_min, genre, description) VALUES(${db.escape(name)}, ${db.escape(release_date)}, ${db.escape(release_month)}, ${db.escape(release_year)}, ${db.escape(duration_min)}, ${db.escape(genre)}, ${db.escape(description)}) `
            await asyncQuery(querylog)
            const checkMovie = `SELECT id, name, genre, release_date, release_month, release_year, duration_min, description FROM movies WHERE name = ${db.escape(name)}`
            const result = await asyncQuery(checkMovie)
            res.status(200).send(result)
        }
        catch(err){
            res.status(400).send(err)
        }
    },
    edit: async(req, res) => {
        const {status, token} = req.body
        const hasil = jwt.verify(token, TOKEN_KEY)
        try{
            const checkUsers = `select u.uid, u.role from users u 
                                left join roles r
                                on u.role = r.id                
                                WHERE u.uid = ${hasil.uid} AND u.role = ${hasil.role} `
            const result = await asyncQuery(checkUsers)
            console.log(result[0].role)
            if(result[0].role === 2) return res.status(200).send('I am sorry only admin can edit')
            const querylog =  `UPDATE movies SET status = ${status} WHERE id = ${req.params.id}`
            await asyncQuery(querylog)
            const body = {
                id : req.params.id,
                message: 'status has been changed'
            }
            res.status(200).send(body)
        }
        catch(err){
            res.status(400).send(err)
        }
    },
    set: async(req, res) => {
        try{
            // tanpa proteksi hanya admin yg bisa
            const querylog =  `UPDATE schedules SET ? WHERE id = ${req.params.id}`
            await asyncQuery(querylog, [req.body])
            const body = {
                id : req.params.id,
                message: 'status has been changed'
            }
            res.status(200).send(body)
        }
        catch(err){
            res.status(400).send(err)
        }
    }

}