// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract DynamicDeFiNFT is ERC721Enumerable, Ownable {
    using Strings for uint256;

    // Structured Data Representation
    struct ProtocolData {
        uint256 uniswapValue;
        uint256 aaveValue;
        uint256 curveValue;
        uint256 makerDAOValue;
        uint256 pendleValue;
        uint256 yapsScore;
        uint256 lastUpdated;
    }

    // Mapping Token ID to Performance Data
    mapping(uint256 => ProtocolData) private tokenPerformanceData;
    mapping(uint256 => string) private tokenTwitterHandles;

    // Events for Transparency
    event NFTMinted(address indexed owner, uint256 tokenId);
    event PerformanceUpdated(uint256 indexed tokenId, uint256 timestamp);

    // Constructor
    constructor() ERC721("Dynamic DeFi Performance NFT", "DEFI-PERF") {}

    /**
     * @dev Mint a new Dynamic DeFi Performance NFT
     * @param _to Recipient address
     * @param _twitterHandle User's Twitter handle for YAPS scoring
     */
    function mint(address _to, string memory _twitterHandle) public returns (uint256) {
        uint256 tokenId = totalSupply() + 1;
        _safeMint(_to, tokenId);
        tokenTwitterHandles[tokenId] = _twitterHandle;
        
        emit NFTMinted(_to, tokenId);
        return tokenId;
    }

    /**
     * @dev Update Performance Metrics for a Specific NFT
     * @notice Only contract owner can update performance data
     */
    function updatePerformanceMetrics(
        uint256 _tokenId,
        uint256 _uniswapValue,
        uint256 _aaveValue,
        uint256 _curveValue,
        uint256 _makerDAOValue,
        uint256 _pendleValue,
        uint256 _yapsScore
    ) public onlyOwner {
        require(_exists(_tokenId), "Token does not exist");

        tokenPerformanceData[_tokenId] = ProtocolData({
            uniswapValue: _uniswapValue,
            aaveValue: _aaveValue,
            curveValue: _curveValue,
            makerDAOValue: _makerDAOValue,
            pendleValue: _pendleValue,
            yapsScore: _yapsScore,
            lastUpdated: block.timestamp
        });

        emit PerformanceUpdated(_tokenId, block.timestamp);
    }

    /**
     * @dev Generate Dynamic SVG Metadata
     * @notice Generates on-chain SVG with real-time performance data
     */
    function tokenURI(uint256 _tokenId) public view override returns (string memory) {
        require(_exists(_tokenId), "Token does not exist");

        ProtocolData memory data = tokenPerformanceData[_tokenId];
        string memory svg = generateSVG(_tokenId, data);

        return string(
            abi.encodePacked(
                'data:application/json;base64,',
                Base64.encode(
                    bytes(
                        string(
                            abi.encodePacked(
                                '{"name":"DeFi Performance NFT #', 
                                _tokenId.toString(),
                                '", "description":"Dynamic DeFi Performance Tracker", ',
                                '"image": "data:image/svg+xml;base64,', 
                                Base64.encode(bytes(svg)),
                                '"}'
                            )
                        )
                    )
                )
            )
        );
    }

    /**
     * @dev Internal SVG Generation
     * @notice Generates visual representation of performance data
     */
    function generateSVG(
        uint256 _tokenId, 
        ProtocolData memory _data
    ) internal view returns (string memory) {
        return string(
            abi.encodePacked(
                '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400">',
                '<rect width="100%" height="100%" fill="#f4f4f4"/>',
                '<text x="50" y="50" font-family="Arial" font-size="16">',
                'Token ID: ', _tokenId.toString(),
                '</text>',
                '<text x="50" y="100" font-family="Arial" font-size="16">',
                'Twitter: ', tokenTwitterHandles[_tokenId],
                '</text>',
                '<text x="50" y="150" font-family="Arial" font-size="16">',
                'UniSwap Value: $', _data.uniswapValue.toString(),
                '</text>',
                // Additional protocol values...
                '</svg>'
            )
        );
    }

    /**
     * @dev Retrieve Performance Data for a Token
     */
    function getPerformanceData(uint256 _tokenId) 
        public 
        view 
        returns (ProtocolData memory) 
    {
        require(_exists(_tokenId), "Token does not exist");
        return tokenPerformanceData[_tokenId];
    }
}