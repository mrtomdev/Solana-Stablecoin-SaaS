import { prisma } from './index';
import { AdminActionType } from '../types';

export async function logAdminAction(params: {
  mintAddress: string;
  action: AdminActionType;
  signature?: string;
  details?: Record<string, unknown>;
  walletAddress: string;
  status?: string;
}) {
  return prisma.adminAction.create({
    data: {
      mintAddress: params.mintAddress,
      action: params.action,
      signature: params.signature ?? null,
      details: params.details ? JSON.stringify(params.details) : null,
      walletAddress: params.walletAddress,
      status: params.status ?? 'CONFIRMED',
    },
  });
}

export async function getAdminActions(mintAddress: string, limit = 50, offset = 0) {
  return prisma.adminAction.findMany({
    where: { mintAddress },
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: offset,
  });
}

export async function saveSupplySnapshot(mintAddress: string, supply: string, holders: number) {
  return prisma.supplySnapshot.create({
    data: { mintAddress, supply, holders },
  });
}

export async function getSupplySnapshots(mintAddress: string, days = 30) {
  const since = new Date();
  since.setDate(since.getDate() - days);
  return prisma.supplySnapshot.findMany({
    where: { mintAddress, timestamp: { gte: since } },
    orderBy: { timestamp: 'asc' },
  });
}

export async function saveStablecoinConfig(params: {
  mintAddress: string;
  name: string;
  symbol: string;
  decimals: number;
  mintAuthority: string;
  freezeAuthority?: string;
}) {
  return prisma.stablecoinConfig.upsert({
    where: { mintAddress: params.mintAddress },
    update: params,
    create: params,
  });
}

export async function getStablecoinConfig(mintAddress: string) {
  return prisma.stablecoinConfig.findUnique({ where: { mintAddress } });
}

// --- Peg Config ---
export async function getPegConfig(mintAddress: string) {
  return prisma.pegConfig.findUnique({ where: { mintAddress } });
}

export async function upsertPegConfig(mintAddress: string, data: { targetPrice: number; deviationThreshold: number }) {
  return prisma.pegConfig.upsert({
    where: { mintAddress },
    update: data,
    create: { mintAddress, ...data },
  });
}

export async function addPegHistory(mintAddress: string, price: number, deviation: number) {
  return prisma.pegHistory.create({ data: { mintAddress, price, deviation } });
}

export async function getPegHistory(mintAddress: string, days = 30) {
  const since = new Date();
  since.setDate(since.getDate() - days);
  return prisma.pegHistory.findMany({
    where: { mintAddress, timestamp: { gte: since } },
    orderBy: { timestamp: 'asc' },
  });
}

// --- Liquidity Config ---
export async function getLiquidityConfig(mintAddress: string) {
  return prisma.liquidityConfig.findUnique({ where: { mintAddress } });
}

export async function upsertLiquidityConfig(
  mintAddress: string,
  data: Partial<{ totalLiquidity: number; reserveTarget: number; collateralRatio: number; reserveBalance: number }>
) {
  return prisma.liquidityConfig.upsert({
    where: { mintAddress },
    update: data,
    create: { mintAddress, ...data },
  });
}

// --- Fee Config ---
export async function getFeeConfig(mintAddress: string) {
  return prisma.feeConfig.findUnique({ where: { mintAddress } });
}

export async function upsertFeeConfig(mintAddress: string, data: Record<string, unknown>) {
  const { mintAddress: _, id, createdAt, updatedAt, ...updateData } = data as Record<string, unknown>;
  return prisma.feeConfig.upsert({
    where: { mintAddress },
    update: updateData,
    create: { mintAddress, ...updateData },
  });
}

export async function addFeeRevenue(data: { mintAddress: string; feeType: string; amount: number; signature?: string }) {
  return prisma.feeRevenue.create({ data });
}

export async function getFeeRevenue(mintAddress: string, days = 30) {
  const since = new Date();
  since.setDate(since.getDate() - days);
  return prisma.feeRevenue.findMany({
    where: { mintAddress, timestamp: { gte: since } },
    orderBy: { timestamp: 'asc' },
  });
}

// --- Pause State ---
export async function getPauseState(mintAddress: string) {
  return prisma.pauseState.findUnique({ where: { mintAddress } });
}

export async function upsertPauseState(
  mintAddress: string,
  data: Partial<{ globalPause: boolean; mintPause: boolean; burnPause: boolean; transferPause: boolean; freezePause: boolean }>
) {
  return prisma.pauseState.upsert({
    where: { mintAddress },
    update: data,
    create: { mintAddress, ...data },
  });
}

// --- Circuit Breaker ---
export async function getCircuitBreakerConfig(mintAddress: string) {
  return prisma.circuitBreakerConfig.findUnique({ where: { mintAddress } });
}

export async function upsertCircuitBreakerConfig(
  mintAddress: string,
  data: Partial<{ supplyChangeThreshold: number; timeWindowMinutes: number; autoPauseEnabled: boolean }>
) {
  return prisma.circuitBreakerConfig.upsert({
    where: { mintAddress },
    update: data,
    create: { mintAddress, ...data },
  });
}

// --- Pause History ---
export async function addPauseHistory(data: { mintAddress: string; action: string; scope: string; reason?: string; walletAddress: string }) {
  return prisma.pauseHistory.create({ data });
}

export async function getPauseHistory(mintAddress: string, limit = 50) {
  return prisma.pauseHistory.findMany({
    where: { mintAddress },
    orderBy: { timestamp: 'desc' },
    take: limit,
  });
}
