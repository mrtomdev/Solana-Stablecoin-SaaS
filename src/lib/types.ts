export type AdminActionType = 'CREATE' | 'MINT' | 'BURN' | 'FREEZE' | 'THAW' | 'UPDATE_METADATA';

export interface TokenInfo {
  mintAddress: string;
  name: string;
  symbol: string;
  decimals: number;
  supply: string;
  mintAuthority: string | null;
  freezeAuthority: string | null;
}

export interface HolderInfo {
  address: string;
  balance: string;
  tokenAccount: string;
}

export interface AdminActionRecord {
  id: string;
  mintAddress: string;
  action: AdminActionType;
  signature: string | null;
  details: string | null;
  walletAddress: string;
  status: string;
  createdAt: string;
}

export interface SupplyDataPoint {
  timestamp: string;
  supply: number;
  holders: number;
}

export interface CreateTokenParams {
  name: string;
  symbol: string;
  uri: string;
  decimals: number;
}

export interface MintParams {
  destination: string;
  amount: number;
}

export interface BurnParams {
  amount: number;
}

export interface FreezeParams {
  targetAccount: string;
}
