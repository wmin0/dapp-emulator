document.addEventListener('DOMContentLoaded', async () => {

let socket = io()
let client = new Client(socket)

await client.setID('owo')
await client.on('token', 'balance.update', (user, amount) => {
  console.log(`${user} balance = ${amount}`)
})

window.roll = async (amount) => {
  return await client.call('coin', 'roll', amount)
}

window.getBalance = async (user) => {
  return await client.call('token', 'getUserBalance', user)
}

console.log(`%c await roll(amount)`, `color: #39C5BB`)
console.log(`%c await getBalance(user)`, `color: #39C5BB`)

})
