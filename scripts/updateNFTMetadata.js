const { ethers } = require('ethers');
const { generateMetadata } = require('./fetchDefiData');
require('dotenv').config();

const NFT_CONTRACT_ADDRESS = "YOUR_DEPLOYED_CONTRACT_ADDRESS";
const NFT_CONTRACT_ABI = [
    "function updatePerformanceMetrics(uint256 _tokenId, uint256 _uniswapValue, uint256 _aaveValue, uint256 _curveValue, uint256 _makerDAOValue, uint256 _pendleValue, uint256 _yapsScore) external",
    "function tokenTwitterHandles(uint256) view returns (string)",
    "function ownerOf(uint256) view returns (address)"
];

async function updateNFTMetadata(tokenId) {
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    const contract = new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI, wallet);

    try {
        // Get token owner and Twitter handle
        const owner = await contract.ownerOf(tokenId);
        const twitterHandle = await contract.tokenTwitterHandles(tokenId);

        // Generate metadata with current DeFi data
        const metadata = await generateMetadata(tokenId, owner, twitterHandle);

        // Update performance metrics on the contract
        const tx = await contract.updatePerformanceMetrics(
            tokenId,
            metadata.attributes[0].value,
            metadata.attributes[1].value,
            metadata.attributes[2].value,
            metadata.attributes[3].value,
            metadata.attributes[4].value,
            metadata.attributes[5].value
        );

        await tx.wait();
        console.log(`Successfully updated metadata for token ${tokenId}`);
        return true;
    } catch (error) {
        console.error(`Error updating metadata for token ${tokenId}:`, error);
        return false;
    }
}

// Example usage
async function main() {
    const tokenId = process.argv[2];
    if (!tokenId) {
        console.error("Please provide a token ID");
        return;
    }

    await updateNFTMetadata(parseInt(tokenId));
}

if (require.main === module) {
    main().catch(console.error);
}

module.exports = { updateNFTMetadata }; 