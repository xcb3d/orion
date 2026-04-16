import { useCurrentAccount, useSuiClient } from '@mysten/dapp-kit';
import { useQuery } from '@tanstack/react-query';
import { sdk } from '../services/sui';

export type UserRole = 'merchant' | 'customer';

export function useRole() {
  const account = useCurrentAccount();
  const client = useSuiClient();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['user-role', account?.address],
    enabled: !!account,
    queryFn: async () => {
      if (!account) return 'customer';

      try {
        const response = await client.getOwnedObjects({
          owner: account.address,
          filter: {
            StructType: `${sdk.config.packageId}::suipay::MerchantCap`,
          },
        });

        return response.data && response.data.length > 0 ? 'merchant' : 'customer';
      } catch (e) {
        console.error("Role detection error:", e);
        return 'customer';
      }
    },
    // Keep it simple for now, but in production we'd want more robust caching/refetching
    staleTime: 60 * 1000, 
  });

  return { 
    role: data as UserRole || 'customer', 
    isMerchant: data === 'merchant',
    isCustomer: data === 'customer',
    isLoading, 
    refetch 
  };
}
