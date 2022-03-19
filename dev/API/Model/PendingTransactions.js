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
            }
        }
    ]
})

module.exports = mongoose.model('PendingTransactions', PendingTransactionSchema)