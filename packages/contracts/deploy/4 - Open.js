const API3Presale = artifacts.require('API3Presale');

module.exports = async ({ getNamedAccounts, deployments, getChainId }) => {
  const { log, get } = deployments;
  const { deployer } = await getNamedAccounts();

  const presale = await API3Presale.at((await get('API3Presale')).address);
  await presale.open({ from: deployer });

  log('+ Opened presale');
};

module.exports.tags = ['open'];