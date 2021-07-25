require('dotenv').config()

const fs = require('fs')
const dnsd = require('dnsd')


const PORT = process.env.DNS_PORT || 5353
const HOST = process.env.HOST || 'localhost'

const server = dnsd.createServer(handler)

server.listen(PORT, HOST)

// server.zone('example.com', 'ns1.example.com', 'us@example.com', 'now', '2h', '30m', '2w', '10m')
console.log('Server running at 127.0.0.1:5353')

function handler(req, res) {
    console.log('%s:%s/%s %j', req.connection.remoteAddress, req.connection.remotePort, req.connection.type, req)

    const question = res.question[0]
    const qHostname = question.name
    const qType = question.type

    console.log('QUESTION', res.question)

    const rs = fs.readFileSync(`${__dirname}/zones/${qHostname}.zone.json`)
    const parseZone = JSON.parse(rs)
    console.log('PARSE ZONES', { qHostname, zone: parseZone })
    if (question.type == 'A') {
        const answer = parseZone[qType].find(e => e.name === qHostname)
        console.log({ answer })
        res.answer.push(answer)
    }
    if (qType === 'SOA') {
        console.log(
            'aaa', parseZone[qType]
        )
        server.zones[qHostname] = parseZone[qType]
    }
    server.ref
    res.end()

    delete server.zones[qHostname]
    console.log('zones', server.zones)
}