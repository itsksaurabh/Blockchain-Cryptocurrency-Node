const chainUtil               = require('./../../helpers/chain-util');
const {DIFFICULTY,MINE_RATE}  = require('./../../config/config');

class Block {
constructor(timeStamp,lastHash,hash,data,nonce,difficulty){
    this.timeStamp  = timeStamp;
    this.lastHash   = lastHash;
    this.hash       = hash;
    this.data       = data;
    this.nonce      = nonce;
    this.difficulty = difficulty || DIFFICULTY;
}

toString(){
    return `Block -
    Timestamp  : ${this.timeStamp},
    Last Hash  : ${this.lastHash.substring(0,10)},
    Hash       : ${this.hash.substring(0,10)},
    Data       : ${this.data},
    nonce      : ${this.nonce},
    difficulty : ${this.difficulty}`;
}

//default genesis block
static genesis(){
    return new this('Genesis Time','----','k1S2-P1s2',[],0,DIFFICULTY);
}

static mineBlock(lastBlock,data){
    let hash,timeStamp;
    const lastHash  = lastBlock.hash;
    let {difficulty} = lastBlock;
    let nonce       = 0;

    do{
        timeStamp = Date.now();
        nonce++;
        difficulty = Block.adjustDifficulty(lastBlock,timeStamp)
        hash = Block.hash(timeStamp,lastHash,data,nonce,difficulty);
    }while(hash.substring(0,difficulty) !== '0'.repeat(difficulty));
    

    return new this(timeStamp,lastHash,hash,data,nonce,difficulty);
}

static hash(timeStamp,lastHash,data,nonce,difficulty){
    return chainUtil.hash(`${timeStamp}${lastHash}${data}${nonce}${difficulty}`).toString();
}

static blockHash(block){
    const {timeStamp, lastHash, data,nonce,difficulty} = block;
    return Block.hash(timeStamp,lastHash,data,nonce,difficulty);
}

static adjustDifficulty(lastBlock,currentTime){
    let {difficulty} = lastBlock;
    difficulty = lastBlock.timeStamp + MINE_RATE > currentTime ? difficulty + 1 : difficulty - 1;
    return difficulty;
}
}

module.exports = Block;