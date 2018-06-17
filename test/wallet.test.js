const Wallet          = require('./../lib/wallet/wallet');
const TransactionPool = require('./../lib/wallet/transaction-pool');
const Blockchain      = require('./../lib/blockchain/blockchain');

const { INITIAL_BALANCE } = require('./../config/config');


 describe('Wallet',()=>{
     let tp,wallet,bc;

     beforeEach(()=>{
         wallet = new Wallet();
         tp     = new TransactionPool();
         bc     = new Blockchain();
     });

     describe('Creating a transaction',()=>{
        let transaction, sendAmount, recipient;

        beforeEach(()=>{
            sendAmount = 50;
            recipient  = 'r4nd0m-4ddr355'
            transaction = wallet.createTransaction(recipient,sendAmount,bc,tp);
        });

    describe('and creating the same transaction',()=>{
            beforeEach(()=>{
                wallet.createTransaction(recipient,sendAmount,bc,tp);
            });

            it('doubles the `sendAmount` subtracted from the wallet balance',()=>{
                expect(transaction.outputs.find(output => wallet.publicKey === output.address).amount)
                .toEqual(wallet.balance - sendAmount * 2 );
            });

            it('clones the `sendAmount` output for the recipient',()=>{
                expect(transaction.outputs.filter(output => recipient === output.address)
                .map(output => output.amount)).toEqual([sendAmount, sendAmount]);
            })
        });
     });

     describe('calculating a balance',()=>{
        let addBalance, repeatAdd, senderWallet;

        beforeEach(()=>{
            senderWallet = new Wallet();
            addBalance = 100;
            repeatAdd = 3;

            for(let i=0;i<repeatAdd;i++){
                senderWallet.createTransaction(wallet.publicKey,addBalance,bc,tp);
            }
            bc.addBlock(tp.transactions);
        });

        it('calculates the balance for blockchain transactions matching the recipient', ()=>{
            expect(wallet.calculateBalance(bc)).toEqual(INITIAL_BALANCE + (addBalance * repeatAdd));
        });

        it('calculates the balance for blockchain transactions matching the sender', ()=>{
            expect(senderWallet.calculateBalance(bc)).toEqual(INITIAL_BALANCE - (addBalance * repeatAdd));
        });

        describe('and recipient conducts a transaction', ()=>{
            let subtractBalance, recipientBalance;

            beforeEach(()=>{
                tp.clear();
                subtractBalance = 60;
                recipientBalance = wallet.calculateBalance(bc);
                wallet.createTransaction(senderWallet.publicKey,subtractBalance,bc,tp);
                bc.addBlock(tp.transactions);
            });

            describe('and the sender sends another transaction to the recipient', ()=>{
                beforeEach(()=>{
                    tp.clear();
                    senderWallet.createTransaction(wallet.publicKey,addBalance,bc,tp);
                    bc.addBlock(tp.transactions);
                });

                it('calculates the recipient balance only using transactions since its most recent one',()=>{
                    expect(wallet.calculateBalance(bc)).toEqual(recipientBalance - subtractBalance + addBalance);
                });

            });
            
        });
     });
 });