import { BinaryLike, createHash } from 'crypto'

export function hash(dado: BinaryLike): string {
  return createHash('sha256').update(dado).digest('hex')
}

export function hashValidado({
  hash,
  difficulty = 5,
  prefixo = '0'
}: {
  hash: string
  difficulty?: number
  prefixo?: string
}): boolean {
  const check = prefixo.repeat(difficulty)
  return hash.startsWith(check)
}
