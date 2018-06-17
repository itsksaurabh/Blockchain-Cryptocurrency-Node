const Blockchain = require('./../lib/blockchain/blockchain');
const Block      = require('./../lib/blockchain/block');

describe('Blockchain',()=>{
    let bc,bc2;
    beforeEach(()=>{
        bc = new Blockchain();
        bc2 = new Blockchain();
    })

    it('starts with geesis Block',()=>{
        expect(bc.chain[0]).toEqual(Block.genesis());
    });

    it('Adds new block to blockchain',()=>{
        const data = 'foo';
        bc.addBlock(data);

        expect(bc.chain[bc.chain.length-1].data).toEqual(data);
    });

    it('validates a valid chain',()=>{
        bc2.addBlock('foo');

        expect(bc.isValidChain(bc2.chain)).toBe(true);
    });

    it('invalidates a chain with corrupt genesis block',()=>{
        bc2.chain[0].data = 'Bad data';

        expect(bc.isValidChain(bc2.chain)).toBe(false);

    });

    it('invalidates corrupt chain',()=>{
        bc2.addBlock('foo');
        bc2.chain[1].data = 'Not Foo';

        expect(bc.isValidChain(bc2.chain)).toBe(false);

    });

    it('replaces the blockchain with new chain', ()=>{
        bc2.addBlock('bar');
        bc.replaceChain(bc2.chain);

        expect(bc.chain).toEqual(bc2.chain);
    });

    it('does not replace the blockchain with one having length less or equal to blockchain length',()=>{
        bc.addBlock('foo');
        bc.replaceChain(bc2.chain);

        expect(bc.chain).not.toEqual(bc2.chain);
    });

})