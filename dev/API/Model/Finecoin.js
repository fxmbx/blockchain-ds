const mongoose = require('mongoose')

const FinecoinSchema = new mongoose.Schema({
    chain: [
        {
            index: {
                type: Number,
                unique: [true, 'Block index has to be unique']
            },
            timestamp: {
                type: Number
            },
            transactions: [
                {
                    transactionId: {
                        type: String,
                        unique: [true, 'transaction Id gats de unique']
                    },
                    amount: {
                        type: Number
                    },
                    sender: {
                        type: String,
                    },
                    recipient: {
                        type: String
                    }
                }
            ],
            nonce: {
                type: Number
            },
            hash: {
                type: String,
                unique: true
            },
            previousBlockHash: {
                type: String,
                unique: true
            }
        }
    ],
    name: String,
    currentNodeUrl: String,
    networkNodes: []


})

module.exports = mongoose.model('Finecoin', FinecoinSchema)

