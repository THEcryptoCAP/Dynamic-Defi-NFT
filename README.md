# Dynamic DeFi NFT (dNFT)

A blockchain-based solution that creates dynamic NFTs reflecting real-time DeFi protocol performance metrics. These NFTs automatically update to display current DeFi participation and performance across multiple protocols.

## 🌟 Features

- **Dynamic NFT Metadata**: Automatically updates to reflect real-time DeFi protocol performance
- **Multi-Protocol Tracking**: Monitors positions across Uniswap, Aave, Curve, MakerDAO, and Pendle
- **YAPS Score Integration**: Includes social metrics from Kaito's YAPS API
- **On-Chain SVG Generation**: Renders NFT images directly on-chain with current data
- **Automated Update Service**: Background service that periodically refreshes NFT metadata

## 🏗️ Architecture

### Smart Contract

The core of the project is the `DynamicDeFiNFT.sol` contract which:

- Extends ERC721Enumerable for NFT functionality
- Stores and updates protocol performance data on-chain
- Generates dynamic SVG images with current metrics
- Associates NFTs with Twitter handles for social integration

### Backend Services

Three main JavaScript services handle the dynamic updating functionality:

1. **autoUpdateService.js**: Orchestrates the periodic updates for all NFTs
2. **fetchDefiData.js**: Retrieves current data from various DeFi protocols and APIs
3. **updateNFTMetadata.js**: Updates the on-chain NFT metadata with fresh data

## 🔧 Technical Stack

- **Blockchain**: Ethereum (Solidity 0.8.20)
- **Smart Contract Framework**: OpenZeppelin Contracts
- **Backend**: Node.js
- **Ethereum Interaction**: ethers.js
- **External Data**: Kaito API for YAPS score

## 📋 Prerequisites

- Node.js (v14+)
- Ethereum wallet with private key
- RPC provider URL (Infura, Alchemy, etc.)
- Kaito API key (for YAPS score)

## 🚀 Getting Started

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/dNft.git
cd dNft

# Install dependencies
npm install
```

### Configuration

Create a `.env` file in the root directory with the following variables:

```
RPC_URL=your_ethereum_rpc_url
PRIVATE_KEY=your_private_key
KAITO_API_KEY=your_kaito_api_key
```

### Contract Deployment

1. Deploy the `DynamicDeFiNFT.sol` contract to your preferred Ethereum network
2. Update the `NFT_CONTRACT_ADDRESS` in the script files with your deployed contract address

### Running the Update Service

```bash
# Start the automatic update service
node scripts/autoUpdateService.js
```

## 🧪 How It Works

1. A user mints an NFT with their Twitter handle
2. The update service periodically:
   - Fetches current DeFi protocol data for the wallet address
   - Retrieves YAPS score from Kaito API
   - Updates the NFT's on-chain metadata
   - Triggers a refresh of the NFT's visual representation

The NFT dynamically displays:
- Current value in Uniswap pools
- Aave lending/borrowing position
- Curve liquidity value
- MakerDAO vault status
- Pendle position value
- YAPS social score
- Last update timestamp

## 🔄 Contract Functions

- `mint(address _to, string memory _twitterHandle)`: Creates a new NFT
- `updatePerformanceMetrics(...)`: Updates the protocol performance data
- `tokenURI(uint256 _tokenId)`: Generates the NFT metadata with SVG image
- `getPerformanceData(uint256 _tokenId)`: Retrieves the current performance data

## 📊 Integration Points

The system integrates with:

- **Uniswap**: Liquidity pools
- **Aave**: Lending/borrowing positions
- **Curve**: Stablecoin pools
- **MakerDAO**: Vaults
- **Pendle**: Yield trading positions
- **Kaito API**: YAPS social score

## 🔒 Security Considerations

- Private keys should never be committed to the repository
- The contract uses OpenZeppelin's secure implementation patterns
- Only the contract owner can update NFT metadata

## 🛠️ Future Improvements

- Add more DeFi protocols
- Implement gasless metadata updates
- Create a frontend dashboard for NFT holders
- Add historical performance tracking

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Built with ❤️ for DeFi enthusiasts and NFT collectors
