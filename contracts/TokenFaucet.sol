// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable2Step.sol";

contract TokenFaucet is Ownable2Step {
    struct AmountRestriction {
        uint256 amountAllowedDate; //token and address daily limit
        uint256 totalAmountAllowedDate; //Total daily limit
    }

    mapping(address => AmountRestriction) amountRestrictionMap;

    mapping(uint256 => mapping(address => mapping(address => uint256))) amountAllowedDate; //token and address Daily number
    mapping(uint256 => mapping(address => uint256)) totalAmountAllowedDate; //Total number of tokens per day

    event RequestToken(address from, address indexed to, uint256 amountAllowed);

    function requestToken(
        address token,
        address to,
        uint amountAllowed
    ) external {
        uint256 currentTime = getCurrentTime();

        require(
            tx.origin == _msgSender(),
            "Contract addresses are not allowed"
        );

        uint checkAmount = amountAllowedDate[currentTime][token][to] +
            amountAllowed;
        require(
            checkAmount <= amountRestrictionMap[token].amountAllowedDate,
            "The daily maximum is exceeded"
        );

        checkAmount =
            totalAmountAllowedDate[currentTime][token] +
            amountAllowed;
        require(
            checkAmount <= amountRestrictionMap[token].totalAmountAllowedDate,
            "Exceed the maximum daily currency limit"
        );

        amountAllowedDate[currentTime][token][to] += amountAllowed;
        totalAmountAllowedDate[currentTime][token] += amountAllowed;

        bool success = IERC20(token).transfer(to, amountAllowed);
        require(success, "TRANSFER FAILED");
        emit RequestToken(token, to, amountAllowed);
    }

    function getAllownAmount(
        address _token
    ) public view returns (AmountRestriction memory) {
        return amountRestrictionMap[_token];
    }

    function setAllownAmount(
        address _token,
        uint256 _amountAllowedDate,
        uint256 _totalAmountAllowedDate
    ) public onlyOwner {
        amountRestrictionMap[_token] = AmountRestriction(
            _amountAllowedDate,
            _totalAmountAllowedDate
        );
    }

    function getCurrentTime() private view returns (uint) {
        return (block.timestamp / 86400) * 86400;
    }
}
