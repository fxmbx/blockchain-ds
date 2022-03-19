const { v4: uuid } = require('uuid')
const asyncHandler = require('../Middleware/async')
const ErrorResponse = require('../helpers/errorResponse')
const Blockchain = require('../../blockchain')

// const Finecoin = require('../dev/API/Model/Finecoin')
// const PendingTransactions = require('../dev/API/Model/PendingTransactions')

const rp = require('request-promise')
const Finecoin = require('../Model/Finecoin')
const PendingTransactions = require('../Model/PendingTransactions')
// const  = require('../dev/API/Model/PendingTransactions')

const finecoin = new Blockchain();
const nodeAddress = uuid().split('-').join('')
// ////console.log(nodeAddress)

exports.transaction = asyncHandler(async (req, res, next) => {

    // const { amount, sender, recipient } = req.body
    // const blockIndex = finecoin.createNewTransaction(amount, sender, recipient)
    const { newTransaction } = req.body
    ////console.log(newTransaction)
    const blockIndex = finecoin.addTransactionToPendingTransactions(newTransaction)
    res.json(
        {
            data: newTransaction,
            message: `Transaction will be added on block ${blockIndex} on the chain`,
            success: true
        })

})

exports.transactionBroadcast = asyncHandler(async (req, res, next) => {
    const { amount, sender, recipient } = req.body
    // const sender = req.user._id
    const newTransaction = finecoin.createNewTransaction(amount, sender, recipient)

    finecoin.addTransactionToPendingTransactions(newTransaction)
    // //console.log('neext block index 😀', f)

    const requestPromises = []
    finecoin.networkNodes.forEach(networkNodeUrl => {
        const reqOptions = {
            uri: networkNodeUrl + '/api/v1/transaction',
            method: 'POST',
            body: { newTransaction: newTransaction },
            json: true
        }

        requestPromises.push(rp(reqOptions))
    })

    Promise.all(requestPromises).then(data => {
        ////console.log(data)
        res.json({
            data: newTransaction,
            message: 'Transaction created and broadcasted succesfully',
            success: true
        })
    })
})

exports.blockchain = asyncHandler(async function (req, res, next) {
    const data = await finecoin.getBlockChain()
    res.json({
        data
    })
})


exports.mine = asyncHandler(async (req, res, next) => {

    const getPendingT = await PendingTransactions.find()
    const getBlockchain = await Finecoin.find();

    const lastBlock = await finecoin.getLastBlock()
    //console.log('last block is ', lastBlock)
    const previousBlockHash = lastBlock.hash
    const currentBlockData = {
        transactions: getPendingT[0],
        index: lastBlock.index + 1
    }
    // const currentBlockData = {
    //     transactions: finecoin.pendingTransactions,
    //     index: lastBlock.index + 1
    // }
    const nonce = finecoin.proofOfWork(previousBlockHash, currentBlockData)
    const blockHash = finecoin.hashBlock(previousBlockHash, currentBlockData, nonce)

    //reward for mining
    // finecoin.createNewTransaction(12.5, "00", nodeAddress)
    console.log(getBlockchain[0].networkNodes)

    const newBlock = await finecoin.createNewBlock(nonce, previousBlockHash, blockHash)

    const requestPromises = []

    // getBlockchain[0].networkNodes.forEach(networkNodeUrl => {
    //     const requestOptions = {
    //         uri: networkNodeUrl + '/api/v1/receive-new-block',
    //         method: 'POST',
    //         body: { newBlock: newBlock },
    //         json: true
    //     }
    //     requestPromises.push(rp(requestOptions))
    // })

    Promise.all(requestPromises).then(data => {
        const requestOptions = {
            uri: getBlockchain[0].currentNodeUrl + '/api/v1/transaction/broadcast',
            method: 'POST',
            body: {
                amount: 12.5,
                sender: "00",
                recipient: nodeAddress
            },
            json: true
        }
        return rp(requestOptions)
    }).then(data => {
        res.json({
            data: "New block mined and broadcasted successfully",
            block: newBlock
        })
    })
})

exports.receiveNewBlock = asyncHandler(async (req, res, next) => {
    const { newBlock } = req.body
    //verify block, if the previous block hash is equqll to the hash of the previous hash and the index is correct

    const lastBlock = await finecoin.getLastBlock()
    const validHash = lastBlock.hash === newBlock.previousBlockHash;
    const validIndex = lastBlock.index + 1 === newBlock.index

    if (validHash && validIndex) {
        finecoin.chain.push(newBlock);
        finecoin.pendingTransactions = []

        res.json({
            data: newBlock,
            message: 'New Block Received and accepted',

        })
    } else {
        res.json({
            data: newBlock,
            message: 'New Block Rejected',

        })

    }
})

