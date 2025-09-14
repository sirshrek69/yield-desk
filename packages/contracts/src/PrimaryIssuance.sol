// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./BondToken.sol";

/**
 * @title PrimaryIssuance
 * @dev Manages primary bond raises, commitments, and finalization
 */
contract PrimaryIssuance is Ownable, ReentrancyGuard {
    struct Raise {
        string productId;
        uint256 softCap;
        uint256 hardCap;
        uint256 amountCommitted;
        uint256 startTime;
        uint256 endTime;
        bool isFinalised;
        bool isCancelled;
        address bondToken;
        uint256 exchangeRate; // Bond tokens per USDC (scaled by decimals)
    }

    mapping(string => Raise) public raises;
    mapping(string => mapping(address => uint256)) public commitments;
    mapping(string => address[]) public participants;

    IERC20 public immutable usdc;

    event RaiseCreated(
        string indexed productId,
        uint256 softCap,
        uint256 hardCap,
        uint256 startTime,
        uint256 endTime
    );

    event Committed(
        string indexed productId,
        address indexed user,
        uint256 amount
    );

    event Withdrawn(
        string indexed productId,
        address indexed user,
        uint256 amount
    );

    event Finalised(
        string indexed productId,
        address bondToken,
        uint256 exchangeRate
    );

    event Cancelled(string indexed productId);

    constructor(address _usdc, address initialOwner) Ownable(initialOwner) {
        usdc = IERC20(_usdc);
    }

    /**
     * @dev Create a new bond raise
     */
    function createRaise(
        string memory productId,
        uint256 softCap,
        uint256 hardCap,
        uint256 startTime,
        uint256 endTime
    ) external onlyOwner {
        require(bytes(productId).length > 0, "Product ID cannot be empty");
        require(softCap > 0 && hardCap > softCap, "Invalid caps");
        require(startTime < endTime, "Invalid time range");
        require(!raises[productId].isFinalised, "Raise already exists");

        raises[productId] = Raise({
            productId: productId,
            softCap: softCap,
            hardCap: hardCap,
            amountCommitted: 0,
            startTime: startTime,
            endTime: endTime,
            isFinalised: false,
            isCancelled: false,
            bondToken: address(0),
            exchangeRate: 0
        });

        emit RaiseCreated(productId, softCap, hardCap, startTime, endTime);
    }

    /**
     * @dev Commit USDC to a bond raise
     */
    function commit(string memory productId, uint256 amount) external nonReentrant {
        Raise storage raise = raises[productId];
        require(bytes(raise.productId).length > 0, "Raise does not exist");
        require(!raise.isFinalised && !raise.isCancelled, "Raise is not active");
        require(block.timestamp >= raise.startTime, "Raise has not started");
        require(block.timestamp <= raise.endTime, "Raise has ended");
        require(amount > 0, "Amount must be positive");
        require(raise.amountCommitted + amount <= raise.hardCap, "Exceeds hard cap");

        // Transfer USDC from user to contract
        usdc.transferFrom(msg.sender, address(this), amount);

        // Update commitments
        commitments[productId][msg.sender] += amount;
        raise.amountCommitted += amount;

        // Add to participants if first commitment
        if (commitments[productId][msg.sender] == amount) {
            participants[productId].push(msg.sender);
        }

        emit Committed(productId, msg.sender, amount);
    }

    /**
     * @dev Withdraw committed USDC (before finalization)
     */
    function withdraw(string memory productId, uint256 amount) external nonReentrant {
        Raise storage raise = raises[productId];
        require(bytes(raise.productId).length > 0, "Raise does not exist");
        require(!raise.isFinalised, "Raise is finalised");
        require(block.timestamp <= raise.endTime, "Cannot withdraw after raise ends");
        require(commitments[productId][msg.sender] >= amount, "Insufficient commitment");

        // Update commitments
        commitments[productId][msg.sender] -= amount;
        raise.amountCommitted -= amount;

        // Transfer USDC back to user
        usdc.transfer(msg.sender, amount);

        emit Withdrawn(productId, msg.sender, amount);
    }

    /**
     * @dev Finalize a bond raise and mint bond tokens
     */
    function finalise(
        string memory productId,
        address bondToken,
        uint256 exchangeRate
    ) external onlyOwner {
        Raise storage raise = raises[productId];
        require(bytes(raise.productId).length > 0, "Raise does not exist");
        require(!raise.isFinalised && !raise.isCancelled, "Raise is not active");
        require(block.timestamp > raise.endTime, "Raise has not ended");
        require(raise.amountCommitted >= raise.softCap, "Soft cap not reached");
        require(bondToken != address(0), "Invalid bond token");
        require(exchangeRate > 0, "Invalid exchange rate");

        raise.isFinalised = true;
        raise.bondToken = bondToken;
        raise.exchangeRate = exchangeRate;

        // Mint bond tokens to participants
        address[] memory raiseParticipants = participants[productId];
        for (uint256 i = 0; i < raiseParticipants.length; i++) {
            address participant = raiseParticipants[i];
            uint256 commitment = commitments[productId][participant];
            if (commitment > 0) {
                uint256 bondTokens = (commitment * exchangeRate) / 1e6; // Adjust for USDC decimals
                BondToken(bondToken).mint(participant, bondTokens);
            }
        }

        emit Finalised(productId, bondToken, exchangeRate);
    }

    /**
     * @dev Cancel a bond raise and return all committed funds
     */
    function cancel(string memory productId) external onlyOwner {
        Raise storage raise = raises[productId];
        require(bytes(raise.productId).length > 0, "Raise does not exist");
        require(!raise.isFinalised, "Raise is finalised");

        raise.isCancelled = true;

        // Return all committed funds
        address[] memory raiseParticipants = participants[productId];
        for (uint256 i = 0; i < raiseParticipants.length; i++) {
            address participant = raiseParticipants[i];
            uint256 commitment = commitments[productId][participant];
            if (commitment > 0) {
                commitments[productId][participant] = 0;
                usdc.transfer(participant, commitment);
            }
        }

        raise.amountCommitted = 0;

        emit Cancelled(productId);
    }

    /**
     * @dev Get commitment amount for a user
     */
    function getCommitment(string memory productId, address user) external view returns (uint256) {
        return commitments[productId][user];
    }

    /**
     * @dev Get total committed amount for a raise
     */
    function getTotalCommitted(string memory productId) external view returns (uint256) {
        return raises[productId].amountCommitted;
    }

    /**
     * @dev Check if raise is finalised
     */
    function isFinalised(string memory productId) external view returns (bool) {
        return raises[productId].isFinalised;
    }
}
