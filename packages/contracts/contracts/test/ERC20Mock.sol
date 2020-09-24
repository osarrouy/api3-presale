pragma solidity >=0.6.0;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";


contract ERC20Mock is ERC20 {
    constructor(string memory name, string memory symbol) ERC20(name, symbol) public override {
        _mint(msg.sender, uint256(10000000000000000000000000));
    }
}