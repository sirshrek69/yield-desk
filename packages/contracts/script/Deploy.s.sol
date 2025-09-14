// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/USDC.sol";
import "../src/BondToken.sol";
import "../src/PrimaryIssuance.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        vm.startBroadcast(deployerPrivateKey);

        // Deploy USDC
        USDC usdc = new USDC(deployer);
        console.log("USDC deployed to:", address(usdc));

        // Deploy PrimaryIssuance
        PrimaryIssuance primaryIssuance = new PrimaryIssuance(address(usdc), deployer);
        console.log("PrimaryIssuance deployed to:", address(primaryIssuance));

        // Mint some USDC to deployer for testing
        usdc.mint(deployer, 1000000 * 10**6); // 1M USDC
        console.log("Minted 1M USDC to deployer");

        vm.stopBroadcast();

        // Write addresses to file for SDK
        string memory addressesJson = string(abi.encodePacked(
            '{\n',
            '  "84532": {\n',
            '    "USDC": "', vm.toString(address(usdc)), '",\n',
            '    "PrimaryIssuance": "', vm.toString(address(primaryIssuance)), '"\n',
            '  }\n',
            '}'
        ));

        vm.writeFile("packages/sdk/src/chain/addresses.json", addressesJson);
        console.log("Addresses written to packages/sdk/src/chain/addresses.json");
    }
}
