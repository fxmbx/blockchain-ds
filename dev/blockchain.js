const sha256 = require('sha256')
const { v4: uuid } = require('uuid')


const currentNodeUrl = process.argv[3] || 'http://localhost:' + process.argv[2]
// console.log(currentNodeUrl)
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

    // return this.getLastBlock().index + 1 //return the number of the ock where the new transaction wil be one 
}


Blockchain.prototype.addTransactionToPendingTransactions = function (transactionObj) {
    this.pendingTransactions.push(transactionObj)
    return this.getLastBlock().index + 1
}

Blockchain.prototype.hashBlock = function (previousBlockHash, currentBlockData, nonce) {
    const dataAsString = previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData)
    const hash = sha256(dataAsString)
    // //console.log(hash)
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
        // //console.log(hash)
    }

    return nonce
}


//longest chain consensus algorithm 
Blockchain.prototype.isChainValid = function (blockchain) {
    var validChain = true;

    const genesisBlock = blockchain[0];
    // console.log('gen funcoin block', genesisBlock)
    const correctNone = genesisBlock.nonce === 100
    const correctPrevBlockHash = genesisBlock.previousBlockHash === '0'
    // console.log(genesisBlock.transactions.length)
    const correctHash = genesisBlock.hash === '0'
    const correctTransactions = genesisBlock.transactions.length === 0
    if (!correctNone || !correctPrevBlockHash || !correctHash || !correctTransactions) { validChain = false }

    for (var i = 1; i < blockchain.length; i++) {
        const currentBlock = blockchain[i];
        const previousBlock = blockchain[i - 1];
        // console.log(currentBlock.index)
        const currentBlockData = {
            transactions: currentBlock.transactions,
            index: currentBlock.index
        }
        // console.log('first :', currentBlock.previousBlockHash)
        // console.log('second :', previousBlock.hash)
        // console.log('nonce :', currentBlock.nonce)
        if (currentBlock.previousBlockHash !== previousBlock.hash) { validChain = false }
        const blockHash = this.hashBlock(previousBlock.hash, currentBlockData, currentBlock.nonce)
        console.log('third', blockHash)
        if (blockHash.substring(0, 4) !== '0000') { validChain = false }
    }

    return validChain;
}
module.exports = Blockchain