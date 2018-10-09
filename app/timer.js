class Timer {
  bind(contract) {
    contract.on('schedule', (date, name, ...args) => {
      setTimeout(() => {
        let sender = 'root'
        contract.call({ sender, name, args })
      }, new Date().valueOf() - date.valueOf())
    })
  }
}

module.exports = Timer
