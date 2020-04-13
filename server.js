//setting up restify servers
const restify = require('restify')

const server = restify.createServer()

server.listen(process.env.port || process.env.PORT || 3978,() => {
      

    console.log(`${server.name} listening on ${server.url}`)
    console.log('Welcome')
})

module.exports = server;