const mongoose = require('mongoose')


const PendingTransactionSchema = new mongoose.Schema({
    pendingTransactions: [
        {
            transactionId: {
                type: String,
                unique: [true, 'Transaction Id gats de unique']
            },
            amount: {
                type: Number
            },
            sender: {
                type: String
            },
            recipient: {
                type: String
            },
            confirmed: {
                type: Boolean,
                default: false
            },
            timestamp: {
                type: Date,
                default: Date.now
            },
        }
    ]
})


module.exports = mongoose.model('PendingTransactions', PendingTransactionSchema)