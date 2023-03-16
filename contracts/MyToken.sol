// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MyToken is ERC20 {
    constructor(
        string memory _name,
        string memory _symbol,
        uint256 initSupply
    ) ERC20(_name, _symbol) {
        _mint(msg.sender, initSupply);
    }

    function getCurrentTime() public view returns (uint) {
        return (block.timestamp / 86400) * 86400;
    }
}
