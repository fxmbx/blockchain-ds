const mongoose = require('mongoose')

const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}
const connectDb = async () => {
    //console.log("mongodb + srv://funbi:sladewilson101@funbiclust.9ogxi.mongodb.net/FinalProjectDb?retryWrites=true&w=majority")
    const con = await mongoose.connect("mongodb+srv://funbi:sladewilson101@funbiclust.9ogxi.mongodb.net/FinalProjectDb?retryWrites=true&w=majority", connectionParams)
    //console.log(`connected to db on ${con.connection.host}`.cyan.underline.bold)
}

module.exports = connectDb