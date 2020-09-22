pragma solidity >=0.6.0;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";

/**
 * @title A Presale contract made with ❤️ for the API3 folks.
 * @dev   Enable whitelisted investors to contribute to the API3 presale.
 */
contract API3Presale {
    using SafeMath for uint256;

    uint256 constant ETH_PRICE_BASE            = 1 ether;
    string  constant ERROR_ADDRESS             = "API3 > Invalid address";
    string  constant ERROR_NOT_WHITELISTED     = "API3 > Address not whitelisted";
    string  constant ERROR_ALREADY_WHITELISTED = "API3 > Address already whitelisted";
    string  constant ERROR_GLOBAL_CAP          = "API3 > Global cap reached";
    string  constant ERROR_INDIVIDUAL_CAP      = "API3 > Individual cap reached";
    string  constant ERROR_ERC20_TRANSFER      = "API3 > ERC20 transfer failed"; 
    
    uint256                      public ETH_PRICE;      // in $ per ETH
    uint256                      public TOKEN_PRICE;    // in wei per token
    uint256                      public GLOBAL_CAP;     // in wei
    uint256                      public INDIVIDUAL_CAP; // in wei
    address                      public admin;
    address                      public bank;
    IERC20                       public token;
    uint256                      public raised;
    bool                         public opened;
    mapping (address => bool)    public isWhitelisted;
    mapping (address => uint256) public invested;

    event Whitelist (address indexed investor);
    event Invest    (address indexed investor, uint256 value, uint256 investment, uint256 amount);

    modifier protected() {
        require(msg.sender == admin, "API3 Presale: protected operation");
        _;
    }

    constructor (address _admin, address _bank, address _token, uint256 _ETHPrice) public {
        require(_admin != address(0), ERROR_ADDRESS);
        require(_bank  != address(0), ERROR_ADDRESS);
        require(_token != address(0), ERROR_ADDRESS);

        admin = _admin;
        bank  = _bank;
        token = IERC20(_token);
        _setPrice(_ETHPrice);
    }

    /**
      * @dev             Whitelist an investor.
      * @param _investor The ethereum address to be whitelisted.
      */
    function whitelist(address _investor) public protected {
        require(_investor != address(0),   ERROR_ADDRESS);
        require(!isWhitelisted[_investor], ERROR_ALREADY_WHITELISTED);

        isWhitelisted[_investor] = true;
    }

    /**
      * @dev             Un-whitelist an investor.
      * @param _investor The ethereum address to be un-whitelisted.
      */
    function unwhitelist(address _investor) public protected {
        require(isWhitelisted[_investor], ERROR_NOT_WHITELISTED);

        isWhitelisted[_investor] = false;
    }

    receive() external payable {
        require(isWhitelisted[msg.sender],              ERROR_NOT_WHITELISTED);
        require(raised               <= GLOBAL_CAP,     ERROR_GLOBAL_CAP);
        require(invested[msg.sender] <= INDIVIDUAL_CAP, ERROR_INDIVIDUAL_CAP);

        uint256 investment = invested[msg.sender].add(msg.value) <= INDIVIDUAL_CAP ? msg.value : INDIVIDUAL_CAP.sub(invested[msg.sender]);
        uint256 remains    = msg.value.sub(investment);
        uint256 amount     = _ETHToTokens(investment);
        // update state
        invested[msg.sender] = invested[msg.sender].add(investment);
        raised = raised.add(investment);
        // assess state consistency
        require(raised               <= GLOBAL_CAP,     ERROR_GLOBAL_CAP);
        require(invested[msg.sender] <= INDIVIDUAL_CAP, ERROR_INDIVIDUAL_CAP);
        // transfer token
        require(token.transfer(msg.sender, amount), ERROR_ERC20_TRANSFER);
        // send remaining ETH back if needed
        if (remains > 0) {
            address payable investor = msg.sender;
            investor.transfer(remains);
        }

        emit Invest(msg.sender, msg.value, investment, amount);
     }
    
    function _setPrice(uint256 _ETHPrice) private {
        ETH_PRICE      = _ETHPrice;
        TOKEN_PRICE    = uint256(4).mul(ETH_PRICE_BASE).div(_ETHPrice).div(uint256(10));
        GLOBAL_CAP     = uint256(2000000).mul(ETH_PRICE_BASE).div(_ETHPrice);
        INDIVIDUAL_CAP = uint256(100000).mul(ETH_PRICE_BASE).div(_ETHPrice);

    }

    function _ETHToTokens (uint256 _value) public view returns (uint256) {
        return _value.div(TOKEN_PRICE);
    }
}
