"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BOND_TOKEN_ABI = exports.PRIMARY_ISSUANCE_ABI = exports.USDC_ABI = exports.CONTRACT_ADDRESSES = exports.CHAIN_ID = void 0;
exports.getContractAddress = getContractAddress;
const viem_1 = require("viem");
/**
 * Contract addresses for Base Sepolia testnet
 */
exports.CHAIN_ID = 84532; // Base Sepolia
exports.CONTRACT_ADDRESSES = {
    [exports.CHAIN_ID]: {
        USDC: '0x0000000000000000000000000000000000000000', // To be deployed
        PrimaryIssuance: '0x0000000000000000000000000000000000000000', // To be deployed
        BondTokenFactory: '0x0000000000000000000000000000000000000000', // To be deployed
    }
};
function getContractAddress(chainId, contract) {
    const addresses = exports.CONTRACT_ADDRESSES[chainId];
    if (!addresses) {
        throw new Error(`Unsupported chain ID: ${chainId}`);
    }
    return addresses[contract];
}
/**
 * Contract ABIs
 */
exports.USDC_ABI = (0, viem_1.parseAbi)([
    'function balanceOf(address owner) view returns (uint256)',
    'function transfer(address to, uint256 amount) returns (bool)',
    'function approve(address spender, uint256 amount) returns (bool)',
    'function allowance(address owner, address spender) view returns (uint256)',
    'function mint(address to, uint256 amount)',
    'function decimals() view returns (uint8)',
    'function symbol() view returns (string)',
    'function name() view returns (string)',
]);
exports.PRIMARY_ISSUANCE_ABI = (0, viem_1.parseAbi)([
    'function commit(string memory productId, uint256 amount)',
    'function withdraw(string memory productId, uint256 amount)',
    'function finalise(string memory productId, address bondToken, uint256 exchangeRate)',
    'function cancel(string memory productId)',
    'function getCommitment(string memory productId, address user) view returns (uint256)',
    'function getTotalCommitted(string memory productId) view returns (uint256)',
    'function isFinalised(string memory productId) view returns (bool)',
    'event Committed(string indexed productId, address indexed user, uint256 amount)',
    'event Withdrawn(string indexed productId, address indexed user, uint256 amount)',
    'event Finalised(string indexed productId, address bondToken, uint256 exchangeRate)',
    'event Cancelled(string indexed productId)',
]);
exports.BOND_TOKEN_ABI = (0, viem_1.parseAbi)([
    'function balanceOf(address owner) view returns (uint256)',
    'function transfer(address to, uint256 amount) returns (bool)',
    'function decimals() view returns (uint8)',
    'function symbol() view returns (string)',
    'function name() view returns (string)',
    'function totalSupply() view returns (uint256)',
]);
