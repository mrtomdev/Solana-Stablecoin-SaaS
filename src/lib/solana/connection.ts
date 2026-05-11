import { Connection } from '@solana/web3.js';
import { config } from '../config';

let connectionInstance: Connection | null = null;

export function getConnection(): Connection {
  if (!connectionInstance) {
    connectionInstance = new Connection(config.rpcUrl, 'confirmed');
  }
  return connectionInstance;
}
