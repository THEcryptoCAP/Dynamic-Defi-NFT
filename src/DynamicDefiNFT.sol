// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract DynamicDeFiNFT is ERC721Enumerable, Ownable {
    using Strings for uint256;

    struct ProtocolData {
        uint256 uniswapValue;
        uint256 aaveValue;
        uint256 curveValue;
        uint256 makerDAOValue;
        uint256 pendleValue;
        uint256 yapsScore;
        uint256 lastUpdated;
    }

    mapping(uint256 => ProtocolData) private tokenPerformanceData;
    mapping(uint256 => string) private tokenTwitterHandles;

    event NFTMinted(address indexed owner, uint256 tokenId);
    event PerformanceUpdated(uint256 indexed tokenId, uint256 timestamp);

    constructor() ERC721("Dynamic DeFi Performance NFT", "DEFI-PERF") {}

    function mint(address _to, string memory _twitterHandle) public returns (uint256) {
        uint256 tokenId = totalSupply() + 1;
        _safeMint(_to, tokenId);
        tokenTwitterHandles[tokenId] = _twitterHandle;
        
        emit NFTMinted(_to, tokenId);
        return tokenId;
    }

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

    function generateSVG(uint256 _tokenId, ProtocolData memory _data) internal view returns (string memory) {
        return string(
            abi.encodePacked(
                '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400">',
                '<rect width="100%" height="100%" fill="#f4f4f4"/>',
                '<text x="50" y="50" font-family="Arial" font-size="16">Token ID: ', _tokenId.toString(), '</text>',
                '<text x="50" y="80" font-family="Arial" font-size="16">Twitter: ', tokenTwitterHandles[_tokenId], '</text>',
                '<text x="50" y="110" font-family="Arial" font-size="16">Uniswap Value: $', _data.uniswapValue.toString(), '</text>',
                '<text x="50" y="140" font-family="Arial" font-size="16">Aave Value: $', _data.aaveValue.toString(), '</text>',
                '<text x="50" y="170" font-family="Arial" font-size="16">Curve Value: $', _data.curveValue.toString(), '</text>',
                '<text x="50" y="200" font-family="Arial" font-size="16">MakerDAO Value: $', _data.makerDAOValue.toString(), '</text>',
                '<text x="50" y="230" font-family="Arial" font-size="16">Pendle Value: $', _data.pendleValue.toString(), '</text>',
                '<text x="50" y="260" font-family="Arial" font-size="16">YAPS Score: ', _data.yapsScore.toString(), '</text>',
                '<text x="50" y="290" font-family="Arial" font-size="12" fill="gray">Last Updated: ', _data.lastUpdated.toString(), '</text>',
                '</svg>'
            )
        );
    }

    function getPerformanceData(uint256 _tokenId) public view returns (ProtocolData memory) {
        require(_exists(_tokenId), "Token does not exist");
        return tokenPerformanceData[_tokenId];
    }

    // Explicitly declare ownerOf function
    function ownerOf(uint256 tokenId) public view override returns (address) {
        return super.ownerOf(tokenId);
    }
}
