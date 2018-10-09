const express = require('express')
const path = require('path')
const http = require('http')
const SocketIO = require('socket.io')

// some instance.
const Client = require('./app/client')
const Contracts = require('./app/contract')
const TokenContract = require('./app/contract/token')
const CoinContract = require('./app/contract/coin')
const Timer = require('./app/timer')

let app = express()
let server = http.Server(app)
let io = SocketIO(server)

app.use(express.static(path.join(__dirname, 'public')))

let clients = {}
let timer = new Timer()
let contracts = new Contracts(io)

contracts.create('token', TokenContract)
contracts.create('coin', CoinContract)
timer.bind(contracts.get('token'))

io.on('connection', (socket) => {
  socket.off = socket.removeListener

  let client = new Client(socket, contracts)
  clients[socket.id] = client
  socket.on('disconnect', () => {
    delete(clients[socket.id])
    client.destroy()
  })
})

server.listen(process.env.PORT || 3000, () => {
  console.log('opened server on', server.address())
})
