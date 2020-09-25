const API3Presale = artifacts.require('API3Presale');

module.exports = async ({ getNamedAccounts, deployments, getChainId }) => {
  const { log, get } = deployments;
  const { deployer } = await getNamedAccounts();

  const presale = await API3Presale.at((await get('API3Presale')).address);
  await presale.whitelist(['0xb71D2D88030A00830C3D45f84C12cc8aAF6857a5'], { from: deployer });

  log('+ Whitelisted 0xb71D2D88030A00830C3D45f84C12cc8aAF6857a5');
};

module.exports.tags = ['whitelist'];