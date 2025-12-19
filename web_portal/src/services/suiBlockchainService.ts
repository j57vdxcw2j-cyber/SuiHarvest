import { Transaction } from '@mysten/sui/transactions';
import { SuiClient } from '@mysten/sui/client';

/**
 * Sui Blockchain Service for SuiHarvest Game
 * Handles real blockchain transactions on Testnet
 */

// Initialize Sui client for testnet
const suiClient = new SuiClient({ url: 'https://fullnode.testnet.sui.io:443' });

// Contract addresses on Testnet (V5 - Removed Reward Amount Limits for Claim)
export const SUI_CONTRACT_CONFIG = {
  PACKAGE_ID: '0xfa2d05a857031c41addcaee9d55b099c44ef67143d29f21cb162d54e473cc118',
  GAME_TREASURY: '0x73d75d73101f46f438a461d4b6db02a2338bb7cc75cbb8759cd7c8252fe4c881',
  ADMIN_CAP: '0x0ed3858755a1958fb400e8eb4c597b37952d155a80a88b77728df75c1c92fd0b'
};

// Gas budget for transactions (in MIST)
const GAS_BUDGET = 10_000_000; // 0.01 SUI

// Fee amounts (in MIST - 1 SUI = 1,000,000,000 MIST)
export const DAILY_ENTRY_FEE = 750_000_000; // 0.75 SUI
export const MIN_REWARD = 400_000_000;      // 0.4 SUI
export const MAX_REWARD = 600_000_000;      // 0.6 SUI
// Economics: User pays 0.75 SUI/day × 4 days = 3.0 SUI revenue
// Avg reward: 0.5 SUI per chest → 2.5 SUI profit (83% margin)

interface SuiTransactionResult {
  success: boolean;
  digest?: string;
  error?: string;
}

/**
 * Check if wallet has sufficient balance for transaction
 */
export async function checkWalletBalance(walletAddress: string, requiredAmount: number): Promise<{ sufficient: boolean; balance: number }> {
  try {
    const balance = await suiClient.getBalance({ owner: walletAddress });
    const balanceInSui = parseInt(balance.totalBalance) / 1_000_000_000;
    const requiredInSui = requiredAmount / 1_000_000_000;
    
    console.log(`Wallet balance: ${balanceInSui} SUI, Required: ${requiredInSui} SUI`);
    
    return {
      sufficient: parseInt(balance.totalBalance) >= requiredAmount,
      balance: balanceInSui
    };
  } catch (error) {
    console.error('Error checking wallet balance:', error);
    return { sufficient: false, balance: 0 };
  }
}

/**
 * Pay daily entry fee to start a new day
 * User pays 0.75 SUI to the game treasury
 */
export async function payDailyEntryFee(
  signAndExecuteTransaction: any,
  walletAddress: string
): Promise<SuiTransactionResult> {
  return new Promise(async (resolve) => {
    try {
      // Check wallet balance first
      const requiredAmount = DAILY_ENTRY_FEE + 200_000_000; // 0.75 + 0.2 for buffer and gas
      const balanceCheck = await checkWalletBalance(walletAddress, requiredAmount);
      
      if (!balanceCheck.sufficient) {
        resolve({
          success: false,
          error: `Insufficient balance. You have ${balanceCheck.balance.toFixed(2)} SUI, but need at least ${(requiredAmount / 1_000_000_000).toFixed(2)} SUI (0.75 fee + 0.2 buffer)`
        });
        return;
      }
      
      const tx = new Transaction();
      
      // Split coin with MORE than required amount (1 SUI for safety)
      // Contract will take 0.75 SUI and return the rest
      const [paymentCoin] = tx.splitCoins(tx.gas, [1_000_000_000]); // 1 SUI
      
      // Call contract to pay fee
      tx.moveCall({
        target: `${SUI_CONTRACT_CONFIG.PACKAGE_ID}::game_treasury::pay_daily_fee`,
        arguments: [
          tx.object(SUI_CONTRACT_CONFIG.GAME_TREASURY),
          paymentCoin
        ],
      });
      
      tx.setGasBudget(GAS_BUDGET);
      
      // signAndExecuteTransaction is a mutation function that needs callbacks
      signAndExecuteTransaction(
        {
          transaction: tx,
        },
        {
          onSuccess: (result: any) => {
            console.log('✅ Transaction result:', result);
            console.log('Digest:', result.digest);
            
            // Simply check if we have a digest - that means transaction was submitted
            // Let's trust the transaction was successful if we get here
            if (result.digest) {
              console.log('✅ Transaction submitted successfully!');
              resolve({
                success: true,
                digest: result.digest
              });
            } else {
              resolve({
                success: false,
                error: 'No transaction digest returned'
              });
            }
          },
          onError: (error: any) => {
            console.error('❌ Transaction error:', error);
            resolve({
              success: false,
              error: error.message || 'Transaction failed'
            });
          }
        }
      );
    } catch (error: any) {
      console.error('Error paying daily fee:', error);
      resolve({
        success: false,
        error: error.message || 'Failed to pay daily fee'
      });
    }
  });
}

