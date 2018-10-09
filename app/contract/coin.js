const assert = require('assert')
const Base = require('./base')

class Coin extends Base {
  constructor(...args) {
    super(...args)
  }
  // events
  emitBalanceUpdate(user, amount) {
    this.emit('balance.update', user, amount)
  }
  // functions
  roll(sender, amount) {
    let win = Math.random() > 0.5
    if (win) {
      this.contracts.call(this.address, 'token', 'transfer', sender, amount)
    } else {
      this.contracts.call(sender, 'token', 'transfer', this.address, amount)
    }
    return win
  }
}

module.exports = Coin
