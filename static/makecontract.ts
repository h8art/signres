import { compile } from '@waves/ride-js'
import { broadcastAndWait } from './api'
import { setScript } from 'waves-transactions'


export const baseUri = 'https://testnodes.wavesnodes.com/'

export const chainId = 'T'



export const deployContract = async (creator: string, secretHash: string, contractSeed: string): Promise<string> => {
  const compiledContract = Buffer.from(compile(`
  let me = tx.sender

  match tx {
      case tx: DataTransaction =>
          let key1 = isDefined(getString(me, "mykey1"))
          let key2 = isDefined(getString(me, "mykey2"))
          let key3 = isDefined(getString(me, "mykey3"))
          let key4 = isDefined(getString(me, "mykey4"))
          let key5 = isDefined(getString(me, "mykey5"))
          key1 && key2 && key3 && key4 && key5

      case _ => false

  }



  `).result!).toString('base64')

  const setScriptTx = setScript({ chainId, script: compiledContract }, contractSeed)
  const r = await broadcastAndWait(setScriptTx, 1000 * 60 * 1)
  return r.id
}
