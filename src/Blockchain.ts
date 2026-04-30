import { hash, hashValidado } from './helpers'

export interface Bloco {
  header: {
    hashBloco: string
    nonce: number
  }
  payload: {
    sequencia: number
    timesatamp: number
    dados: any
    hashAnterior: string
  }
}

export class Blockchain {
  #chain: Bloco[] = []
  private prefixoPow = '0'

  constructor(private difficulty: number = 5) {
    this.#chain.push(this.criarBlocoGenesis())
  }

  private criarBlocoGenesis(): Bloco {
    const payload: Bloco['payload'] = {
      sequencia: 0,
      timesatamp: Date.now(),
      dados: 'Bloco inicial',
      hashAnterior: ' '
    }

    return {
      header: {
        nonce: 0,
        hashBloco: hash(JSON.stringify(payload))
      },
      payload
    }
  }

  get chain(): Bloco[] {
    return this.#chain
  }

  private get ultimoBloco(): Bloco {
    return this.#chain[this.#chain.length - 1] as Bloco
  }

  private hashUltimoBloco(): string {
    return this.ultimoBloco.header.hashBloco
  }

  criarBloco(dados: any): Bloco['payload'] {
    const novoBloco: Bloco['payload'] = {
      sequencia: this.ultimoBloco.payload.sequencia + 1,
      timesatamp: Date.now(),
      dados,
      hashAnterior: this.hashUltimoBloco()
    }

    console.log(`Bloco #${novoBloco.sequencia} criado: ${JSON.stringify(novoBloco)}`)

    return novoBloco
  }

  minerarBloco(bloco: Bloco['payload']): Bloco {
    let nonce = 0
    const inicio = Date.now()

    while (true) {
      const hashBloco = hash(JSON.stringify(bloco))
      const hashPow = hash(hashBloco + nonce)

      if (hashValidado({ hash: hashPow, difficulty: this.difficulty, prefixo: this.prefixoPow })) {
        const final = Date.now()
        const hashReduzido = hashBloco.slice(0, 12)
        const tempoMineracao = (final - inicio) / 1000

        console.log(`Bloco #${bloco.sequencia} minerado em ${tempoMineracao} segundos. Hash: ${hashReduzido} (${nonce} tentativas)`)

        return {
          payload: { ...bloco },
          header: {
            nonce,
            hashBloco
          }
        }
      }

      nonce++
    }
  }

  verificarBloco(bloco: Bloco): boolean {
    if (bloco.payload.hashAnterior !== this.hashUltimoBloco()) {
      console.error(`Bloco #${bloco.payload.sequencia} rejeitado: O hash anterior é ${this.hashUltimoBloco().slice(0, 12)} e não ${bloco.payload.hashAnterior.slice(0, 12)}`)
      return false
    }

    const hashTeste = hash(hash(JSON.stringify(bloco.payload)) + bloco.header.nonce)

    if (!hashValidado({ hash: hashTeste, difficulty: this.difficulty, prefixo: this.prefixoPow })) {
      console.error(`Bloco #${bloco.payload.sequencia} rejeitado: o nonce ${bloco.header.nonce} não valida o hash ${hashTeste.slice(0, 12)}`)
      return false
    }

    return true
  }

  enviarBloco(bloco: Bloco): Bloco[] {
    if (this.verificarBloco(bloco)) {
      this.#chain.push(bloco)
      console.log(`O Bloco #${bloco.payload.sequencia} foi adicionado à blockchain: ${JSON.stringify(bloco, null, 2)}`)
    }

    return this.#chain
  }
}
