const { expect } = require('chai');
const { BN, balance, constants, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
const API3Presale = artifacts.require('API3Presale');
const helpers = require('./helpers');

contract('API3Presale', ([admin, bank, whitelisted, blacklisted, generic]) => {
  context('# constructor', () => {
    before('!! deploy setup', async () => {
      await helpers.setup(this, [admin, bank, whitelisted]);
      // console.log((await this.setup.presale.ETHPrice()).toString())
      // console.log((await this.setup.presale.GLOBAL_CAP()).toString())
      // console.log((await this.setup.presale.INDIVIDUAL_CAP()).toString())
    });

    context('» parameters are valid', () => {
      it('it deploys and initializes contract', async () => {
        expect(await this.setup.presale.admin()).to.equal(admin);
        expect(await this.setup.presale.bank()).to.equal(bank);
        expect(await this.setup.presale.token()).to.equal(this.setup.token.address);
      });
    });

    context('» parameters are not valid', () => {
      context('» admin parameter is not valid', () => {
        it('it reverts', async () => {
          await expectRevert(API3Presale.new(constants.ZERO_ADDRESS, bank, this.setup.token.address, helpers.ETH_PRICE), 'API3 > Invalid address');
        });
      });

      context('» bank parameter is not valid', () => {
        it('it reverts', async () => {
          await expectRevert(API3Presale.new(bank, constants.ZERO_ADDRESS, this.setup.token.address, helpers.ETH_PRICE), 'API3 > Invalid address');
        });
      });

      context('» token parameter is not valid', () => {
        it('it reverts', async () => {
          await expectRevert(API3Presale.new(admin, bank, constants.ZERO_ADDRESS, helpers.ETH_PRICE), 'API3 > Invalid address');
        });
      });
    });
  });

  context('# receive', () => {
    before('!! deploy setup', async () => {
      await helpers.setup(this, [admin, bank, whitelisted]);
      this.data.balances[0] = await balance.current(whitelisted);
      this.data.balances[1] = await balance.current(this.setup.presale.address);
      this.data.balances[2] = await this.setup.token.balanceOf(whitelisted);
      this.data.balances[3] = await this.setup.token.balanceOf(this.setup.presale.address);
      this.data.tx = await web3.eth.sendTransaction({ from: whitelisted, to: this.setup.presale.address, value: helpers.VALUE_LOW });
    });

    context('» its fine', () => {
      it('it emits an Invest event', async () => {
        await expectEvent.inTransaction(this.data.tx.transactionHash, this.setup.presale, 'Invest', {
          investor: whitelisted,
          value: helpers.VALUE_LOW,
          investment: helpers.VALUE_LOW,
          amount: helpers.RETURN_LOW,
        });
      });

      it('it collects ETH and transfers tokens', async () => {
        expect(await balance.current(whitelisted)).to.be.bignumber.equal(this.data.balances[0].sub(helpers.VALUE_LOW).sub(await helpers.gasCost(this.data.tx)));
        expect(await balance.current(this.setup.presale.address)).to.be.bignumber.equal(this.data.balances[1].add(helpers.VALUE_LOW));
        expect(await this.setup.token.balanceOf(whitelisted)).to.be.bignumber.equal(this.data.balances[2].add(helpers.RETURN_LOW));
        expect(await this.setup.token.balanceOf(this.setup.presale.address)).to.be.bignumber.equal(this.data.balances[3].sub(helpers.RETURN_LOW));
      });
    });
  });

  // context('# swap', () => {
  //   context('» generics', () => {
  //     before('!! deploy setup', async () => {
  //       setup = await deploy(accounts);
  //     });

  //     context('» proxy is not initialized', () => {
  //       before('!! deploy proxy', async () => {
  //         setup.data.proxy = await UniswapProxy.new();
  //       });

  //       it('it reverts', async () => {
  //         await expectRevert(
  //           setup.data.proxy.swap(setup.tokens.erc20s[0].address, setup.tokens.erc20s[1].address, helpers.values.swap.AMOUNT, helpers.values.swap.EXPECTED),
  //           'UniswapProxy: not initialized'
  //         );
  //       });
  //     });

  //     context('» swap is not triggered by avatar', () => {
  //       before('!! deploy and initialize proxy', async () => {
  //         setup.data.proxy = await UniswapProxy.new();
  //         await setup.data.proxy.initialize(setup.organization.avatar.address, setup.uniswap.router.address);
  //       });

  //       it('it reverts', async () => {
  //         await expectRevert(
  //           setup.data.proxy.swap(setup.tokens.erc20s[0].address, setup.tokens.erc20s[1].address, helpers.values.swap.AMOUNT, helpers.values.swap.EXPECTED),
  //           'UniswapProxy: protected operation'
  //         );
  //       });
  //     });

  //     context('» token pair is invalid', () => {
  //       before('!! deploy and initialize proxy', async () => {
  //         setup.data.proxy = await UniswapProxy.new();
  //         await setup.data.proxy.initialize(accounts[0], setup.uniswap.router.address);
  //       });

  //       it('it reverts', async () => {
  //         await expectRevert(
  //           setup.data.proxy.swap(setup.tokens.erc20s[0].address, setup.tokens.erc20s[0].address, helpers.values.swap.AMOUNT, helpers.values.swap.EXPECTED),
  //           'UniswapProxy: invalid pair'
  //         );
  //       });
  //     });

  //     context('» swap amount is invalid', () => {
  //       before('!! deploy and initialize proxy', async () => {
  //         setup.data.proxy = await UniswapProxy.new();
  //         await setup.data.proxy.initialize(accounts[0], setup.uniswap.router.address);
  //       });

  //       it('it reverts', async () => {
  //         await expectRevert(
  //           setup.data.proxy.swap(setup.tokens.erc20s[0].address, setup.tokens.erc20s[1].address, 0, helpers.values.swap.EXPECTED),
  //           'UniswapProxy: invalid amount'
  //         );
  //       });
  //     });
  //   });

  //   context('» ERC20 to ERC20', () => {
  //     before('!! deploy setup', async () => {
  //       setup = await deploy(accounts);
  //     });

  //     context('» swap succeeds', () => {
  //       before('!! execute swap', async () => {
  //         // store balances
  //         setup.data.balances[0] = await setup.tokens.erc20s[0].balanceOf(setup.organization.avatar.address);
  //         setup.data.balances[1] = await setup.tokens.erc20s[1].balanceOf(setup.organization.avatar.address);
  //         // execute swap
  //         const calldata = helpers.encodeSwap(
  //           setup.tokens.erc20s[0].address,
  //           setup.tokens.erc20s[1].address,
  //           helpers.values.swap.AMOUNT,
  //           helpers.values.swap.EXPECTED
  //         );
  //         const _tx = await setup.scheme.proposeCall(calldata, 0, constants.ZERO_BYTES32);
  //         const proposalId = helpers.getNewProposalId(_tx);
  //         const tx = await setup.scheme.voting.absoluteVote.vote(proposalId, 1, 0, constants.ZERO_ADDRESS);
  //         const proposal = await setup.scheme.organizationProposals(proposalId);
  //         // store data
  //         setup.data.tx = tx;
  //         setup.data.proposal = proposal;
  //       });

  //       it('it emits a Swap event', async () => {
  //         await expectEvent.inTransaction(setup.data.tx.tx, setup.proxy, 'Swap', {
  //           from: setup.tokens.erc20s[0].address,
  //           to: setup.tokens.erc20s[1].address,
  //           amount: helpers.values.swap.AMOUNT,
  //           expected: helpers.values.swap.EXPECTED,
  //           returned: helpers.values.swap.RETURNED,
  //         });
  //       });

  //       it('it swaps tokens', async () => {
  //         expect(await setup.tokens.erc20s[0].balanceOf(setup.organization.avatar.address)).to.be.bignumber.equal(
  //           setup.data.balances[0].sub(helpers.values.swap.AMOUNT)
  //         );
  //         expect(await setup.tokens.erc20s[1].balanceOf(setup.organization.avatar.address)).to.be.bignumber.equal(
  //           setup.data.balances[1].add(helpers.values.swap.RETURNED)
  //         );
  //       });
  //     });

  //     context('» swap fails [return is less than expected]', () => {
  //       before('!! execute swap', async () => {
  //         // store balances
  //         setup.data.balances[0] = await setup.tokens.erc20s[0].balanceOf(setup.organization.avatar.address);
  //         setup.data.balances[1] = await setup.tokens.erc20s[1].balanceOf(setup.organization.avatar.address);
  //         // execute failing swap
  //         const calldata = helpers.encodeSwap(
  //           setup.tokens.erc20s[0].address,
  //           setup.tokens.erc20s[1].address,
  //           helpers.values.swap.AMOUNT,
  //           helpers.values.swap.AMOUNT
  //         );
  //         const _tx = await setup.scheme.proposeCall(calldata, 0, constants.ZERO_BYTES32);
  //         const proposalId = helpers.getNewProposalId(_tx);
  //         const tx = await setup.scheme.voting.absoluteVote.vote(proposalId, 1, 0, constants.ZERO_ADDRESS);
  //         const proposal = await setup.scheme.organizationProposals(proposalId);
  //         // store data
  //         setup.data.tx = tx;
  //         setup.data.proposal = proposal;
  //       });

  //       it('it keeps proposal live', async () => {
  //         expect(setup.data.proposal.exist).to.equal(true);
  //       });

  //       it('it emits no Swap event', async () => {
  //         await expectEvent.notEmitted.inTransaction(setup.data.tx.tx, setup.proxy, 'Swap');
  //       });

  //       it('it maintains balances', async () => {
  //         expect(await setup.tokens.erc20s[0].balanceOf(setup.organization.avatar.address)).to.be.bignumber.equal(setup.data.balances[0]);
  //         expect(await setup.tokens.erc20s[1].balanceOf(setup.organization.avatar.address)).to.be.bignumber.equal(setup.data.balances[1]);
  //       });
  //     });
  //   });

  //   context('» ETH to ERC20', () => {
  //     before('!! deploy setup', async () => {
  //       setup = await deploy(accounts);
  //     });

  //     context('» swap succeeds', () => {
  //       before('!! execute swap', async () => {
  //         // store balances
  //         setup.data.balances[0] = await balance.current(setup.organization.avatar.address);
  //         setup.data.balances[1] = await setup.tokens.erc20s[0].balanceOf(setup.organization.avatar.address);
  //         // execute swap
  //         const calldata = helpers.encodeSwap(constants.ZERO_ADDRESS, setup.tokens.erc20s[0].address, helpers.values.swap.AMOUNT, helpers.values.swap.EXPECTED);
  //         const _tx = await setup.scheme.proposeCall(calldata, 0, constants.ZERO_BYTES32);
  //         const proposalId = helpers.getNewProposalId(_tx);
  //         const tx = await setup.scheme.voting.absoluteVote.vote(proposalId, 1, 0, constants.ZERO_ADDRESS);
  //         const proposal = await setup.scheme.organizationProposals(proposalId);
  //         // store data
  //         setup.data.tx = tx;
  //         setup.data.proposal = proposal;
  //       });

  //       it('it emits a Swap event', async () => {
  //         await expectEvent.inTransaction(setup.data.tx.tx, setup.proxy, 'Swap', {
  //           from: constants.ZERO_ADDRESS,
  //           to: setup.tokens.erc20s[0].address,
  //           amount: helpers.values.swap.AMOUNT,
  //           expected: helpers.values.swap.EXPECTED,
  //           returned: helpers.values.swap.RETURNED,
  //         });
  //       });

  //       it('it swaps tokens', async () => {
  //         expect(await balance.current(setup.organization.avatar.address)).to.be.bignumber.equal(setup.data.balances[0].sub(helpers.values.swap.AMOUNT));
  //         expect(await setup.tokens.erc20s[0].balanceOf(setup.organization.avatar.address)).to.be.bignumber.equal(
  //           setup.data.balances[1].add(helpers.values.swap.RETURNED)
  //         );
  //       });
  //     });

  //     context('» swap fails [return is less than expected]', () => {
  //       before('!! execute swap', async () => {
  //         // store balances
  //         setup.data.balances[0] = new BN(await web3.eth.getBalance(setup.organization.avatar.address));
  //         setup.data.balances[1] = await setup.tokens.erc20s[0].balanceOf(setup.organization.avatar.address);
  //         // execute failing swap
  //         const calldata = helpers.encodeSwap(constants.ZERO_ADDRESS, setup.tokens.erc20s[0].address, helpers.values.swap.AMOUNT, helpers.values.swap.AMOUNT);
  //         const _tx = await setup.scheme.proposeCall(calldata, 0, constants.ZERO_BYTES32);
  //         const proposalId = helpers.getNewProposalId(_tx);
  //         const tx = await setup.scheme.voting.absoluteVote.vote(proposalId, 1, 0, constants.ZERO_ADDRESS);
  //         const proposal = await setup.scheme.organizationProposals(proposalId);
  //         // store data
  //         setup.data.tx = tx;
  //         setup.data.proposal = proposal;
  //       });

  //       it('it keeps proposal live', async () => {
  //         expect(setup.data.proposal.exist).to.equal(true);
  //       });

  //       it('it emits no Swap event', async () => {
  //         await expectEvent.notEmitted.inTransaction(setup.data.tx.tx, setup.proxy, 'Swap');
  //       });

  //       it('it maintains balances', async () => {
  //         expect(await balance.current(setup.organization.avatar.address)).to.be.bignumber.equal(setup.data.balances[0]);
  //         expect(await setup.tokens.erc20s[0].balanceOf(setup.organization.avatar.address)).to.be.bignumber.equal(setup.data.balances[1]);
  //       });
  //     });
  //   });

  //   context('» ERC20 to ETH', () => {
  //     before('!! deploy setup', async () => {
  //       setup = await deploy(accounts);
  //     });

  //     context('» swap succeeds', () => {
  //       before('!! execute swap', async () => {
  //         // store balances
  //         setup.data.balances[0] = await setup.tokens.erc20s[0].balanceOf(setup.organization.avatar.address);
  //         setup.data.balances[1] = await balance.current(setup.organization.avatar.address);
  //         // execute swap
  //         const calldata = helpers.encodeSwap(setup.tokens.erc20s[0].address, constants.ZERO_ADDRESS, helpers.values.swap.AMOUNT, helpers.values.swap.EXPECTED);
  //         const _tx = await setup.scheme.proposeCall(calldata, 0, constants.ZERO_BYTES32);
  //         const proposalId = helpers.getNewProposalId(_tx);
  //         const tx = await setup.scheme.voting.absoluteVote.vote(proposalId, 1, 0, constants.ZERO_ADDRESS);
  //         const proposal = await setup.scheme.organizationProposals(proposalId);
  //         // store data
  //         setup.data.tx = tx;
  //         setup.data.proposal = proposal;
  //       });

  //       it('it emits a Swap event', async () => {
  //         await expectEvent.inTransaction(setup.data.tx.tx, setup.proxy, 'Swap', {
  //           from: setup.tokens.erc20s[0].address,
  //           to: constants.ZERO_ADDRESS,
  //           amount: helpers.values.swap.AMOUNT,
  //           expected: helpers.values.swap.EXPECTED,
  //           returned: helpers.values.swap.RETURNED,
  //         });
  //       });

  //       it('it swaps tokens', async () => {
  //         expect(await setup.tokens.erc20s[0].balanceOf(setup.organization.avatar.address)).to.be.bignumber.equal(
  //           setup.data.balances[0].sub(helpers.values.swap.AMOUNT)
  //         );
  //         expect(await balance.current(setup.organization.avatar.address)).to.be.bignumber.equal(setup.data.balances[1].add(helpers.values.swap.RETURNED));
  //       });
  //     });

  //     context('» swap fails [return is less than expected]', () => {
  //       before('!! execute swap', async () => {
  //         // store balances
  //         setup.data.balances[0] = await setup.tokens.erc20s[0].balanceOf(setup.organization.avatar.address);
  //         setup.data.balances[1] = await balance.current(setup.organization.avatar.address);
  //         // execute swap
  //         const calldata = helpers.encodeSwap(setup.tokens.erc20s[0].address, constants.ZERO_ADDRESS, helpers.values.swap.AMOUNT, helpers.values.swap.AMOUNT);
  //         const _tx = await setup.scheme.proposeCall(calldata, 0, constants.ZERO_BYTES32);
  //         const proposalId = helpers.getNewProposalId(_tx);
  //         const tx = await setup.scheme.voting.absoluteVote.vote(proposalId, 1, 0, constants.ZERO_ADDRESS);
  //         const proposal = await setup.scheme.organizationProposals(proposalId);
  //         // store data
  //         setup.data.tx = tx;
  //         setup.data.proposal = proposal;
  //       });

  //       it('it keeps proposal live', async () => {
  //         expect(setup.data.proposal.exist).to.equal(true);
  //       });

  //       it('it emits no Swap event', async () => {
  //         await expectEvent.notEmitted.inTransaction(setup.data.tx.tx, setup.proxy, 'Swap');
  //       });

  //       it('it maintains balances', async () => {
  //         expect(await setup.tokens.erc20s[0].balanceOf(setup.organization.avatar.address)).to.be.bignumber.equal(setup.data.balances[0]);
  //         expect(await balance.current(setup.organization.avatar.address)).to.be.bignumber.equal(setup.data.balances[1]);
  //       });
  //     });
  //   });
  // });
});
