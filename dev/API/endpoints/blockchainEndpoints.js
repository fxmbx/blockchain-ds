const { v4: uuid } = require('uuid')
const asyncHandler = require('../Middleware/async')
const ErrorResponse = require('../helpers/errorResponse')
const Blockchain = require('../../blockchain')

const rp = require('request-promise')

const funcoin = new Blockchain();
const nodeAddress = uuid().split('-').join('')
// console.log(nodeAddress)

exports.transaction = asyncHandler(async (req, res, next) => {

    // const { amount, sender, recipient } = req.body
    // const blockIndex = funcoin.createNewTransaction(amount, sender, recipient)
    const { newTransaction } = req.body
    console.log(newTransaction)
    const blockIndex = funcoin.addTransactionToPendingTransactions(newTransaction)
    res.json(
        {
            note: `Transaction will be added on block ${blockIndex} on the chain`,
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
        console.log(data)
        res.json({
            data: 'Transaction created and broadcasted succesfully',
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
    const previousBlockHash = lastBlock['hash']
    const currentBlockData = {
        transaction: funcoin.pendingTransactions,
        index: lastBlock['index'] + 1
    }
    const nonce = funcoin.proofOfWork(previousBlockHash, currentBlockData)
    const blockHash = funcoin.hashBlock(previousBlockHash, currentBlockData, nonce)

    //reward for mining
    funcoin.createNewTransaction(12.5, "00", nodeAddress)

    const newBlock = funcoin.createNewBlock(nonce, previousBlockHash, blockHash)


    res.json({
        data: "New block mined successfully",
        block: newBlock
    })
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
    }).then(data => {
        res.json({
            // data,
            data: 'New Node Registered with network succesfully',
            success: true
        })
    })
}

exports.registerNode = async (req, res, next) => {
    const { newNodeUrl } = req.body

    const nodeNotPresent = funcoin.networkNodes.indexOf(newNodeUrl) == -1
    const notCurrentNode = funcoin.currentNodeUrl !== newNodeUrl
    console.log(`Node not present: ${nodeNotPresent}\nNot Current Node: ${notCurrentNode}`)
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
        data: 'Registration succesfull',
        success: true
    })
}

