class Timer {
  bind(contract) {
    contract.on('schedule', (date, name, ...args) => {
      setTimeout(() => {
        let sender = 'root'
        try {
          contract.call({ sender, name, args })
        } catch (e) {
          console.error(e)
        }
      }, date.valueOf() - new Date().valueOf())
    })
  }
}

module.exports = Timer
