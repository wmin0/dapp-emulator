const assert = require('assert')
const Base = require('./base')

class Token extends Base {
  constructor(...args) {
    super(...args)
    this.balance = {}

    // modifier declares
    this.modify = this.modifierApply(this.modify, this.onlyRoot)
  }
  // events
  emitBalanceUpdate(user, amount) {
    this.emit('balance.update', user, amount)
  }
  // modifiers
  onlyRoot(fn, sender) {
    assert.ok(sender === 'root', `sender === 'root'`)
    return this.modifierCall(fn, arguments)
  }
  // functions
  getUserBalance(sender, user) {
    return this.balance[user] || 0
  }
  transfer(sender, to, amount) {
    let fromAmount = this.balance[sender] || 0
    let toAmount = this.balance[to] || 0
    assert.ok(fromAmount >= amount, `fromAmount >= amount`)

    this.balance[sender] = fromAmount - amount
    this.balance[to] = toAmount + amount

    this.emitBalanceUpdate(sender, this.balance[sender])
    this.emitBalanceUpdate(to, this.balance[to])
  }
  modify(sender, to, amount) {
    assert.ok(amount >= 0, `amount >= 0`)

    this.balance[to] = amount

    this.emitBalanceUpdate(to, this.balance[to])
  }
}

module.exports = Token
