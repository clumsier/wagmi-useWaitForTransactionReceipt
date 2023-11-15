import { useEffect } from 'react';
import { TransactionReceipt, WriteContractReturnType } from 'viem';
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi';

export type ContractWriteWithTracking = {
  onInProgress: (data: WriteContractReturnType) => void;
  onCompleted: (data: TransactionReceipt | undefined) => void;
};

export function useWriteContractWithTracking({
  dataSimulate,
  onInProgress,
  onCompleted,
}: {
  // TO DO, some way to have it non any, any?
  // dataSimulate: UseSimulateContractReturnType<Abi>['data'];
  dataSimulate: any;
} & ContractWriteWithTracking) {
  const { data: hash, writeContract } = useWriteContract({
    mutation: {
      onSuccess: onInProgress,
    },
  });

  const { data: dataConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (dataConfirmed) {
      onCompleted(dataConfirmed);
    }
  }, [dataConfirmed]);

  return {
    writeContract: dataSimulate?.request ? () => writeContract(dataSimulate.request) : undefined,
    txHash: hash,
  };
}

export function useWriteContractUnpreparedWithTracking({
  onInProgress,
  onCompleted,
}: ContractWriteWithTracking) {
  const { data: hash, writeContract } = useWriteContract({
    mutation: {
      onSuccess: onInProgress,
    },
  });

  const { data: dataConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (dataConfirmed) {
      onCompleted(dataConfirmed);
    }
  }, [dataConfirmed]);

  return {
    writeContract,
    txHash: hash,
  };
}
