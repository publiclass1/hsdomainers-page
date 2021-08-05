require('dotenv').config()
const express = require('express')
const request = require('request')
const app = express()
const port = process.env.PORT
const API_TOKEN = process.env.API_TOKEN
const MAIN_PAGE_URL = process.env.MAIN_PAGE_URL;

app.get('/', async (req, res) => {
    //check 
    const domain = req.hostname;
    await new Promise((res) => {
        request.get(`${MAIN_PAGE_URL}/domains/analytics`, {
            qs: {
                domain,
                ip: req.ip,
                type: 'VIEW',
                agent: req.get('User-Agent')
            }
        }, function () {
            res()
        })
    })
    request(`${MAIN_PAGE_URL}/buy-domains/${domain}`, (err, rs, body) => {
        if (err) {
            res.status(400).send('Bad Request')
        }
        res
            .header(rs.headers)
            .send(rs.body)
    })

})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})