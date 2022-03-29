const express = require('express')
const { transaction, blockchain, mine, registerNode, getLatestTransactions, registerNodesBulk, registerAndBroadcastNode, transactionBroadcast, receiveNewBlock, consensus, getBlockByHash, getTransactionById, getTransactionByAddressId } = require('../endpoints/blockchainEndpoints')
const router = express.Router()

const { authorize } = require('../Middleware/auth')
// router.use(protect)
router.route('/blockchain').get(blockchain)

router.route('/transaction').post(transaction)
router.route('/transaction/broadcast').post(transactionBroadcast)

router.route('/mine').get(authorize('admin'), mine)
router.route('/receive-new-block').post(receiveNewBlock)

router.route('/register-node').post(registerNode)
router.route('/register-and-broadcast-node').post(registerAndBroadcastNode)
router.route('/register-nodes-bulk').post(registerNodesBulk)

router.route('/consensus').get(consensus)
router.route('/latesttransaction').get(getLatestTransactions)

router.route('/block/:blockHash').get(getBlockByHash)
router.route('/transaction/:transactionId').get(getTransactionById)
router.route('/address/:address').get(getTransactionByAddressId)


// router.route('/block-explorer').get(blockExplorer)


module.exports = router