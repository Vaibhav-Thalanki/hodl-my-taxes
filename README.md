
# HODL My Taxes: dApp for Tax Compliance on Online Gambling Platforms
A decentralized application for automatic tax withholding and reporting for players, operators, and governments. Transparent. Trustless. Open-source.





## Full Description

### The Problem

Online gambling platforms face major tax compliance challenges:
- Players often underreport winnings, risking audits.
- Operators manage tax documentation manually, leading to inefficiencies.
- Governments lose billions annually to underreported gambling income.

Current systems rely on manual processes and trust, leading to errors, delays, and lost revenue.

---

### Our Solution: HODL My Taxes

HODL My Taxes automates the recording and calculation of online gambling-based taxes using smart contracts:

- Players record transactions categorized as Income, Expense, or Capital Gain.
- Players can calculate their tax owed based on their recorded income using an on-chain function.
- Players can issue verifiable tax proofs linked to their recorded ledgers.
- Tax authorities can aggregate and review all user transaction histories transparently.

No manual reconciliation. No hidden transactions.  
Just real-time, auditable tax compliance on blockchain.

---

### How Polkadot Made This Possible

Built on Polkadot Asset Hub, HODL My Taxes leverages:

| Polkadot Feature | Impact |
|:---|:---|
| Low transaction fees | Enables frequent, small transaction recording affordably. |
| Secure EVM smart contracts | Solidity smart contracts deploy natively without bridge risks. |
| Real-time transparency | All transactions and proofs are immediately verifiable on-chain. |
| Interoperability | Future ability to extend across parachains and multi-currency ecosystems. |
| Scalability | Handles mass transaction recording without congestion or cost spikes. |


## Technical Description
### System Architecture

HODL My Taxes provides two main views:

- **User View:**  
  Individual players can:
  - Record transactions (Income, Expense, Capital Gain)
  - File tax calculations based on a chosen rate
  - Issue tax proofs linking their on-chain activity
  - Export their personal ledgers as CSV files (via frontend)

- **IRS (Tax Authority) View:**  
  Tax authorities can:
  - Aggregate all user transaction data
  - Generate CSV reports for multiple users
  - Verify ownership of specific tax proofs

All data is secured and recorded through a custom smart contract on Polkadot Asset Hub.

---

### Smart Contract Functions

**User View Functions:**
- `recordTransaction(category, itemId, price)`:  
  Records a transaction under the selected category.

- `fileTax(ratePercent)`:  
  Calculates tax owed based on recorded Income transactions.

- `issueTaxProof(metadata)`:  
  Emits a tax proof event, checkpointing the ledger history.

- `generateCSV()`:  
  *(Frontend-side function)* Reads user's on-chain transactions to create a downloadable CSV.

---

**IRS (Tax Authority) View Functions:**
- `getUserCount()`, `getUser(index)`:  
  Enumerate users to fetch their transaction histories.

- `getTransactionCount(address)`, `getTransaction(address, index)`:  
  Fetch individual user transactions.

- `getProofOwner(metadata)`:  
  Retrieve the user who issued a specific tax proof.

- `generateCSV()`:  
  *(Frontend-side function)* Aggregate multiple user ledgers into downloadable CSVs.

---

### SDKs and Tools Used

| SDK / Tool | Purpose |
|:---|:---|
| `Asset Hub` | Hosting EVM-compatible Smart Contracts |
| `viem` | Interacting with smart contracts on Asset Hub |
| `Remix IDE` | Smart Contact writing and deployment to Asset Hub |
| `Next.js` | Build the user interface (User View + IRS View) |
| `csv-writer` | Generate CSV files in the browser |
| `Vercel` |  Application deployment |

---

  
  

## Presentation
[View our Canva Presentation](https://www.canva.com/design/DAGlxei1P5Q/pz5BQIsgbs7lS7GoepVVeA/edit?utm_content=DAGlxei1P5Q&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton)

## Custom Smart Contract
https://github.com/anandms101/viem-dapp/blob/f09a3fe1d53efd9ad85903d6bd81646d189d5d2c/remixContract/TaxBot.sol#L1-L107

## Demo
[Live Demo](https://hodl-my-taxes.vercel.app/)

## Screenshots

![Remix Deployment to Polkadot Westend Asset Hub](https://github.com/user-attachments/assets/34a939bb-8941-4d4c-a424-08325ada2ff7)



## Smart Contract & Application Overview
![Smart Contract Overview](https://github.com/anandms101/viem-dapp/blob/9384958f20e6653a2587f177dbeea3b2b576559f/HODLTaxes.png "Smart Contract Overview")

## Walkthrough Video
## Block Explorer Link

View Block explorer link for deployed smart contract on Asset Hub:  
[Asset Hub Explorer](https://assethub-westend.subscan.io/account/0x5991E37727267faFA9f635826e8246F41b3DEd69)


## License

This project is open-source under the MIT License.


## Authors

- [Vaibhav Thalanki](https://github.com/Vaibhav-Thalanki)
- [Anand Singh](https://github.com/anandms101)
- [Chaitanya Agarwal](https://github.com/Chaim3ra)
- [Rishabh Kumar](https://github.com/k-rishabh)