exports.registerAndBroadcastNode = async (req, res, next) => {
    const { newNodeUrl } = req.body

    if (finecoin.networkNodes.indexOf(newNodeUrl) == -1)
        finecoin.networkNodes.push(newNodeUrl)

    const regNodePromises = [];
    finecoin.networkNodes.forEach(networkNodesUrl => {
        const requestOptions = {
            uri: networkNodesUrl + '/api/v1/register-node',
            method: 'POST',
            body: { newNodeUrl: newNodeUrl },
            json: true
        }
        regNodePromises.push(rp(requestOptions))
    })

    Promise.all(regNodePromises).then(data => {
        const bulkRegisterOptions = {
            uri: newNodeUrl + '/api/v1/register-nodes-bulk',
            method: 'POST',
            body: { allNetworkNodes: [...finecoin.networkNodes, finecoin.currentNodeUrl] },
            json: true
        }
        return rp(bulkRegisterOptions)
    })
        .then(data => {
            res.json({
                // data,
                data: 'New Node Registered with network succesfully',
                success: true

            })
        })
    // const consensusNodePromise = [];
    // const reqOpts = {
    //     uri: newNodeUrl + 'api/v1/consensus',
    //     methog: 'GET',
    //     json: true
    // }
    // consensusNodePromise.push(rp(reqOpts))
    // Promise.all(consensusNodePromise).then(data => {
    //     res.json({
    //         // data,
    //         data: 'New Node Registered with network succesfully',
    //         success: true

    //     })
    // })
}

exports.registerNode = async (req, res, next) => {
    const { newNodeUrl } = req.body

    const nodeNotPresent = finecoin.networkNodes.indexOf(newNodeUrl) == -1
    const notCurrentNode = finecoin.currentNodeUrl !== newNodeUrl
    ////console.log(`Node not present: ${nodeNotPresent}\nNot Current Node: ${notCurrentNode}`)
    if (nodeNotPresent && notCurrentNode)
        finecoin.networkNodes.push(newNodeUrl)

    res.json({
        data: 'New Node registered succesfully',
        success: true
    })


}

exports.registerNodesBulk = async (req, res, next) => {
    const { allNetworkNodes } = req.body

    allNetworkNodes.forEach(networkNodeUrl => {
        const nodeNotPresent = finecoin.networkNodes.indexOf(networkNodeUrl) == -1
        const notCurrentNode = finecoin.currentNodeUrl !== networkNodeUrl
        // if (!notCurrentNode || !nodeNotPresent) {
        //     return next(new ErrorResponse(`Node Exist`, 403))

        // }
        if (nodeNotPresent && notCurrentNode)
            finecoin.networkNodes.push(networkNodeUrl)
    })

    res.json({
        data: allNetworkNodes,
        message: 'Registration succesfull',
        success: true
    })
}

exports.consensus = asyncHandler(async (req, res, next) => {
    const requestPromises = []
    finecoin.networkNodes.forEach(newtworkUrl => {
        const requestOptions = {
            uri: newtworkUrl + '/api/v1/blockchain',
            method: 'GET',
            json: true
        }
        requestPromises.push(rp(requestOptions))
    })

    Promise.all(requestPromises).then(blockchains => {
        const currentChainLength = finecoin['chain'].length
        // //console.log('currentchainlength', currentChainLength)
        let maxChainLength = currentChainLength
        // //console.log('machgthainlength', maxChainLength)
        let newLongestChain = null
        let newPendingTransactions = null
        // //console.log(blockchains.length)
        blockchains.forEach(blockchain => {
            // //console.log('block chain length', blockchain.data.chain.length)
            // //console.log('block chain data', blockchain)
            if (blockchain.data.chain.length > maxChainLength) {
                maxChainLength = blockchain.data.chain.length
                newLongestChain = blockchain.data.chain
                newPendingTransactions = blockchain.data.pendingTransactions
            }
        })
        // //console.log('longestchain', newLongestChain)
        if (!newLongestChain || (newLongestChain && !finecoin.isChainValid(newLongestChain))) {
            res.json({
                status: false,
                message: 'Current chain not replaced',
                data: finecoin.chain
            })
        }
        else {
            finecoin.chain = newLongestChain
            finecoin.pendingTransactions = newPendingTransactions
            res.json({
                message: 'This chain has been replaced. New chain in data',
                data: finecoin.chain
            })
        }
        // //console.log('valid chain', finecoin.isChainValid(newLongestChain))
    })
})

exports.getBlockByHash = asyncHandler(async (req, res, next) => {
    const { blockHash } = req.params
    const correctBlock = finecoin.getBlock(blockHash)
    if (!correctBlock)
        res.json({
            data: correctBlock,
            message: 'Block not found 😄'
        })
    else
        res.json({
            data: correctBlock,
            message: "Block Found 😞"
        })

})

exports.getTransactionById = asyncHandler(async (req, res, next) => {
    const { transactionId } = req.params
    const transactionData = await finecoin.getTransaction(transactionId)
    if (transactionData.transaction != null && transactionData.block !== null) {
        res.json({
            data: {
                transaction: transactionData.transaction,
                block: transactionData.block
            },
            message: "Transaction found 😀"
        })
    }
    else if (transactionData.transaction != null && transactionData.block === null) {
        res.json({
            data: {
                transaction: transactionData.transaction,
                block: transactionData.block
            },
            message: "Transaction found but still pending🤓"
        })
    }
    else {
        res.json({
            data: {
                transaction: transactionData.transaction,
                block: transactionData.block
            },
            message: "Transaction Not found 😞"
        })
    }
})

exports.getTransactionByAddressId = asyncHandler(async (req, res, next) => {

    const { address } = req.params
    // if (address == null)
    //     address = req.user._id
    const addressData = await finecoin.getAddressData(address)
    res.json({
        data: addressData,
        message: "Address found, hope say you no too broke sha 😉"
    })
})

exports.blockExplorer = function (req, res) {
    res.sendFile('../FE/index.html', { root: __dirname })
}