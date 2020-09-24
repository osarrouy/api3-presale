const API3Presale = artifacts.require('API3Presale');
const ERC20 = artifacts.require('ERC20Mock');
const { BN, ether } = require('@openzeppelin/test-helpers');

const ETH_PRICE = new BN('350');
const INDIVIDUAL_CAP_WEI = new BN('285714285714285714285'); // $100,000
const setup = async (ctx, [admin, bank]) => {
  ctx.setup = {};
  ctx.data = {};
  ctx.data.balances = [];

  ctx.setup.token = await ERC20.new('API3', 'API3 Token');
  ctx.setup.presale = await API3Presale.new(admin, bank, ctx.setup.token.address, ETH_PRICE);

  await ctx.setup.token.transfer(ctx.setup.presale.address, ether(new BN('5000000')));
  // await ctx.setup.presale.whitelist(whitelisted);
};

const gasCost = async (tx) => {
  return new BN((await web3.eth.getTransaction(tx.transactionHash)).gasPrice).mul(new BN(tx.gasUsed));
};

module.exports = {
  setup,
  gasCost,
  ETH_PRICE,
  INDIVIDUAL_CAP_WEI,
  VALUE_LOW: ether(new BN('2')) /* $700 */,
  RETURN_LOW: ether(new BN('1750')),
  VALUE_HIGH: ether(new BN('200')) /* $70,000 */,
  INVESTMENT_HIGH: new BN('85714285714285714285') /* $30,000 */,
  RETURN_HIGH: new BN('74999999999999999999375') /* 75,000 API3 modulo soldity rounding issue */,
};
