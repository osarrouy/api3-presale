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
    string  constant ERROR_PRICE               = "API3 > Invalid price";
    string  constant ERROR_ARRAY               = "API3 > Invalid array [too long]";
    string  constant ERROR_OPENED              = "API3 > Presale opened";
    string  constant ERROR_NOT_OPENED          = "API3 > Presale not opened yet";
    string  constant ERROR_OVER                = "API3 > Presale over";
    string  constant ERROR_NOT_OVER            = "API3 > Presale not over yet";
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
    address payable              public bank;
    IERC20                       public token;
    bool                         public isOpen;
    bool                         public isClosed;
    uint256                      public raised;
    mapping (address => bool)    public isWhitelisted;
    mapping (address => uint256) public invested;

    event Open        ();
    event Close       ();
    event Whitelist   (address indexed investor);
    event Unwhitelist (address indexed investor);
    event Invest      (address indexed investor, uint256 value, uint256 investment, uint256 amount);

    modifier protected() {
        require(msg.sender == admin, "API3 > Protected operation");
        _;
    }

    modifier isPending() {
        require(!isOpen, ERROR_OPENED);
        _;
    }

    modifier isRunning() {
        require(isOpen,    ERROR_NOT_OPENED);
        require(!isClosed, ERROR_OVER);
        _;
    }

    modifier isOver() {
        require(isClosed, ERROR_NOT_OVER);
        _;
    }

    /**
      * @dev    Deploy and initialize the API3 presale contract.
      * @param _admin The address of the admin allowed to perform protected operations.
      * @param _bank  The address to which received ETH and remaining API3 tokens are gonna be sent once the presale closes.
      * @param _token The address of the API3 token.
      * @param _price The price of ETH [in $ / ETH, eg. $350/ ETH].
      */
    constructor (address _admin, address payable _bank, address _token, uint256 _price) public {
        require(_admin != address(0), ERROR_ADDRESS);
        require(_bank  != address(0), ERROR_ADDRESS);
        require(_token != address(0), ERROR_ADDRESS);
        require(_price != uint256(0), ERROR_PRICE);

        admin = _admin;
        bank  = _bank;
        token = IERC20(_token);
        _setPrice(_price);
    }

    /* 1.  protected operations */

    /* 1.1 protected operations that can be performed any time */

    /**
      * @dev          Update admin address.
      * @param _admin The ethereum address of the new admin.
      */
    function updateAdmin(address _admin)       external protected {
        require(_admin != address(0), ERROR_ADDRESS);
        require(_admin != admin,      ERROR_ADDRESS);

        admin = _admin;
    }

    /**
      * @dev         Update bank address.
      * @param _bank The ethereum address of the new bank.
      */
    function updateBank(address payable _bank) external protected {
        require(_bank != address(0), ERROR_ADDRESS);
        require(_bank != bank,       ERROR_ADDRESS);

        bank = _bank;
    }

    /* 1.2 protected operations that can only be performed before presale opens */

    /**
      * @dev              Whitelist investors.
      * @param _investors An array of investors ethereum addresses to be whitelisted.
      */
    function whitelist(address[] calldata _investors)   external protected isPending {
        require(_investors.length <= 20, ERROR_ARRAY);

        for (uint256 i = 0 ; i < _investors.length ; i++) {
            require(_investors[i] != address(0),   ERROR_ADDRESS);
            require(!isWhitelisted[_investors[i]], ERROR_ALREADY_WHITELISTED);

            isWhitelisted[_investors[i]] = true;
            emit Whitelist(_investors[i]);
        }
    }

    /**
      * @dev              Un-whitelist investors.
      * @param _investors An array of investors ethereum addresses to be un-whitelisted.
      */
    function unwhitelist(address[] calldata _investors) external protected isPending {
        require(_investors.length <= 20, ERROR_ARRAY);

        for (uint256 i = 0 ; i < _investors.length ; i++) {
            require(isWhitelisted[_investors[i]], ERROR_NOT_WHITELISTED);

            isWhitelisted[_investors[i]] = false;
            emit Unwhitelist(_investors[i]);
        }
    }

    function updateETHPrice(uint256 _price)             external protected isPending {
        require(_price != uint256(0), ERROR_PRICE);

        _setPrice(_price);
    }

    /**
      * @dev Open the presale. Open buys and close whitelisting and pricing operations.
      */
    function open()                                     external protected isPending {
      isOpen = true;

      emit Open();
    }
    
    /* 1.3 protected operations that can only be performed while the presale is running */

    /**
      * @dev Close the presale. Close buys and open whithdrawal operations. Withdraw received ETH and remaining API3 tokens.
      */
    function close() external protected isRunning {
      isClosed = true;

      withdraw();
      withdrawETH();

      emit Close();
    }

    /* 1.4 protected operations that can only be performed after the presale closes */

    function withdraw()    public protected isOver {
        require(token.transfer(bank, token.balanceOf(address(this))), ERROR_ERC20_TRANSFER);
    }

    function withdrawETH() public protected isOver {
        bank.transfer(address(this).balance);
    }

    /* payment fallback function */

    receive() external payable isRunning {
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

    /* private helpers functions */

    function _setPrice(uint256 _ETHPrice) private {
        ETH_PRICE      = _ETHPrice;
        TOKEN_PRICE    = uint256(4).mul(ETH_PRICE_BASE).div(_ETHPrice).div(uint256(10));
        GLOBAL_CAP     = uint256(2000000).mul(ETH_PRICE_BASE).div(_ETHPrice);
        INDIVIDUAL_CAP = uint256(100000).mul(ETH_PRICE_BASE).div(_ETHPrice);
    }

    function _ETHToTokens (uint256 _value) private view returns (uint256) {
        return _value.div(TOKEN_PRICE);
    }
}
