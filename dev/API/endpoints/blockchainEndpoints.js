const { v4: uuid } = require('uuid')
const asyncHandler = require('../Middleware/async')
const ErrorResponse = require('../helpers/errorResponse')
const Blockchain = require('../../blockchain')

const rp = require('request-promise')

const funcoin = new Blockchain();
const nodeAddress = uuid().split('-').join('')
// //console.log(nodeAddress)

exports.transaction = asyncHandler(async (req, res, next) => {

    // const { amount, sender, recipient } = req.body
    // const blockIndex = funcoin.createNewTransaction(amount, sender, recipient)
    const { newTransaction } = req.body
    //console.log(newTransaction)
    const blockIndex = funcoin.addTransactionToPendingTransactions(newTransaction)
    res.json(
        {
            data: newTransaction,
            message: `Transaction will be added on block ${blockIndex} on the chain`,
            success: true
        })

})

exports.transactionBroadcast = asyncHandler(async (req, res, next) => {
    const { amount, sender, recipient } = req.body
    const newTransaction = funcoin.createNewTransaction(amount, sender, recipient)

    funcoin.addTransactionToPendingTransactions(newTransaction)
    const requestPromises = []
    funcoin.networkNodes.forEach(networkNodeUrl => {
        const reqOptions = {
            uri: networkNodeUrl + '/api/v1/transaction',
            method: 'POST',
            body: { newTransaction: newTransaction },
            json: true
        }

        requestPromises.push(rp(reqOptions))
    })

    Promise.all(requestPromises).then(data => {
        //console.log(data)
        res.json({
            data: newTransaction,
            message: 'Transaction created and broadcasted succesfully',
            success: true
        })
    })
})

exports.blockchain = asyncHandler(async function (req, res, next) {
    res.json({
        data: funcoin
    })
})


exports.mine = asyncHandler(async (req, res, next) => {

    const lastBlock = funcoin.getLastBlock()
    const previousBlockHash = lastBlock.hash
    const currentBlockData = {
        transactions: funcoin.pendingTransactions,
        index: lastBlock.index + 1
    }
    const nonce = funcoin.proofOfWork(previousBlockHash, currentBlockData)
    const blockHash = funcoin.hashBlock(previousBlockHash, currentBlockData, nonce)

    //reward for mining
    // funcoin.createNewTransaction(12.5, "00", nodeAddress)

    const newBlock = funcoin.createNewBlock(nonce, previousBlockHash, blockHash)

    const requestPromises = []
    funcoin.networkNodes.forEach(networkNodeUrl => {
        const requestOptions = {
            uri: networkNodeUrl + '/api/v1/receive-new-block',
            method: 'POST',
            body: { newBlock: newBlock },
            json: true
        }
        requestPromises.push(rp(requestOptions))
    })

    Promise.all(requestPromises).then(data => {
        const requestOptions = {
            uri: funcoin.currentNodeUrl + '/api/v1/transaction/broadcast',
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

    const lastBlock = funcoin.getLastBlock()
    const validHash = lastBlock.hash === newBlock.previousBlockHash;
    const validIndex = lastBlock.index + 1 === newBlock.index

    if (validHash && validIndex) {
        funcoin.chain.push(newBlock);
        funcoin.pendingTransactions = []

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

    if (funcoin.networkNodes.indexOf(newNodeUrl) == -1)
        funcoin.networkNodes.push(newNodeUrl)

    const regNodePromises = [];
    funcoin.networkNodes.forEach(networkNodesUrl => {
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
            body: { allNetworkNodes: [...funcoin.networkNodes, funcoin.currentNodeUrl] },
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

    const nodeNotPresent = funcoin.networkNodes.indexOf(newNodeUrl) == -1
    const notCurrentNode = funcoin.currentNodeUrl !== newNodeUrl
    //console.log(`Node not present: ${nodeNotPresent}\nNot Current Node: ${notCurrentNode}`)
    if (nodeNotPresent && notCurrentNode)
        funcoin.networkNodes.push(newNodeUrl)

    res.json({
        data: 'New Node registered succesfully',
        success: true
    })


}

exports.registerNodesBulk = async (req, res, next) => {
    const { allNetworkNodes } = req.body

    allNetworkNodes.forEach(networkNodeUrl => {
        const nodeNotPresent = funcoin.networkNodes.indexOf(networkNodeUrl) == -1
        const notCurrentNode = funcoin.currentNodeUrl !== networkNodeUrl
        // if (!notCurrentNode || !nodeNotPresent) {
        //     return next(new ErrorResponse(`Node Exist`, 403))

        // }
        if (nodeNotPresent && notCurrentNode)
            funcoin.networkNodes.push(networkNodeUrl)
    })

    res.json({
        data: allNetworkNodes,
        message: 'Registration succesfull',
        success: true
    })
}

exports.consensus = asyncHandler(async (req, res, next) => {
    const requestPromises = []
    funcoin.networkNodes.forEach(newtworkUrl => {
        const requestOptions = {
            uri: newtworkUrl + '/api/v1/blockchain',
            method: 'GET',
            json: true
        }
        requestPromises.push(rp(requestOptions))
    })

    Promise.all(requestPromises).then(blockchains => {
        const currentChainLength = funcoin['chain'].length
        // console.log('currentchainlength', currentChainLength)
        let maxChainLength = currentChainLength
        // console.log('machgthainlength', maxChainLength)
        let newLongestChain = null
        let newPendingTransactions = null
        // console.log(blockchains.length)
        blockchains.forEach(blockchain => {
            // console.log('block chain length', blockchain.data.chain.length)
            // console.log('block chain data', blockchain)
            if (blockchain.data.chain.length > maxChainLength) {
                maxChainLength = blockchain.data.chain.length
                newLongestChain = blockchain.data.chain
                newPendingTransactions = blockchain.data.pendingTransactions
            }
        })
        // console.log('longestchain', newLongestChain)
        if (!newLongestChain || (newLongestChain && !funcoin.isChainValid(newLongestChain))) {
            res.json({
                status: false,
                message: 'Current chain not replaced',
                data: funcoin.chain
            })
        }
        else {
            funcoin.chain = newLongestChain
            funcoin.pendingTransactions = newPendingTransactions
            res.json({
                message: 'This chain has been replaced. New chain in data',
                data: funcoin.chain
            })
        }
        // console.log('valid chain', funcoin.isChainValid(newLongestChain))
    })
})

exports.getBlockByHash = asyncHandler(async (req, res, next) => {
    const { blockHash } = req.params
    const correctBlock = funcoin.getBlock(blockHash)
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
    const transactionData = funcoin.getTransaction(transactionId)
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
    const addressData = funcoin.getAddressData(address)
    res.json({
        data: addressData,
        message: "Address found, hope say you no too broke sha 😉"
    })
})