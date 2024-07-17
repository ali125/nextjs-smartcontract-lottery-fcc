import contractAddressesJson from "./contractAddresses.json";
import abiJson from "./abi.json";

export const abi = abiJson as any;
export const contractAddresses = contractAddressesJson as {
  [key: string]: string[];
};