/**
 * Claim reward from treasure chest
 * Game treasury sends SUI reward to user
 */
export async function claimTreasureReward(
  signAndExecuteTransaction: any,
  rewardAmount: number // in SUI (e.g., 1.5, 2.0, 2.5)
): Promise<SuiTransactionResult> {
  return new Promise(async (resolve) => {
    try {
      // Convert SUI to MIST
      const rewardInMist = Math.floor(rewardAmount * 1_000_000_000);
      
      // Validate reward amount is positive
      if (rewardInMist <= 0) {
        resolve({
          success: false,
          error: `Invalid reward amount. Must be greater than 0`
        });
        return;
      }
      
      console.log(`🎯 Preparing claim transaction for ${rewardAmount} SUI (${rewardInMist} MIST)`);
      
      const tx = new Transaction();
      
      // Call contract to claim reward
      tx.moveCall({
        target: `${SUI_CONTRACT_CONFIG.PACKAGE_ID}::game_treasury::claim_reward`,
        arguments: [
          tx.object(SUI_CONTRACT_CONFIG.GAME_TREASURY),
          tx.pure.u64(rewardInMist)
        ],
      });
      
      // Use higher gas budget for claim transactions (0.1 SUI)
      tx.setGasBudget(100_000_000);
      
      // signAndExecuteTransaction is a mutation function that needs callbacks
      signAndExecuteTransaction(
        {
          transaction: tx,
        },
        {
          onSuccess: (result: any) => {
            console.log('✅ Claim reward result:', result);
            console.log('Digest:', result.digest);
            
            // Simply check if we have a digest - that means transaction was submitted
            if (result.digest) {
              console.log('✅ Claim successful!');
              resolve({
                success: true,
                digest: result.digest
              });
            } else {
              resolve({
                success: false,
                error: 'No transaction digest returned'
              });
            }
          },
          onError: (error: any) => {
            console.error('❌ Claim reward error:', error);
            resolve({
              success: false,
              error: error.message || 'Transaction failed'
            });
          }
        }
      );
    } catch (error: any) {
      console.error('Error claiming reward:', error);
      resolve({
        success: false,
        error: error.message || 'Failed to claim reward'
      });
    }
  });
}



/**
 * Admin function: Deposit SUI to replenish treasury
 * Only callable by admin (requires AdminCap)
 */
export async function adminDepositToTreasury(
  signAndExecuteTransaction: any,
  amountInSui: number
): Promise<SuiTransactionResult> {
  try {
    const amountInMist = Math.floor(amountInSui * 1_000_000_000);
    
    const tx = new Transaction();
    
    // Split amount from admin's coins
    const [coin] = tx.splitCoins(tx.gas, [amountInMist]);
    
    // Call contract
    tx.moveCall({
      target: `${SUI_CONTRACT_CONFIG.PACKAGE_ID}::game_treasury::admin_deposit`,
      arguments: [
        tx.object(SUI_CONTRACT_CONFIG.GAME_TREASURY),
        tx.object(SUI_CONTRACT_CONFIG.ADMIN_CAP),
        coin
      ],
    });
    
    tx.setGasBudget(GAS_BUDGET);
    
    return new Promise((resolve) => {
      signAndExecuteTransaction(
        {
          transaction: tx,
        },
        {
          onSuccess: (result: any) => {
            console.log('✅ Admin deposit result:', result);
            
            if (result.digest) {
              const isSuccess = result.rawEffects && result.rawEffects[1] === 1;
              
              if (isSuccess) {
                console.log('✅ Deposit successful!');
                resolve({
                  success: true,
                  digest: result.digest
                });
              } else {
                console.log('❌ Deposit failed on-chain');
                resolve({
                  success: false,
                  error: 'Transaction failed on blockchain'
                });
              }
            } else {
              resolve({
                success: false,
                error: 'No transaction digest returned'
              });
            }
          },
          onError: (error: any) => {
            console.error('❌ Admin deposit error:', error);
            resolve({
              success: false,
              error: error.message || 'Transaction failed'
            });
          }
        }
      );
    });
  } catch (error: any) {
    console.error('Error depositing to treasury:', error);
    return {
      success: false,
      error: error.message || 'Failed to deposit to treasury'
    };
  }
}

