const chainUtil = require('./../../helpers/chain-util');
const { MINING_REWARD } = require('./../../config/config');

class Transaction{
    constructor(){
        this.id     = chainUtil.id();
        this.input  = null;
        this.outputs = [];
    }

    update(senderWallet, recipient, amount){
        const senderOutput = this.outputs.find(output => senderWallet.publicKey === output.address);

        if(senderOutput.amount < amount){
            console.log(`Amout: ${amount} exceeds balance.`);
            return;
        }

        senderOutput.amount = senderOutput.amount - amount;
        this.outputs.push({amount,address : recipient});

        Transaction.signTransaction(this,senderWallet );
        return this;
    }

    static transactionWithOutputs(senderWallet, outputs){
        const transaction = new this();
        transaction.outputs.push(...outputs);
        Transaction.signTransaction(transaction, senderWallet);
        return transaction;
    }


    static newTransaction(senderWallet,recipient,amount){
      
        if(senderWallet.balance < amount){
            console.log(`Amount : ${amount} exceeds balance.`);
            return;
        }

       return Transaction.transactionWithOutputs(senderWallet,[
        {amount : senderWallet.balance - amount, address: senderWallet.publicKey},
        {amount, address : recipient}
    ])     
    }

    static rewardTransaction(minerWallet, blockchainWallet){
        return Transaction.transactionWithOutputs(blockchainWallet,[{
            amount : MINING_REWARD,
            address: minerWallet.publicKey
        }]);
    }


    static signTransaction(transaction, senderWallet){
        transaction.input = {
            timeStamp : Date.now(),
            amount    : senderWallet.balance,
            address   : senderWallet.publicKey,
            signature : senderWallet.sign(chainUtil.hash(transaction.outputs))
        }

    }

    static verifyTransaction(transaction){
        return chainUtil.verifySignature(
            transaction.input.address,
            transaction.input.signature,
            chainUtil.hash(transaction.outputs)
        );
    }
}

module.exports = Transaction;