const assert = require('assert')

class ContractManager {
  constructor(io) {
    this.io = io
    this.contracts = {}
  }
  create(address, cls) {
    if (this.contracts[address]) {
      console.error(`duplicate contract ${name}.`)
      return
    }
    this.contracts[address] = new cls(this.io, this, address)
  }
  get(address) {
    return this.contracts[address]
  }
  call(sender, address, name, ...args) {
    let contract = this.contracts[address]
    assert.ok(contract, `contract`)
    return contract.call({ sender, name, args })
  }
}

module.exports = ContractManager
