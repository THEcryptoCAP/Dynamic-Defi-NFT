const { ethers } = require('ethers');
const { updateNFTMetadata } = require('./updateNFTMetadata');
require('dotenv').config();

const NFT_CONTRACT_ADDRESS = "YOUR_DEPLOYED_CONTRACT_ADDRESS";
const NFT_CONTRACT_ABI = [
    "function totalSupply() view returns (uint256)",
    "function tokenByIndex(uint256 index) view returns (uint256)"
];

class MetadataUpdateService {
    constructor() {
        this.provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
        this.contract = new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI, this.provider);
        this.updateInterval = 5 * 60 * 1000; // 5 minutes in milliseconds
        this.isRunning = false;
    }

    async getAllTokenIds() {
        const totalSupply = await this.contract.totalSupply();
        const tokenIds = [];
        
        for (let i = 0; i < totalSupply; i++) {
            const tokenId = await this.contract.tokenByIndex(i);
            tokenIds.push(tokenId);
        }
        
        return tokenIds;
    }

    async updateAllTokens() {
        try {
            const tokenIds = await this.getAllTokenIds();
            console.log(`Updating metadata for ${tokenIds.length} tokens...`);
            
            for (const tokenId of tokenIds) {
                try {
                    await updateNFTMetadata(tokenId);
                    console.log(`Updated token ${tokenId}`);
                } catch (error) {
                    console.error(`Failed to update token ${tokenId}:`, error);
                }
            }
        } catch (error) {
            console.error('Error in updateAllTokens:', error);
        }
    }

    start() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        console.log('Starting metadata update service...');
        
        // Initial update
        this.updateAllTokens();
        
        // Schedule periodic updates
        this.interval = setInterval(() => {
            this.updateAllTokens();
        }, this.updateInterval);
    }

    stop() {
        if (!this.isRunning) return;
        
        this.isRunning = false;
        clearInterval(this.interval);
        console.log('Stopping metadata update service...');
    }
}

// Create and start the service
const service = new MetadataUpdateService();
service.start();

// Handle process termination
process.on('SIGINT', () => {
    service.stop();
    process.exit();
});

process.on('SIGTERM', () => {
    service.stop();
    process.exit();
}); 