//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./libraries/Ownable.sol";
import "./libraries/ERC721Enumerable.sol";
import "./libraries/ERC721.sol";
import "./libraries/Strings.sol";
import "./libraries/Base64.sol";

contract ThreeDX is Ownable, ERC721, ERC721Enumerable {
    using Strings for *;
    using Base64 for *;

    uint256 private _tokenId = 1;

    mapping(uint256 => string) private _images; //Ipfs address

    mapping(uint256 => uint256) private _royaltys; //_royalty

    constructor() ERC721("ThreeDX", "3DX") ERC721Enumerable() Ownable() {}

    function mint(string calldata image, uint royalty)
        public
        returns (uint256)
    {
        _safeMint(msg.sender, _tokenId);
        _images[_tokenId] = image;
        _royaltys[_tokenId] = royalty;
        _tokenId++;
        return _tokenId;
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override
        returns (string memory)
    {
        string memory image = _images[tokenId];
        if (bytes(image).length == 0) {
            return "";
        }
        uint256 royalty = _royaltys[tokenId];
        if (royalty == 0) {
            return "";
        }
        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name":"3dx #',
                        Strings.toString(tokenId),
                        '","description":"generate by 3dx","image":"ipfs://',
                        image,
                        '", "royalty":',
                        Strings.toString(royalty),
                        ',"model":"xxx"}'
                    )
                )
            )
        );
        string memory output = string(
            abi.encodePacked("data:application/json;base64,", json)
        );
        return output;
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId) internal override(ERC721) {
        super._burn(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
