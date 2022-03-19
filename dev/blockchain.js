const sha256 = require('sha256')
const { v4: uuid } = require('uuid')
const Finecoin = require('../dev/API/Model/Finecoin')
const PendingTransactions = require('../dev/API/Model/PendingTransactions')
const { get } = require('./API/routes/blockchainroutes')


const currentNodeUrl = process.argv[3] || 'http://localhost:' + process.argv[2]
// console.log(currentNodeUrl)
//creating blockchaing constructor   function
function Blockchain() {
    this.chain = [] //all blocks created and mined will be stored here 
    this.pendingTransactions = [] //holds new transaction  

    this.currentNodeUrl = currentNodeUrl
    this.networkNodes = [];
    // this.createNewBlock(100, '0', '0')
}

Blockchain.prototype.getBlockChain = async function () {

    const blockChain = await Finecoin.find()

    // const inst = JSON.stringify(blockChain) 
    // console.log(blockChain[0].id)
    // console.log(blockChain[0].chain.length)
    return blockChain
}
Blockchain.prototype.createNewBlock = async function (nonce, previousBlockHash, hash) {
    const pendingT = await PendingTransactions.find();
    console.log(pendingT[0].pendingTransactions[0])

    // console.log('penddddd', pendingT[0].pendingTransactions)
    const nextIndex = await this.getLastBlock()
    // console.log("nnnn", nextIndex)
    const newBlock = {
        index: nextIndex.index + 1,
        timestamp: Date.now(),
        transactions: pendingT[0].pendingTransactions, //all the transactions in this block should be the transactions waitng to be placed in the block
        nonce: nonce, //a nonce comes from proof of work ... it can be any number
        hash: hash,
        previousBlockHash: previousBlockHash
    };

    // PendingTransactions.create()
    await pendingT[0].remove()
    // this.pendingTransactions = []; //clear new transactions 

    await Finecoin.updateOne({ id: "622dfc5b2fcd5b6b87ae0d16" },
        { $push: { chain: newBlock } })
    // this.chain.push(newBlock) //add new block to chain

    return newBlock
}

Blockchain.prototype.getLastBlock = async function () {
    const blockChain = await Finecoin.find()
    const blockIndex = blockChain[0].chain.length
    var lastblock;
    // console.log('block chain index', blockIndex)
    // const getChain = Finecoin.find()
    // console.log('get chain', blockChain[0].chain)
    blockChain[0].chain.forEach(block => {
        block.index === blockIndex
        lastblock = block;
        // break
        // return block
    })
    return lastblock;
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


Blockchain.prototype.addTransactionToPendingTransactions = async function (transactionObj) {

    const getPendingT = await PendingTransactions.find()
    console.log(getPendingT[0])
    if (getPendingT.length === 0) {
        await PendingTransactions.create({ pendingTransactions: transactionObj })
    }
    else {
        const transId = getPendingT[0].id
        await PendingTransactions.updateMany({ id: transId },
            { $push: { pendingTransactions: transactionObj } })
    }
    return this.getLastBlock().index + 1
}

Blockchain.prototype.hashBlock = function (previousBlockHash, currentBlockData, nonce) {
    const dataAsString = previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData)
    const hash = sha256(dataAsString)
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
Blockchain.prototype.isChainValid = async function (blockchain) {
    var validChain = true;

    const genesisBlock = await Finecoin.find().blockchain[0];
    // console.log('gen finecoin block', genesisBlock)
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


Blockchain.prototype.getBlock = async function (blockHash) {
    let correctBlock = null

    const blockChain = await Finecoin.find()

    blockChain[0].forEach(block => {
        if (block.hash === blockHash)
            correctBlock = block
        return correctBlock
    })
    return correctBlock


    // this.chain.forEach(block => {
    //     if (block.hash === blockHash)
    //         correctBlock = block
    //     return correctBlock
    // })
    // return correctBlock
}

Blockchain.prototype.getTransaction = async function (transactionId) {
    let correctTransaction = null
    let correctBlock = null
    // let correctPendingTranasaction = null
    const blockChain = await Finecoin.find()
    const pendingT = await PendingTransactions.find()
    blockChain[0].chain.forEach(block => {
        block.transactions.forEach(transaction => {
            if (transaction.transactionId === transactionId) {
                correctTransaction = transaction
                correctBlock = block

            }
        })
    });
    if (correctTransaction === null) {
        pendingT[0].pendingTransactions.forEach(pendingTransaction => {
            if (pendingTransaction.transactionId === transactionId) {
                correctTransaction = pendingTransaction
                return { transaction: correctTransaction, block: correctBlock }

            }

        })
    }
    return { transaction: correctTransaction, block: correctBlock }
    // this.chain.forEach(block => {
    //     block.transactions.forEach(transaction => {
    //         if (transaction.transactionId === transactionId) {
    //             correctTransaction = transaction
    //             correctBlock = block


    //         }
    //     })
    // });
    // if (correctTransaction === null) {
    //     this.pendingTransactions.forEach(pendingTransaction => {
    //         if (pendingTransaction.transactionId === transactionId) {
    //             correctTransaction = pendingTransaction
    //             return { transaction: correctTransaction, block: correctBlock }

    //         }

    //     })
    // }
    // return { transaction: correctTransaction, block: correctBlock }

}


Blockchain.prototype.getAddressData = async function (address) {
    const blockChain = await Finecoin.find()

    const addressTransactions = [];
    blockChain[0].chain.forEach(block => {
        block.transactions.forEach(transaction => {
            if (transaction.sender === address || transaction.recipient === address) {
                addressTransactions.push(transaction)
            }
        })
    })
    let balance = 0;
    addressTransactions.forEach(transaction => {
        if (transaction.recipient === address)
            balance += transaction.amount
        else if (transaction.sender === address)
            balance -= transaction.amount
    })

    return {
        addTransactions: addressTransactions,
        addressBalance: balance
    }
}
module.exports = Blockchain