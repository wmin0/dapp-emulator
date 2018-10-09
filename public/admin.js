document.addEventListener('DOMContentLoaded', async () => {

let socket = io()
let client = new Client(socket)

await client.setID('root')
await client.on('token', 'balance.update', (user, amount) => {
  console.log(`${user} balance = ${amount}`)
})

window.modifyBalance = async (user, amount) => {
  return await client.call('token', 'modify', user, amount)
}

window.getBalance = async (user) => {
  return await client.call('token', 'getUserBalance', user)
}

console.log(`%c await modifyBalance(user, amount)`, `color: #39C5BB`)
console.log(`%c await getBalance(user)`, `color: #39C5BB`)

})
