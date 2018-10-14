class Timer {
  bind(contract) {
    contract.on('schedule', (date, name, ...args) => {
      setTimeout(() => {
        let sender = 'root'
        contract.call({ sender, name, args })
      }, date.valueOf() - new Date().valueOf())
    })
  }
}

module.exports = Timer
