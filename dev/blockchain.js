const sha256 = require('sha256')
const { v4: uuid } = require('uuid')


const currentNodeUrl = 'http://localhost:' + process.argv[2]
console.log(currentNodeUrl.yellow)
//creating blockchaing constructor function
function Blockchain() {
    this.chain = [] //all blocks created and mined will be stored here 
    this.pendingTransactions = [] //holds new transaction  

    this.currentNodeUrl = currentNodeUrl
    this.networkNodes = [];
    this.createNewBlock(100, '0', '0')
}

Blockchain.prototype.createNewBlock = function (nonce, previousBlockHash, hash) {
    const newBlock = {
        index: this.chain.length + 1,
        timestamp: Date.now(),
        transactions: this.pendingTransactions, //all the transactions in this block should be the transactions waitng to be placed in the block
        nonce: nonce, //a nonce comes from proof of work ... it can be any number
        hash: hash,
        previousBlockHash: previousBlockHash
    };


    this.pendingTransactions = []; //clear new transactions 
    this.chain.push(newBlock) //add new block to chain

    return newBlock
}

Blockchain.prototype.getLastBlock = function () {
    return this.chain[this.chain.length - 1]
}


//newTransaction are pending till a new block is created
Blockchain.prototype.createNewTransaction = function (amount, sender, recipient) {
    const newTransaction = {
        transactionId: uuid().split('-').join(''),
        amount: amount,
        sender: sender,
        recipient: recipient
    }

    return newTransaction
    // this.pendingTransactions.push(newTransaction)

    // return this.getLastBlock()['index'] + 1 //return the number of the ock where the new transaction wil be one 
}


Blockchain.prototype.addTransactionToPendingTransactions = function (transactionObj) {
    this.pendingTransactions.push(transactionObj)
    return this.getLastBlock()['index'] + 1
}

Blockchain.prototype.hashBlock = function (previousBlockHash, currentBlockData, nonce) {
    const dataAsString = previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData)
    const hash = sha256(dataAsString)
    // console.log(hash)
    return hash;

}

//responsible for securing chain , making it diffcult to remine an existing node
//continupusly change nonce untill it finds correct hash
//returns the nonce values that creates correct hash
Blockchain.prototype.proofOfWork = function (previousBlockHash, currentBlockData) {
    let nonce = 0
    let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce)
    while (hash.substring(0, 4) !== '0000') {
        nonce++
        hash = this.hashBlock(previousBlockHash, currentBlockData, nonce)
        // console.log(hash)
    }

    return nonce
}

module.exports = Blockchain