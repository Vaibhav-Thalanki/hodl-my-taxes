
# HODL My Taxes: Smart Contracts for Betting Compliance
A smart contract system for automatic tax withholding and reporting for players, operators, and governments. Transparent. Trustless. Open-source.





## Full Description

### The Problem

Online gambling platforms face major tax compliance challenges:
- Players often underreport winnings, risking audits.
- Operators manage tax withholding manually, creating inefficiency and cost.
- Governments lose billions annually to underreported gambling income.

Current solutions rely heavily on manual processes and trust, leading to errors, delays, and lost revenue.


### Our Solution: HODL My Taxes

HODL My Taxes automates gambling tax compliance directly through smart contracts:
- When a player wins, the contract automatically splits winnings into:
  - Net payout to the player.
  - Withheld tax securely escrowed on-chain.
- Tax authorities can claim escrowed amounts transparently.
- All transactions are recorded immutably for full auditability.

This eliminates manual reconciliation, reduces audit risk, and guarantees transparency for players, operators, and regulators.

### How Polkadot Made This Possible

HODL My Taxes is built on Polkadot Asset Hub, leveraging:

| Feature | Impact |
|:---|:---|
| Low transaction fees | Enables micro-bets and small tax transactions affordably. |
| Secure EVM smart contracts | Native Solidity support without cross-chain bridging risks. |
| Real-time transparency | Immediate visibility of payouts and tax escrows(see block explorer link below). |
| Interoperability | Future support for multi-currency payouts across parachains. |
| Scalability | Handles thousands of transactions without congestion or fee spikes. |


## Technical Description
### Architecture Overview

The HODL My Taxes system consists of two primary views:

- User View: 
  Allows individual players to record transactions, generate tax proofs, and export their personal ledgers.

- IRS (Tax Authority) View:  
  Allows tax authorities to generate tax reports across all users and access individual transaction details.

All interactions are secured and recorded on-chain via a custom smart contract deployed on Polkadot Asset Hub.


### Smart Contract Functions

User View:
- `recordTransaction(category, itemId, price)`:  
  Records a transaction for the user, classified as Income, Expense, or Capital Gain.
  
- `issueTaxProof(metadata)`:  
  Emits an event with a metadata string, allowing a checkpoint to be created in the ledger, up and until this point in time.
  
- `generateCSV()`:  
  Frontend-side function that reads all of the user's on-chain transactions and generates a downloadable CSV file of their ledger.

---

IRS View:
- `generateCSV()`:  
  Frontend-side function that aggregates all users’ transactions from the smart contract and generates multiple CSV reports (one per user).

  
  

## Presentation
[Canva Presentation](https://www.canva.com/design/DAGlxei1P5Q/pz5BQIsgbs7lS7GoepVVeA/edit?utm_content=DAGlxei1P5Q&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton)
## Custom Smart Contract
https://github.com/anandms101/viem-dapp/blob/717f561d3c3a52069f6845b2cc89d6451f62976e/remixContract/TaxBot.sol#L1-L68
## Demo
## Screenshots
## Smart Contract Overview
## Walkthrough Video
## Block Explorer Link

[Asset Hub](https://assethub-westend.subscan.io/account/0xd5621D4D3B08211E6310787Db5A2E1C0CDf544cf)
## License

This project is open-source under the MIT License.


## Authors

- [Vaibhav Thalanki](https://github.com/Vaibhav-Thalanki)
- [Anand Singh](https://github.com/anandms101)
- [Chaitanya Agarwal](https://github.com/Chaim3ra)

