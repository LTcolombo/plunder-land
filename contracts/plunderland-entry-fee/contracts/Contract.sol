// SPDX-License-Identifier: UNLICENSED
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

pragma solidity ^0.8.9;

contract PlunderlandEntryFee {
    uint8 constant FEE_VALUE = 10;
    address constant FT_ADDRESS = 0x198543B8f9b83d2477F1eD897834D6890f98e6f1;

    address owner;
    mapping(address => bool) entryFeePaid;

    constructor() {
        owner = msg.sender;
    }


    function isFeePaid(address _address) view public returns (bool) {
        return entryFeePaid[_address];
    }

    function payFee() payable public {
        require(entryFeePaid[msg.sender] == false, "fee already paid");

        IERC20 loot = IERC20(FT_ADDRESS);
        loot.transfer(owner, FEE_VALUE);

        entryFeePaid[msg.sender] = true;
    }

    function payReward(address beneficiary, uint16 value) payable public {
        require(msg.sender == owner, "should be called by owner");
        require(entryFeePaid[beneficiary] == true, "fee not paid");

        IERC20 loot = IERC20(FT_ADDRESS);
        loot.transfer(beneficiary, value);

        entryFeePaid[beneficiary] = false;
    }

    fallback() external {}
}
