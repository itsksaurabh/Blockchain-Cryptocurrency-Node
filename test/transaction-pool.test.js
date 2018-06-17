const TransactionPool = require('./../lib/wallet/transaction-pool');
const Transaction     = require('./../lib/wallet/transaction');
const Wallet          = require('./../lib/wallet/wallet');
const Blockchain      = require('./../lib/blockchain/blockchain');

describe('Transaction Pool',()=>{
    let tp,wallet,transaction,bc;

    beforeEach(()=>{
        tp          = new TransactionPool();
        wallet      = new Wallet();
        bc          = new Blockchain();
        transaction = wallet.createTransaction('r4nd-4ddr355',30,bc,tp);

    });

    it('adds the transaction to the pool',()=>{
        expect(tp.transactions.find(t => t.id === transaction.id)).toEqual(transaction);
    });

    it('updates a transaction in the pool',()=>{
        const oldTransaction = JSON.stringify(transaction);
        const newTransaction = transaction.update(wallet, 'n3w-4ddr355', 30);
        tp.updateOrAddTransaction(newTransaction);

        expect(JSON.stringify(tp.transactions.find(t => t.id === newTransaction.id)))
        .not.toEqual(oldTransaction);
    });

    it('clears transactions', ()=>{
        tp.clear();
        expect(tp.transactions).toEqual([]);
    });

    describe('mixing valid and corrupt transactions', ()=>{

        let validTransactions;

        beforeEach(()=>{
            validTransactions = [...tp.transactions];

            for(let i=0;i<6;i++){
                wallet = new Wallet();
                transaction = wallet.createTransaction('r4nd-4ddr355',30,bc,tp);
    
                if(i%2 === 0){
                    transaction.input.amount = 999999;
                }else{
                    validTransactions.push(transaction);
                }
            }
        });

       it('shows the difference valid and corrupt transactions', ()=>{
           expect(JSON.stringify(tp.transactions)).not.toEqual(JSON.stringify(validTransactions));
       });

       it('grabs valid transactions', ()=>{
           expect(tp.validTransaction()).toEqual(validTransactions);
       })
    })
})