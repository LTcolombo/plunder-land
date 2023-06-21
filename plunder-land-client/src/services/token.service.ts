import axios from 'axios'

const API_BASE: string = 'http://localhost:8001'

export class TokenService {
  static _inst: TokenService | undefined

  static get instance (): TokenService {
    if (TokenService._inst === undefined) { TokenService._inst = new TokenService() }
    return TokenService._inst
  }

  address: string | undefined

  async getLootBalance (): Promise<number> {
    if (this.address === undefined) throw new Error('no address set')
    const response = await axios.get(`${API_BASE}/loot/balance/${this.address}`)

    if (response.status !== 200) { throw new Error('failed to load FT') }
    return response.data.displayValue
  }

  async getGearImages (): Promise<string[]> {
    if (this.address === undefined) throw new Error('no address set')
    const response = await axios.get(`${API_BASE}/gear/balance/${this.address}`)

    if (response.status !== 200) { throw new Error('failed to load NFTs') }

    return response.data.map((nft: { metadata: { image: any } }) => nft.metadata.image)
  }

  async getGearParams (): Promise<string[]> {
    if (this.address === undefined) throw new Error('no address set')
    const response = await axios.get(`${API_BASE}/gear/equipment/${this.address}`)

    if (response.status !== 200) { throw new Error('failed to load NFTs') }

    return response.data
  }

  async mintGear (): Promise<{ receipt: { transactionHash: string } }> {
    if (this.address === undefined) throw new Error('no address set')
    const response = await axios.post(`${API_BASE}/gear/mint/${this.address}`)

    if (response.status !== 200) { throw new Error('failed to mint NFTs') }

    return response.data
  }

  async getLoot (): Promise<{ transactionHash: string }> {
    if (this.address === undefined) throw new Error('no address set')
    const response = await axios.post(`${API_BASE}/loot/debit/${this.address}`, { amount: 10 })

    if (response.status !== 200) { throw new Error('failed to mint NFTs') }

    return response.data
  }
}
