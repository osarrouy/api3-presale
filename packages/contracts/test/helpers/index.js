const API3Presale = artifacts.require('API3Presale');
const ERC20 = artifacts.require('ERC20Mock');
const { BN } = require('@openzeppelin/test-helpers');

const ETH_PRICE = new BN('350');

const setup = async (ctx, [admin, bank]) => {
  ctx.setup = {};
  ctx.data = {};
  ctx.data.balances = [];

  ctx.setup.token = await ERC20.new('API3', 'API3 Token');
  ctx.setup.presale = await API3Presale.new(admin, bank, ctx.setup.token.address, ETH_PRICE);

  await ctx.setup.token.transfer(ctx.setup.presale.address, '10000000000000000000000');
  // await ctx.setup.presale.whitelist(whitelisted);
};

const gasCost = async (tx) => {
  return new BN((await web3.eth.getTransaction(tx.transactionHash)).gasPrice).mul(new BN(tx.gasUsed));
};

module.exports = { setup, gasCost, ETH_PRICE, VALUE_LOW: new BN('2000000000000000000'), RETURN_LOW: new BN('1750') };
