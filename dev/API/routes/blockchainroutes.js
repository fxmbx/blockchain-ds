const express = require('express')
const { transaction, blockchain, mine, registerNode, registerNodesBulk, registerAndBroadcastNode, transactionBroadcast, receiveNewBlock, consensus, getBlockByHash, getTransactionById, getTransactionByAddressId } = require('../endpoints/blockchainEndpoints')
const router = express.Router()

const { protect, authorize } = require('../Middleware/auth')
// router.use(protect)
router.route('/blockchain').get(protect, blockchain)

router.route('/transaction').post(protect, transaction)
router.route('/transaction/broadcast').post(protect, transactionBroadcast)

router.route('/mine').get(authorize('admin'), mine)
router.route('/receive-new-block').post(protect, receiveNewBlock)

router.route('/register-node').post(protect, registerNode)
router.route('/register-and-broadcast-node').post(protect, registerAndBroadcastNode)
router.route('/register-nodes-bulk').post(protect, registerNodesBulk)

router.route('/consensus').get(protect, consensus)

router.route('/block/:blockHash').get(protect, getBlockByHash)
router.route('/transaction/:transactionId').get(protect, getTransactionById)
router.route('/address/:address').get(protect, getTransactionByAddressId)


// router.route('/block-explorer').get(blockExplorer)


module.exports = router