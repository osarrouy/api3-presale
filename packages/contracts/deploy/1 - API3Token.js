module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  const token = await deploy('API3Token', {
    contract: 'ERC20Mock',
    args: ['API3', 'API3 Token'],
    from: deployer,
  });
  log('+ Deployed API3 token at ' + token.address);
};

module.exports.tags = ['token'];
