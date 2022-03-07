const express = require('express')
const { transaction, blockchain, mine, registerNode, registerNodesBulk, registerAndBroadcastNode, transactionBroadcast, receiveNewBlock } = require('../endpoints/blockchainEndpoints')
const router = express.Router()


router.route('/blockchain').get(blockchain)

router.route('/transaction').post(transaction)
router.route('/transaction/broadcast').post(transactionBroadcast)

router.route('/mine').get(mine)
router.route('/receive-new-block').post(receiveNewBlock)

router.route('/register-node').post(registerNode)
router.route('/register-and-broadcast-node').post(registerAndBroadcastNode)
router.route('/register-nodes-bulk').post(registerNodesBulk)


module.exports = router