// contracts/GameTax.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract GameTax {
    enum Category { Income, Expense, CapitalGain }

    struct Tx {
        Category category;
        uint256 itemId;
        uint256 price;
        uint256 timestamp;
    }

    // Store transactions per user
    mapping(address => Tx[]) private _txs;
    // Store unique proof keys mapping to issuer
    mapping(string  => address) private _proofOwners;
    // Track seen users for user list
    mapping(address => bool)    private _seen;
    address[]                   private _users;

    address public taxAuthority;

    event TransactionRecorded(
        address indexed who,
        Category category,
        uint256 itemId,
        uint256 price,
        uint256 timestamp
    );

    event TaxProofIssued(address indexed who, string proofKey);

    constructor() {
        taxAuthority = msg.sender;
    }

    /**
     * @notice Bundles recording a transaction and issuing a proof in one on-chain call
     * @param category  The category enum (0=Income,1=Expense,2=CapitalGain)
     * @param itemId    Identifier for the item/NFT
     * @param price     Net price (after tax deduction applied off-chain)
     * @param proofKey  Unique string proof (e.g. txHash or UUID) to map back to the user
     */
    function recordAndProof(
        Category category,
        uint256 itemId,
        uint256 price,
        string calldata proofKey
    ) external {
        // track unique users list
        if (!_seen[msg.sender]) {
            _seen[msg.sender] = true;
            _users.push(msg.sender);
        }

        // record the transaction
        Tx memory t = Tx(category, itemId, price, block.timestamp);
        _txs[msg.sender].push(t);
        emit TransactionRecorded(msg.sender, category, itemId, price, t.timestamp);

        // issue proof mapping
        _proofOwners[proofKey] = msg.sender;
        emit TaxProofIssued(msg.sender, proofKey);
    }

    /// @notice Issue proof without recording a new transaction
    function issueTaxProof(string calldata proofKey) external {
        _proofOwners[proofKey] = msg.sender;
        emit TaxProofIssued(msg.sender, proofKey);
    }

    /// @notice Total distinct users who have recorded
    function getUserCount() external view returns (uint256) {
        return _users.length;
    }

    /// @notice Fetch the nth user’s address
    function getUser(uint256 idx) external view returns (address) {
        return _users[idx];
    }

    /// @notice How many transactions a user has recorded
    function getTransactionCount(address who) external view returns (uint256) {
        return _txs[who].length;
    }

    /// @notice Retrieve a specific transaction
    function getTransaction(address who, uint256 idx)
        external
        view
        returns (Category, uint256, uint256, uint256)
    {
        Tx memory t = _txs[who][idx];
        return (t.category, t.itemId, t.price, t.timestamp);
    }

    /// @notice Lookup who issued a given proofKey
    function getProofOwner(string calldata proofKey)
        external
        view
        returns (address)
    {
        return _proofOwners[proofKey];
    }
}
