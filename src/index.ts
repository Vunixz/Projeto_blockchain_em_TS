import { Blockchain } from './Blockchain'
const dificulty = Number(process.argv[2]) || 5
const blockchain = new Blockchain(dificulty)

const numBlocos = Number(process.argv[3]) || 10
let chain = blockchain.chain

for (let i = 1; i <= numBlocos; i++) {
  const bloco = blockchain.criarBloco(`Bloco ${i}`)
  const mineInfo = blockchain.minerarBloco(bloco)
  chain = blockchain.enviarBloco(mineInfo)
}

console.log('----Blockchain----')
console.log(chain)