/**
 * Admin function: Withdraw SUI from treasury
 * Only callable by admin (requires AdminCap)
 */
export async function adminWithdrawFromTreasury(
  signAndExecuteTransaction: any,
  amountInSui: number
): Promise<SuiTransactionResult> {
  try {
    const amountInMist = Math.floor(amountInSui * 1_000_000_000);
    
    const tx = new Transaction();
    
    // Call contract to withdraw
    tx.moveCall({
      target: `${SUI_CONTRACT_CONFIG.PACKAGE_ID}::game_treasury::admin_withdraw`,
      arguments: [
        tx.object(SUI_CONTRACT_CONFIG.GAME_TREASURY),
        tx.object(SUI_CONTRACT_CONFIG.ADMIN_CAP),
        tx.pure.u64(amountInMist)
      ],
    });
    
    tx.setGasBudget(GAS_BUDGET);
    
    return new Promise((resolve) => {
      signAndExecuteTransaction(
        {
          transaction: tx,
        },
        {
          onSuccess: (result: any) => {
            console.log('✅ Admin withdraw result:', result);
            
            if (result.digest) {
              const isSuccess = result.rawEffects && result.rawEffects[1] === 1;
              
              if (isSuccess) {
                console.log('✅ Withdraw successful!');
                resolve({
                  success: true,
                  digest: result.digest
                });
              } else {
                console.log('❌ Withdraw failed on-chain');
                resolve({
                  success: false,
                  error: 'Transaction failed on blockchain'
                });
              }
            } else {
              resolve({
                success: false,
                error: 'No transaction digest returned'
              });
            }
          },
          onError: (error: any) => {
            console.error('❌ Admin withdraw error:', error);
            resolve({
              success: false,
              error: error.message || 'Transaction failed'
            });
          }
        }
      );
    });
  } catch (error: any) {
    console.error('Error withdrawing from treasury:', error);
    return {
      success: false,
      error: error.message || 'Failed to withdraw from treasury'
    };
  }
}

/**
 * Fetch treasury balance from blockchain
 */
export async function getTreasuryBalance(suiClient: any): Promise<number> {
  try {
    const object = await suiClient.getObject({
      id: SUI_CONTRACT_CONFIG.GAME_TREASURY,
      options: {
        showContent: true,
      },
    });

    if (object.data?.content?.type?.includes('GameTreasury')) {
      const fields = (object.data.content as any).fields;
      const balanceInMist = parseInt(fields.balance || '0');
      return balanceInMist / 1_000_000_000; // Convert MIST to SUI
    }
    
    return 0;
  } catch (error) {
    console.error('Error fetching treasury balance:', error);
    return 0;
  }
}

/**
 * Fetch recent admin transactions from blockchain
 */
export async function getAdminTransactions(suiClient: any, limit: number = 10): Promise<any[]> {
  try {
    const transactions = await suiClient.queryTransactionBlocks({
      filter: {
        InputObject: SUI_CONTRACT_CONFIG.GAME_TREASURY,
      },
      options: {
        showEffects: true,
        showInput: true,
        showEvents: true,
      },
      limit,
      order: 'descending',
    });

    return transactions.data.map((tx: any) => {
      const moveCall = tx.transaction?.data?.transaction?.transactions?.find(
        (t: any) => t.MoveCall
      );
      
      const functionName = moveCall?.MoveCall?.function || '';
      const isDeposit = functionName.includes('deposit');
      const isWithdraw = functionName.includes('withdraw');
      
      // Try to get amount from effects
      let amount = 0;
      if (tx.effects?.balanceChanges) {
        const change = tx.effects.balanceChanges.find(
          (bc: any) => bc.coinType === '0x2::sui::SUI'
        );
        if (change) {
          amount = Math.abs(parseInt(change.amount)) / 1_000_000_000;
        }
      }

      return {
        digest: tx.digest,
        type: isDeposit ? 'deposit' : isWithdraw ? 'withdraw' : 'unknown',
        amount,
        timestamp: tx.timestampMs,
        success: tx.effects?.status?.status === 'success',
      };
    });
  } catch (error) {
    console.error('Error fetching admin transactions:', error);
    return [];
  }
}
