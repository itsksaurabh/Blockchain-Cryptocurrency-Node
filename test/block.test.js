const Block = require('./../lib/blockchain/block');

describe('Block',()=>{
    let data,lastBlock,block;

    beforeEach(()=>{
        lastBlock = Block.genesis();
        data      = 'foo';
        block     = Block.mineBlock(lastBlock,data);
    });

    it('Sets the `data` to match the input',()=>{
      expect(block.data).toEqual(data);  
    });

    it('Sets the `lastHash` to match the hash of last block',()=>{
        expect(block.lastHash).toEqual(lastBlock.hash);
    });

    it('generates the hash that matches the difficulty',()=>{
        expect(block.hash.substring(0,block.difficulty)).toEqual('0'.repeat(block.difficulty));
        console.log(block.toString());
    });

    it('lowers the difficulty for slowly mined blocks',()=>{
        expect(Block.adjustDifficulty(block,block.timeStamp+360000)).toEqual(block.difficulty -1);
    });

    it('raised the difficulty for quickly mined block',()=>{
        expect(Block.adjustDifficulty(block,block.timeStamp+1)).toEqual(block.difficulty+1);
    });
})