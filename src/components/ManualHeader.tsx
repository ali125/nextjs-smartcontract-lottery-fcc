"use client";
import React, { useCallback, useEffect } from "react";
import { useMoralis } from "react-moralis";

const Header = () => {
  const {
    enableWeb3,
    account,
    isWeb3Enabled,
    Moralis,
    deactivateWeb3,
    isWeb3EnableLoading,
  } = useMoralis();

  useEffect(() => {
    if (!isWeb3Enabled && typeof window !== "undefined") {
      const connected = localStorage.getItem("connected");
      if (connected === "injected") {
        enableWeb3();
      }
    }
  }, [isWeb3Enabled, enableWeb3]);

  useEffect(() => {
    Moralis.onAccountChanged((account) => {
      console.log(`Account changed to ${account}`);
      if (account === null && typeof window !== "undefined") {
        localStorage.removeItem("connected");
        deactivateWeb3();
        console.log("Null account found");
      }
    });
  }, [Moralis]);

  const handleConnect = useCallback(async () => {
    try {
      await enableWeb3();

      if (typeof window !== "undefined") {
        localStorage.setItem("connected", "injected");
      }
    } catch (err) {
      console.log(err);
    }
  }, [enableWeb3]);

  return (
    <div>
      {account ? (
        <div>
          Connected to {account.slice(0, 6)}...
          {account.slice(account.length - 4)}
        </div>
      ) : (
        <button
          className="bg-purple-600 text-pink-900 px-10 py-3 font-medium text-lg text-center"
          onClick={handleConnect}
          disabled={isWeb3EnableLoading}
        >
          Connect
        </button>
      )}
    </div>
  );
};

export default Header;
