// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

/**
 * @title IYieldFarmPool
 * @dev Interface for interacting with yield farming pools
 */
interface IYieldFarmPool {
    function deposit() external payable;

    function withdraw(uint256 amount) external;
}

/**
 * @title YieldFarmManager
 * @dev Contract to manage yield farming investments and automate fund allocation
 */
contract YieldFarmManager {
    address public owner; // Address of the contract owner
    address public bestPoolAddress; // Address of the current best yield farming pool
    mapping(address => uint256) public balances; // Mapping to store user balances
    mapping(address => uint256) public yields; // Mapping to store user yields
    uint256 public totalFunds; // Total funds deposited in the contract

    // Events
    event Deposit(address indexed user, uint256 amount); // Event emitted on deposit
    event Withdraw(address indexed user, uint256 amount, uint256 yield); // Event emitted on withdraw
    event PoolReallocated(address poolAddress); // Event emitted when the best pool is reallocated

    // Modifier to restrict functions to the contract owner
    modifier onlyOwner() {
        require(msg.sender == owner, "Not the contract owner");
        _;
    }

    /**
     * @dev Constructor sets the initial owner of the contract to the deployer
     */
    constructor() {
        owner = msg.sender;
    }

    /**
     * @dev Function to deposit funds into the contract
     * Automatically invests the funds into the current best pool
     */
    function deposit() public payable {
        require(msg.value > 0, "Deposit amount must be greater than zero");
        balances[msg.sender] += msg.value;
        totalFunds += msg.value;
        emit Deposit(msg.sender, msg.value);

        // Automatically invest the funds in the current best pool
        require(bestPoolAddress != address(0), "Invalid pool address");
        IYieldFarmPool(bestPoolAddress).deposit{value: msg.value}();
    }

    /**
     * @dev Function to withdraw funds from the contract
     * Withdraws funds from the current best pool and sends to the user
     */
    function withdraw() public {
        uint256 balance = balances[msg.sender];
        uint256 yield = yields[msg.sender];
        require(balance > 0, "Insufficient balance");

        balances[msg.sender] = 0;
        yields[msg.sender] = 0;
        totalFunds -= balance;

        // Withdraw funds from the current best pool
        require(bestPoolAddress != address(0), "Invalid pool address");
        IYieldFarmPool(bestPoolAddress).withdraw(balance);

        payable(msg.sender).transfer(balance + yield);
        emit Withdraw(msg.sender, balance, yield);
    }

    /**
     * @dev Function to reallocate the best pool address
     * Can only be called by the contract owner
     * @param poolAddress The address of the new best pool
     */
    function reallocate(address poolAddress) public onlyOwner {
        bestPoolAddress = poolAddress;
        emit PoolReallocated(poolAddress);
    }

    /**
     * @dev Function to update yields for multiple users
     * Can only be called by the owner
     * @param users The addresses of the users
     * @param newYields The new yield values for the users
     */
    function updateYields(
        address[] memory users,
        uint256[] memory newYields
    ) public onlyOwner {
        require(
            users.length == newYields.length,
            "Users and yields array length must match"
        );

        for (uint256 i = 0; i < users.length; i++) {
            yields[users[i]] = newYields[i];
        }
    }

    /**
     * @dev Function to get the current best pool address
     * @return The address of the current best pool
     */
    function getBestpoolAddress() public view returns (address) {
        return bestPoolAddress;
    }

    /**
     * @dev Function to get the balance of a user
     * @param user The address of the user
     * @return The balance of the user
     */
    function getBalance(address user) public view returns (uint256) {
        return balances[user];
    }

    /**
     * @dev Function to get the yield of a user
     * @param user The address of the user
     * @return The yield of the user
     */
    function getYield(address user) public view returns (uint256) {
        return yields[user];
    }
}
