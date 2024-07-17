"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useWeb3Contract } from "react-moralis";
import { abi, contractAddresses } from "@/constants";
import { useMoralis } from "react-moralis";
import { ethers } from "ethers";
import { useNotification } from "@web3uikit/web3";

const LotteryEntrance = () => {
  const [entranceFee, setEntranceFee] = useState<string>("0");
  const [numPlayers, setNumPlayers] = useState<string>("0");
  const [recentWinner, setRecentWinner] = useState<string>("0");
  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
  // const dispatch = useNotification();
  const dispatch = (p: any) => {};

  const chainId = parseInt(chainIdHex!);
  const raffleAddress =
    chainId in contractAddresses ? contractAddresses[chainId][0] : undefined;

  const {
    runContractFunction: enterRaffle,
    isLoading,
    isFetching,
  } = useWeb3Contract({
    abi,
    contractAddress: raffleAddress,
    functionName: "enterRaffle",
    params: {},
    msgValue: entranceFee,
  });

  const { runContractFunction: getEntranceFee } = useWeb3Contract({
    abi,
    contractAddress: raffleAddress,
    functionName: "getEntranceFee",
    params: {},
  });

  const { runContractFunction: getNumPlayers } = useWeb3Contract({
    abi,
    contractAddress: raffleAddress,
    functionName: "getNumPlayers",
    params: {},
  });

  const { runContractFunction: getRecentWinner } = useWeb3Contract({
    abi,
    contractAddress: raffleAddress,
    functionName: "getRecentWinner",
    params: {},
  });

  const handleUpdate = useCallback(async () => {
    const entranceFeeFromContract = await getEntranceFee({
      onError: (error) => console.log(error),
    });
    const numPlayersFromContract = await getNumPlayers({
      onError: (error) => console.log(error),
    });
    const recentWinnerFromContract = await getRecentWinner({
      onError: (error) => console.log(error),
    });
    setNumPlayers((numPlayersFromContract || "0").toString());
    setRecentWinner((recentWinnerFromContract || "0").toString());
    setEntranceFee((entranceFeeFromContract || "0").toString());
  }, [getEntranceFee, getNumPlayers, getRecentWinner]);

  useEffect(() => {
    if (isWeb3Enabled) {
      // try to react the raffle entrance fee
      handleUpdate();
    }
  }, [isWeb3Enabled, handleUpdate]);

  const handleNewNotification = useCallback(() => {
    dispatch({
      type: "info",
      message: "Transaction Complete!",
      title: "Tx Notification",
      postion: "topR",
      icon: "bell",
    });
  }, [dispatch]);

  const handleSuccess = useCallback(
    async (tx: any) => {
      try {
        await tx.wait(1);
        handleNewNotification();
      } catch (err) {
        console.log(err);
      }
    },
    [handleNewNotification],
  );

  const handleEnterRaffle = useCallback(async () => {
    try {
      await enterRaffle({
        onSuccess: handleSuccess,
        onError: (error) => console.log(error),
      });
    } catch (err) {
      console.log(err);
    }
  }, [enterRaffle, handleSuccess]);

  return (
    <div>
      Hi from lottery entrance!
      {raffleAddress ? (
        <div>
          <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full" />
          <button onClick={handleEnterRaffle}>
            {isLoading || isFetching ? (
              <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full" />
            ) : (
              <div>Enter Raffle</div>
            )}
          </button>
          <p>Entrance Fee: {ethers.formatUnits(entranceFee, "ether")}</p>
          <p>ETH Number of Players: {numPlayers}</p>
          <p>Recent Winner: {recentWinner}</p>
        </div>
      ) : (
        <div>No Raffle Address Detected</div>
      )}
    </div>
  );
};

export default LotteryEntrance;
