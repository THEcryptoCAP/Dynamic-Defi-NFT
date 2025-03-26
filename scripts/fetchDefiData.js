const { ethers } = require('ethers');
const axios = require('axios');
require('dotenv').config();

// Contract ABIs
const UNISWAP_POOL_ABI = [
    "function balanceOf(address owner) view returns (uint256)",
    "function totalSupply() view returns (uint256)",
    "function getReserves() view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)"
];

const AAVE_POOL_ABI = [
    "function getUserAccountData(address user) view returns (uint256 totalCollateralBase, uint256 totalDebtBase, uint256 availableBorrowsBase, uint256 currentLiquidationThreshold, uint256 ltv, uint256 healthFactor)"
];

const CURVE_POOL_ABI = [
    "function balances(uint256) view returns (uint256)",
    "function coins(uint256) view returns (address)"
];

const MAKER_VAULT_ABI = [
    "function ilk() view returns (bytes32)",
    "function ink() view returns (uint256)",
    "function art() view returns (uint256)"
];

const PENDLE_POOL_ABI = [
    "function balanceOf(address owner) view returns (uint256)",
    "function totalSupply() view returns (uint256)"
];

// Contract addresses (Mainnet)
const CONTRACT_ADDRESSES = {
    UNISWAP_POOL: "0x1d42064Fc4Beb5F8aAF85F4617AE8b3b5B8Bd801", // Example Uniswap V3 Pool
    AAVE_POOL: "0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9", // Aave V2 Lending Pool
    CURVE_POOL: "0xDC24316b9AA028AcF3BeD0E1B0DF50765D7fA2b1", // Example Curve Pool
    MAKER_VAULT: "0x2F0b23f53734252Bda2277357e97e1517d6B042A", // Example Maker Vault
    PENDLE_POOL: "0x4f3a120E72C76c22ae802D129F599BFDbc31cb81" // Example Pendle Pool
};

async function fetchUniswapData(userAddress) {
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    const pool = new ethers.Contract(CONTRACT_ADDRESSES.UNISWAP_POOL, UNISWAP_POOL_ABI, provider);
    
    const balance = await pool.balanceOf(userAddress);
    const totalSupply = await pool.totalSupply();
    const reserves = await pool.getReserves();
    
    // Calculate user's share of liquidity
    const userShare = balance * 100 / totalSupply;
    const userValue = (reserves[0] + reserves[1]) * userShare / 100;
    
    return userValue;
}

async function fetchAaveData(userAddress) {
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    const pool = new ethers.Contract(CONTRACT_ADDRESSES.AAVE_POOL, AAVE_POOL_ABI, provider);
    
    const userData = await pool.getUserAccountData(userAddress);
    return userData.totalCollateralBase;
}

async function fetchCurveData(userAddress) {
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    const pool = new ethers.Contract(CONTRACT_ADDRESSES.CURVE_POOL, CURVE_POOL_ABI, provider);
    
    const balance = await pool.balanceOf(userAddress);
    const totalSupply = await pool.totalSupply();
    
    // Calculate user's share of the pool
    const userShare = balance * 100 / totalSupply;
    return userShare;
}

async function fetchMakerData(userAddress) {
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    const vault = new ethers.Contract(CONTRACT_ADDRESSES.MAKER_VAULT, MAKER_VAULT_ABI, provider);
    
    const ink = await vault.ink();
    const art = await vault.art();
    
    return ink - art; // Net position
}

async function fetchPendleData(userAddress) {
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    const pool = new ethers.Contract(CONTRACT_ADDRESSES.PENDLE_POOL, PENDLE_POOL_ABI, provider);
    
    const balance = await pool.balanceOf(userAddress);
    return balance;
}

async function fetchYapsScore(twitterHandle) {
    try {
        const response = await axios.get(`https://api.kaito.ai/api/v1/yaps?username=${twitterHandle}`, {
            headers: {
                'Authorization': `Bearer ${process.env.KAITO_API_KEY}`
            }
        });
        return response.data.score;
    } catch (error) {
        console.error('Error fetching Yaps score:', error);
        return 0;
    }
}

async function generateMetadata(tokenId, userAddress, twitterHandle) {
    const [
        uniswapValue,
        aaveValue,
        curveValue,
        makerValue,
        pendleValue,
        yapsScore
    ] = await Promise.all([
        fetchUniswapData(userAddress),
        fetchAaveData(userAddress),
        fetchCurveData(userAddress),
        fetchMakerData(userAddress),
        fetchPendleData(userAddress),
        fetchYapsScore(twitterHandle)
    ]);

    // Create metadata object
    const metadata = {
        name: `DeFi Performance NFT #${tokenId}`,
        description: "Dynamic DeFi Performance Tracker",
        attributes: [
            { trait_type: "Uniswap Value", value: uniswapValue.toString() },
            { trait_type: "Aave Value", value: aaveValue.toString() },
            { trait_type: "Curve Value", value: curveValue.toString() },
            { trait_type: "MakerDAO Value", value: makerValue.toString() },
            { trait_type: "Pendle Value", value: pendleValue.toString() },
            { trait_type: "YAPS Score", value: yapsScore.toString() }
        ]
    };

    return metadata;
}

module.exports = {
    generateMetadata,
    fetchUniswapData,
    fetchAaveData,
    fetchCurveData,
    fetchMakerData,
    fetchPendleData,
    fetchYapsScore
}; 