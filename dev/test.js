const Blockchain = require('./blockchain.js')


const bitcoin = new Blockchain();

// bitcoin.createNewBlock(1234, 'iaujncinwoejm', 'hdbaiuwnsoias')

// bitcoin.createNewTransaction(100, 'FUNBIcoienwc', 'JINnewoncdw')

// bitcoin.createNewBlock(10, 'dwjknfueopnjc', 'ejncwieniwns')

// bitcoin.createNewTransaction(40, 'FUNBIcoienwc', 'JINnewoncdw')
// bitcoin.createNewTransaction(700, 'FUNBIcoienwc', 'JINnewoncdw')
// bitcoin.createNewTransaction(60, 'FUNBIcoienwc', 'JINnewoncdw')

// bitcoin.createNewBlock(111, 'ciwnicwncowc', 'sjdnskjnduiw')


const previousBlockHash = 'iueoiancinciow'
const currentBlockData = [
    {
        amount: 10,
        sender: 'Erica',
        recipient: 'funbi'
    },
    {
        amount: 5,
        sender: '1Erica',
        recipient: '1unbi'
    },
    {
        amount: 40,
        sender: 'Jon',
        recipient: 'unbi'
    },
    {
        amount: 60,
        sender: 'ica',
        recipient: 'nbi'
    },
]

const nonce = 21166

// console.log(bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce))
// console.log(bitcoin.proofOfWork(previousBlockHash, currentBlockData))
const bc1 =

    [
        {
            index: 1,
            timestamp: 1647070902134,
            transactions: [],
            nonce: 100,
            hash: "0",
            previousBlockHash: "0"
        },
        {
            index: 2,
            timestamp: 1647070946457,
            transactions: [],
            nonce: 16441,
            hash: "00009b2ef664890dbcd795344f8145bac1710db47cea457183f41c9ca24c3285",
            previousBlockHash: "0"
        },
        {
            index: 3,
            timestamp: 1647071061644,
            transactions: [
                {
                    transactionId: "a854085df9db44999a87b6183c0cbeee",
                    amount: 12.5,
                    sender: "00",
                    recipient: "044a222f858f44129eb7461aeb88a367"
                },
                {
                    transactionId: "071d08ce71cb4bb18c82c3860c0cbade",
                    amount: 40,
                    sender: "funbisendingtoisrael",
                    recipient: "israelreceivingfromfunbi"
                },
                {
                    transactionId: "642ebc3c19a64329833fdf4498bbc609",
                    amount: 10,
                    sender: "funbisendingtoisrael",
                    recipient: "israelreceivingfromfunbi"
                }
            ],
            nonce: 76548,
            hash: "0000fb18935c1f63cf1ecc29bdeb83d4eba07b3c1847a0eb6e595ba3ee674adb",
            previousBlockHash: "00009b2ef664890dbcd795344f8145bac1710db47cea457183f41c9ca24c3285"
        },
        {
            index: 4,
            timestamp: 1647071197172,
            transactions: [
                {
                    transactionId: "a9b2e183ccae4612be3ea826bc851f75",
                    amount: 12.5,
                    sender: "00",
                    recipient: "044a222f858f44129eb7461aeb88a367"
                },
                {
                    transactionId: "8c039b4b98fd42da9080360f81713da9",
                    amount: 100,
                    sender: "funbisendingtoisrael",
                    recipient: "israelreceivingfromfunbi"
                },
                {
                    transactionId: "dda9e9c069cb4716b79b9cda76f9d399",
                    amount: 70,
                    sender: "funbisendingtoisrael",
                    recipient: "israelreceivingfromfunbi"
                },
                {
                    transactionId: "d84db8efaf8c4f17aa97317122b9b57d",
                    amount: 49,
                    sender: "funbisendingtoisrael",
                    recipient: "israelreceivingfromfunbi"
                },
                {
                    transactionId: "511f92c3bddf4faf82be5a2f44b08030",
                    amount: 9,
                    sender: "funbisendingtoisrael",
                    recipient: "israelreceivingfromfunbi"
                }
            ],
            nonce: 113397,
            hash: "0000fece3af16f09f9570f946e8f304050b13881b4a53bc6bdade3091a8df32e",
            previousBlockHash: "0000fb18935c1f63cf1ecc29bdeb83d4eba07b3c1847a0eb6e595ba3ee674adb"
        },
        {
            index: 5,
            timestamp: 1647071200744,
            transactions: [
                {
                    transactionId: "8fdf566737e843efad248b93522da765",
                    amount: 12.5,
                    sender: "00",
                    recipient: "044a222f858f44129eb7461aeb88a367"
                }
            ],
            nonce: 25543,
            hash: "00005b9ae4aa2ffdfdccb96ac92b33aed9202bc7998d7218698fc80bea808f5d",
            previousBlockHash: "0000fece3af16f09f9570f946e8f304050b13881b4a53bc6bdade3091a8df32e"
        },
        {
            index: 6,
            timestamp: 1647071202868,
            transactions: [
                {
                    transactionId: "501bcbb6509e40198da6b86f08265032",
                    amount: 12.5,
                    sender: "00",
                    recipient: "044a222f858f44129eb7461aeb88a367"
                }
            ],
            nonce: 27822,
            hash: "00007ea62f15408a9eb28fae4615086876cab4c41423f7ec33a73611f717d7a0",
            previousBlockHash: "00005b9ae4aa2ffdfdccb96ac92b33aed9202bc7998d7218698fc80bea808f5d"

        },

    ]


// console.log(bitcoin)
console.log("Valid blockchian: 🤭", bitcoin.isChainValid(bc1))