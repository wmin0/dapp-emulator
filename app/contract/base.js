const EventEmitter = require('events')

class Base extends EventEmitter {
  constructor(io, contracts, address) {
    super()
    this.io = io
    this.contracts = contracts
    this.address = address
  }
  modifierApply(fn, ...modifiers) {
    modifiers.forEach((modifier) => {
      let f = fn
      fn = function(...args) {
        return modifier.call(this, f, ...args)
      }
    })
    return fn
  }
  modifierCall(fn, args) {
    return fn.apply(this, Array.from(args).slice(1))
  }
  schedule(date, name, ...args) {
    this.emit('schedule', date, name, ...args)
  }
  call({ sender, name, args }) {
    console.log(`call ${this.address} ${name}.`)
    let fn = this[name]
    if (!fn || !(fn instanceof Function)) {
      console.error(`${sender} call ${name} ${args} failed.`)
      throw 'invalid name'
    }
    return fn.call(this, sender, ...args)
  }
  emit(name, ...args) {
    console.log(`emit ${this.address} ${name}.`)
    super.emit(name, ...args)
    this.io.to(`${this.address}.${name}`).emit('contract.event', {
      address: this.address,
      name: name,
      args: args
    })
  }
}

module.exports = Base
