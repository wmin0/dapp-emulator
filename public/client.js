class Client {
  constructor(socket) {
    this.listeners = {}
    this.socket = socket

    this.onContractEvent = this.onContractEvent.bind(this)

    this.socket.on('contract.event', this.onContractEvent)
  }
  on(address, name, fn) {
    let key = `${address}.${name}`
    let listeners = this.listeners[key]
    if (listeners) {
      listeners.push(fn)
      return Promise.resolve()
    }
    this.listeners[key] = [ fn ]
    return new Promise((resolve, reject) => {
      this.socket.emit('client.contract.subscribe', { address, name }, resolve)
    })
  }
  off(address, name, fn) {
    let key = `${address}.${name}`
    let listeners = this.listeners[key]
    if (!listeners) {
      return Promise.resolve()
    }
    let idx = listeners.indexOf(fn)
    if (idx === -1) {
      return Promise.resolve()
    }
    listeners.splice(idx, 1)
    if (listeners) {
      return Promise.resolve()
    }
    delete(this.listeners[key])
    return new Promise((resolve, reject) => {
      this.socket.emit('client.contract.unsubscribe', { address, name }, resolve)
    })
  }
  onContractEvent({ address, name, args }) {
    let key = `${address}.${name}`
    let listeners = this.listeners[key] || []
    listeners.forEach((fn) => fn(...args))
  }
  setID(id) {
    return new Promise((resolve, reject) => {
      this.socket.emit('client.id', { id }, resolve)
    })
  }
  call(address, name, ...args) {
    return new Promise((resolve, reject) => {
      this.socket.emit('client.contract.call', {address, name, args }, resolve)
    }).then((resp) => {
      if (resp.success) {
        return resp.data
      }
      throw resp.error
    })
  }
}
