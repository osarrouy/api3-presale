module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log, get } = deployments;
  const { deployer } = await getNamedAccounts();

  const presale = await deploy('API3Presale', {
    contract: 'API3Presale',
    args: ['0xb71d2d88030a00830c3d45f84c12cc8aaf6857a5', '0x8873b045d40A458e46E356a96279aE1820a898bA', (await get('API3Token')).address, 350],
    from: deployer,
  });
  log('+ Deployed API3Presale at ' + presale.address);
};

module.exports.tags = ['presale'];
