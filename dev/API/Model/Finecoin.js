const mongoose = require('mongoose')

const FinecoinSchema = new mongoose.Schema({
    chain: [
        {
            index: {
                type: Number,
                unique: [true, 'Block index has to be unique']
            },
            timestamp: {
                type: Date,
                default: Date.now
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
                    },
                    confirmed: {
                        type: Boolean,
                        default: true
                    },
                    timestamp: {
                        type: Date,
                        default: Date.now
                    },
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

FinecoinSchema.pre('save', async function (next) {
    this.chain[0].transactions.forEach(trans => {
        trans.confirmed = true

    });
})
module.exports = mongoose.model('Finecoin', FinecoinSchema)



