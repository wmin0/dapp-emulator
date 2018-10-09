class Client {
  constructor(socket, contracts) {
    this.id = socket.id
    this.socket = socket
    this.contracts = contracts

    this.onContractCall = this.onContractCall.bind(this)
    this.onContractSubscribe = this.onContractSubscribe.bind(this)
    this.onContractUnsubscribe = this.onContractUnsubscribe.bind(this)
    this.onSetID = this.onSetID.bind(this)

    this.socket.on('client.id', this.onSetID)
    this.socket.on('client.contract.call', this.onContractCall)
    this.socket.on('client.contract.subscribe', this.onContractSubscribe)
    this.socket.on('client.contract.unsubscribe', this.onContractUnsubscribe)
  }
  onSetID({ id }, cb) {
    console.log(`${this.socket.id} set id as ${id}.`)
    this.id = id
    cb()
  }
  onContractCall({ id, address, name, args }, cb) {
    let contract = this.contracts.get(address)
    if (!contract) {
      cb({
        id: id,
        success: false,
        error: 'invalid contract address'
      })
      return
    }
    try {
      let resp = contract.call({
        sender: this.id,
        name: name,
        args: args,
      })
      cb({
        id: id,
        success: true,
        data: resp
      })
    } catch (e) {
      console.error(e)
      cb({
        id: id,
        success: false,
        error: e.toString()
      })
    }
  }
  onContractSubscribe({ address, name }, cb) {
    console.log(`subscribe ${address} ${name}.`)
    this.socket.join(`${address}.${name}`)
    cb()
  }
  onContractUnsubscribe({ address, name }, cb) {
    console.log(`unsubscribe ${address} ${name}.`)
    this.socket.leave(`${address}.${name}`)
    cb()
  }
  destroy() {
    this.socket.off('client.id', this.onSetID)
    this.socket.off('client.contract.call', this.onContractCall)
    this.socket.off('client.contract.subscribe', this.onContractSubscribe)
    this.socket.off('client.contract.unsubscribe', this.onContractUnsubscribe)

    this.socket = null
    this.contract = null
  }
}

module.exports = Client
