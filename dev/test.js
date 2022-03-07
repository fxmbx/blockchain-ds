const Blockchain = require('./blockchain.js')


const bitcoin = new Blockchain();

// bitcoin.createNewBlock(1234, 'iaujncinwoejm', 'hdbaiuwnsoias')

// bitcoin.createNewTransaction(100, 'FUNBIcoienwc', 'JINnewoncdw')

// bitcoin.createNewBlock(10, 'dwjknfueopnjc', 'ejncwieniwns')

// bitcoin.createNewTransaction(40, 'FUNBIcoienwc', 'JINnewoncdw')
// bitcoin.createNewTransaction(700, 'FUNBIcoienwc', 'JINnewoncdw')
// bitcoin.createNewTransaction(60, 'FUNBIcoienwc', 'JINnewoncdw')

// bitcoin.createNewBlock(111, 'ciwnicwncowc', 'sjdnskjnduiw')


const previousBlockHash = 'iueoiancinciow'
const currentBlockData = [
    {
        amount: 10,
        sender: 'Erica',
        recipient: 'funbi'
    },
    {
        amount: 5,
        sender: '1Erica',
        recipient: '1unbi'
    },
    {
        amount: 40,
        sender: 'Jon',
        recipient: 'unbi'
    },
    {
        amount: 60,
        sender: 'ica',
        recipient: 'nbi'
    },
]

const nonce = 21166

// console.log(bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce))
// console.log(bitcoin.proofOfWork(previousBlockHash, currentBlockData))

console.log(bitcoin)