// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title BondToken
 * @dev ERC20 token representing bond holdings
 */
contract BondToken is ERC20, Ownable {
    uint8 private constant DECIMALS = 8;
    string private _productId;
    uint256 private _maturityDate;
    uint256 private _couponRate; // Basis points (e.g., 425 for 4.25%)
    uint256 private _couponFrequency; // Payments per year

    constructor(
        string memory productId,
        string memory name,
        string memory symbol,
        uint256 maturityDate,
        uint256 couponRate,
        uint256 couponFrequency,
        address initialOwner
    ) ERC20(name, symbol) Ownable(initialOwner) {
        _productId = productId;
        _maturityDate = maturityDate;
        _couponRate = couponRate;
        _couponFrequency = couponFrequency;
    }

    function decimals() public pure override returns (uint8) {
        return DECIMALS;
    }

    function productId() public view returns (string memory) {
        return _productId;
    }

    function maturityDate() public view returns (uint256) {
        return _maturityDate;
    }

    function couponRate() public view returns (uint256) {
        return _couponRate;
    }

    function couponFrequency() public view returns (uint256) {
        return _couponFrequency;
    }

    /**
     * @dev Mint tokens to a specific address
     * @param to The address to mint tokens to
     * @param amount The amount of tokens to mint
     */
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    /**
     * @dev Burn tokens from a specific address
     * @param from The address to burn tokens from
     * @param amount The amount of tokens to burn
     */
    function burn(address from, uint256 amount) external onlyOwner {
        _burn(from, amount);
    }
}
