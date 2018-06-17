const express    = require('express');
const bodyParser = require('body-parser');

const Blockchain      = require('./lib/blockchain/blockchain');
const P2pServer       = require('./server/p2p-server');
const Wallet          = require('./lib/wallet/wallet');
const TransactionPool = require('./lib/wallet/transaction-pool');
const Miner           = require('./lib/miner/miner');  

const HTTP_PORT = process.env.HTTP_PORT || 3000;
const app = express();

const bc        = new Blockchain();
const tp        = new TransactionPool();
const wallet    = new Wallet();
const p2pServer = new P2pServer(bc, tp);
const miner     = new Miner(bc, tp, wallet, p2pServer);

app.use(bodyParser.json());

//get the whole blockchain
app.get('/blocks',(req,res)=>{
    res.json(bc.chain);
});

//add blocks to blockchain
app.post('/mine',(req,res)=>{

    console.log(req.body.data);
    const block = bc.addBlock(req.body.data);
    console.log(`New block added : ${block.toString()}`);

    p2pServer.syncChain();
    res.redirect('/blocks');

});

//get all transactions
app.get('/transactions',(req,res)=>{
    res.json(tp.transactions);
});

//perform transaction
app.post('/transact', (req, res)=>{
    const {recipient, amount}   = req.body;
    const transaction = wallet.createTransaction(recipient, amount, bc, tp);
    p2pServer.broadcastTransaction(transaction);
    res.redirect('/transactions');
});

//mine blockchain and clears old transaction pool then broadcast new chain
app.get('/mine-transactions', (req,res)=>{
    const block = miner.mine();
    console.log(`new Block added: ${block.toString()}`);
    res.redirect('/blocks');
})

//get own public key
app.get('/publicKey', (req, res)=>{
    res.json({"PublicKey" : wallet.publicKey});
});

app.listen(HTTP_PORT,()=>{
    console.log(`server started on port ${HTTP_PORT}`);
});

p2pServer.listen()