// contracts/GameTax.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract GameTax {
    enum Category { Income, Expense, CapitalGain }
    struct Tx { Category category; uint256 itemId; uint256 price; uint256 timestamp; }

    mapping(address => Tx[]) private _txs;
    address[]              private _users;
    mapping(address => bool) private _seen;
    address public taxAuthority;

    // New: map proof metadata → who issued it
    mapping(string => address) private _proofOwners;

    event TransactionRecorded(
        address indexed who,
        Category category,
        uint256 itemId,
        uint256 price,
        uint256 timestamp
    );
    event TaxProofIssued(address indexed who, string metadata);

    constructor() {
        taxAuthority = msg.sender;
    }

    function recordTransaction(
        Category category,
        uint256 itemId,
        uint256 price
    ) external {
        if (!_seen[msg.sender]) {
            _seen[msg.sender] = true;
            _users.push(msg.sender);
        }
        Tx memory t = Tx(category, itemId, price, block.timestamp);
        _txs[msg.sender].push(t);
        emit TransactionRecorded(msg.sender, category, itemId, price, t.timestamp);
    }

    function getTransactionCount(address who) external view returns (uint256) {
        return _txs[who].length;
    }

    function getTransaction(address who, uint256 idx)
        external
        view
        returns (Category, uint256, uint256, uint256)
    {
        Tx memory t = _txs[who][idx];
        return (t.category, t.itemId, t.price, t.timestamp);
    }

    /// @notice How many distinct users have recorded transactions
    function getUserCount() external view returns (uint256) {
        return _users.length;
    }

    /// @notice Fetch the nᵗʰ user’s address
    function getUser(uint256 idx) external view returns (address) {
        return _users[idx];
    }

    /// @notice “mint” your proof by emitting this event
    function issueTaxProof(string calldata metadata) external {
        _proofOwners[metadata] = msg.sender;
        emit TaxProofIssued(msg.sender, metadata);
    }

    /// @notice Given a proof string, who issued it?
    function getProofOwner(string calldata metadata)
        external
        view
        returns (address)
    {
        return _proofOwners[metadata];
    }
}