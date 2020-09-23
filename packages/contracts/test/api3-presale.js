const { expect } = require('chai');
const { BN, balance, constants, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
const API3Presale = artifacts.require('API3Presale');
const helpers = require('./helpers');

contract('API3Presale', ([admin, bank, user1, user2, blacklisted]) => {
  const setup = async () => {
    await helpers.setup(this, [admin, bank]);
  };

  context('# constructor', () => {
    before('!! deploy setup', async () => {
      await setup();
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

  context('# updateAdmin', () => {
    context('» transaction is triggered by admin', () => {
      context('» new admin address is valid', () => {
        before('!! deploy setup', async () => {
          await setup();
        });

        before('!! update admin', async () => {
          this.data.tx = await this.setup.presale.updateAdmin(user1);
        });

        it('it updates the admin', async () => {
          expect(await this.setup.presale.admin()).to.equal(user1);
        });
      });

      context('» new admin address is not valid [null address]', () => {
        before('!! deploy setup', async () => {
          await setup();
        });

        it('it reverts', async () => {
          await expectRevert(this.setup.presale.updateAdmin(constants.ZERO_ADDRESS), 'API3 > Invalid address');
        });
      });

      context('» new admin address is not valid [existing address]', () => {
        before('!! deploy setup', async () => {
          await setup();
        });

        it('it reverts', async () => {
          await expectRevert(this.setup.presale.updateAdmin(admin), 'API3 > Invalid address');
        });
      });
    });

    context('» transaction is not triggered by admin', () => {
      before('!! deploy setup', async () => {
        await setup();
      });

      it('it reverts', async () => {
        await expectRevert(this.setup.presale.updateAdmin(user1, { from: user1 }), 'API3 > Protected operation');
      });
    });
  });

  context('# updateBank', () => {
    context('» transaction is triggered by admin', () => {
      context('» new bank address is valid', () => {
        before('!! deploy setup', async () => {
          await setup();
        });

        before('!! update bank', async () => {
          this.data.tx = await this.setup.presale.updateBank(user1);
        });

        it('it updates the bank', async () => {
          expect(await this.setup.presale.bank()).to.equal(user1);
        });
      });

      context('» new bank address is not valid [null address]', () => {
        before('!! deploy setup', async () => {
          await setup();
        });

        it('it reverts', async () => {
          await expectRevert(this.setup.presale.updateBank(constants.ZERO_ADDRESS), 'API3 > Invalid address');
        });
      });

      context('» new bank address is not valid [existing address]', () => {
        before('!! deploy setup', async () => {
          await setup();
        });

        it('it reverts', async () => {
          await expectRevert(this.setup.presale.updateBank(bank), 'API3 > Invalid address');
        });
      });
    });

    context('» transaction is not triggered by admin', () => {
      before('!! deploy setup', async () => {
        await setup();
      });

      it('it reverts', async () => {
        await expectRevert(this.setup.presale.updateBank(user1, { from: user1 }), 'API3 > Protected operation');
      });
    });
  });

  context('# whitelist', () => {
    context('» transaction is triggered by admin', () => {
      context('» presale is not opened yet', () => {
        context('» investors addresses are valid', () => {
          context('» investors addresses are not already whitelisted', () => {
            before('!! deploy setup', async () => {
              await setup();
            });

            before('!! whitelist investors', async () => {
              this.data.tx = await this.setup.presale.whitelist([user1, user2]);
            });

            it('it emits Whitelist events', async () => {
              await expectEvent(this.data.tx, 'Whitelist', { investor: user1 });
              await expectEvent(this.data.tx, 'Whitelist', { investor: user2 });
            });

            it('it whitelists investors', async () => {
              expect(await this.setup.presale.isWhitelisted(user1)).to.equal(true);
              expect(await this.setup.presale.isWhitelisted(user2)).to.equal(true);
            });
          });

          context('» investors addresses are already whitelisted', () => {
            before('!! deploy setup', async () => {
              await setup();
            });

            before('!! whitelist investors', async () => {
              await this.setup.presale.whitelist([user2]);
            });

            it('it reverts', async () => {
              await expectRevert(this.setup.presale.whitelist([user1, user2]), 'API3 > Address already whitelisted');
            });
          });
        });

        context('» investors addresses are not valid', () => {
          before('!! deploy setup', async () => {
            await setup();
          });

          it('it reverts', async () => {
            await expectRevert(this.setup.presale.whitelist([constants.ZERO_ADDRESS, user2]), 'API3 > Invalid address');
          });
        });
      });

      context('» presale is opened', () => {
        before('!! deploy setup', async () => {
          await setup();
        });

        before('!! open presale', async () => {
          await this.setup.presale.open();
        });

        it('it reverts', async () => {
          await expectRevert(this.setup.presale.whitelist([user1, user2]), 'API3 > Presale opened');
        });
      });
    });

    context('» transaction is not triggered by admin', () => {
      before('!! deploy setup', async () => {
        await setup();
      });

      it('it reverts', async () => {
        await expectRevert(this.setup.presale.whitelist([user1, user2], { from: user1 }), 'API3 > Protected operation');
      });
    });
  });

  context('# unwhitelist', () => {
    context('» transaction is triggered by admin', () => {
      context('» presale is not opened yet', () => {
        context('» investors addresses are whitelisted', () => {
          before('!! deploy setup', async () => {
            await setup();
          });

          before('!! whitelist investors', async () => {
            await this.setup.presale.whitelist([user1, user2]);
          });

          before('!! unwhitelist investors', async () => {
            this.data.tx = await this.setup.presale.unwhitelist([user1, user2]);
          });

          it('it emits Unwhitelist events', async () => {
            await expectEvent(this.data.tx, 'Unwhitelist', { investor: user1 });
            await expectEvent(this.data.tx, 'Unwhitelist', { investor: user2 });
          });

          it('it unwhitelists investors', async () => {
            expect(await this.setup.presale.isWhitelisted(user1)).to.equal(false);
            expect(await this.setup.presale.isWhitelisted(user2)).to.equal(false);
          });
        });

        context('» investors addresses are not whitelisted', () => {
          before('!! deploy setup', async () => {
            await setup();
          });

          before('!! whitelist investors', async () => {
            await this.setup.presale.whitelist([user2]);
          });

          it('it reverts', async () => {
            await expectRevert(this.setup.presale.unwhitelist([user1, user2]), 'API3 > Address not whitelisted');
          });
        });
      });

      context('» presale is opened', () => {
        before('!! deploy setup', async () => {
          await setup();
        });

        before('!! whitelist investors', async () => {
          await this.setup.presale.whitelist([user1, user2]);
        });

        before('!! open presale', async () => {
          await this.setup.presale.open();
        });

        it('it reverts', async () => {
          await expectRevert(this.setup.presale.unwhitelist([user1, user2]), 'API3 > Presale opened');
        });
      });
    });

    context('» transaction is not triggered by admin', () => {
      before('!! deploy setup', async () => {
        await setup();
      });

      before('!! whitelist investors', async () => {
        await this.setup.presale.whitelist([user1, user2]);
      });

      it('it reverts', async () => {
        await expectRevert(this.setup.presale.unwhitelist([user1, user2], { from: user1 }), 'API3 > Protected operation');
      });
    });
  });

  context.only('# open', () => {
    context('» transaction is triggered by admin', () => {
      context('» presale is not opened yet', () => {
        before('!! deploy setup', async () => {
          await setup();
        });

        before('!! open presale', async () => {
          this.data.tx = await this.setup.presale.open();
        });

        it('it emits an Open event', async () => {
          await expectEvent(this.data.tx, 'Open');
        });

        it('it opens presale', async () => {
          expect(await this.setup.presale.isOpen()).to.equal(true);
        });
      });

      context('» presale is already opened', () => {
        before('!! deploy setup', async () => {
          await setup();
        });

        before('!! open presale', async () => {
          await this.setup.presale.open();
        });

        it('it reverts', async () => {
          await expectRevert(this.setup.presale.open(), 'API3 > Presale opened');
        });
      });
    });

    context('» transaction is not triggered by admin', () => {
      before('!! deploy setup', async () => {
        await setup();
      });

      it('it reverts', async () => {
        await expectRevert(this.setup.presale.open({ from: user1 }), 'API3 > Protected operation');
      });
    });
  });

  context.only('# close', () => {
    context('» transaction is triggered by admin', () => {
      context('» presale is opened', () => {
        context('» presale is not closed yet', () => {
          before('!! deploy setup', async () => {
            await setup();
          });

          before('!! whitelist investor', async () => {
            await this.setup.presale.whitelist([user1]);
          });

          before('!! open presale', async () => {
            await this.setup.presale.open();
          });

          before('!! setup balances', async () => {
            await web3.eth.sendTransaction({ from: user1, to: this.setup.presale.address, value: helpers.VALUE_LOW });
            this.data.balances[0] = await balance.current(bank);
            this.data.balances[1] = await balance.current(this.setup.presale.address);
            this.data.balances[2] = await this.setup.token.balanceOf(bank);
            this.data.balances[3] = await this.setup.token.balanceOf(this.setup.presale.address);
          });

          before('!! close presale', async () => {
            this.data.tx = await this.setup.presale.close();
          });

          it('it emits an Close event', async () => {
            await expectEvent(this.data.tx, 'Close');
          });

          it('it closes the presale', async () => {
            expect(await this.setup.presale.isClosed()).to.equal(true);
          });

          it('it withdraws ETH', async () => {
            expect(await balance.current(bank)).to.be.bignumber.equal(this.data.balances[0].add(this.data.balances[1]));
            expect(await balance.current(this.setup.presale.address)).to.be.bignumber.equal(new BN('0'));
          });

          it('it withdraws API3 token', async () => {
            expect(await this.setup.token.balanceOf(bank)).to.be.bignumber.equal(this.data.balances[2].add(this.data.balances[3]));
            expect(await this.setup.token.balanceOf(this.setup.presale.address)).to.be.bignumber.equal(new BN('0'));
          });
        });

        context('» presale is already closed', () => {
          before('!! deploy setup', async () => {
            await setup();
          });

          before('!! open presale', async () => {
            await this.setup.presale.open();
          });

          before('!! close presale', async () => {
            await this.setup.presale.close();
          });

          it('it reverts', async () => {
            await expectRevert(this.setup.presale.close(), 'API3 > Presale over');
          });
        });
      });

      context('» presale is not opened yet', () => {
        before('!! deploy setup', async () => {
          await setup();
        });

        it('it reverts', async () => {
          await expectRevert(this.setup.presale.close(), 'API3 > Presale not opened yet');
        });
      });
    });

    context('» transaction is not triggered by admin', () => {
      before('!! deploy setup', async () => {
        await setup();
      });

      before('!! open presale', async () => {
        await this.setup.presale.open();
      });

      it('it reverts', async () => {
        await expectRevert(this.setup.presale.close({ from: user1 }), 'API3 > Protected operation');
      });
    });
  });

  context('# receive', () => {
    before('!! deploy setup', async () => {
      await setup();
      await this.setup.presale.open();
      this.data.balances[0] = await balance.current(user1);
      this.data.balances[1] = await balance.current(this.setup.presale.address);
      this.data.balances[2] = await this.setup.token.balanceOf(user1);
      this.data.balances[3] = await this.setup.token.balanceOf(this.setup.presale.address);
      this.data.tx = await web3.eth.sendTransaction({ from: user1, to: this.setup.presale.address, value: helpers.VALUE_LOW });
    });

    context('» its fine', () => {
      it('it emits an Invest event', async () => {
        await expectEvent.inTransaction(this.data.tx.transactionHash, this.setup.presale, 'Invest', {
          investor: user1,
          value: helpers.VALUE_LOW,
          investment: helpers.VALUE_LOW,
          amount: helpers.RETURN_LOW,
        });
      });

      it('it collects ETH and transfers tokens', async () => {
        expect(await balance.current(user1)).to.be.bignumber.equal(this.data.balances[0].sub(helpers.VALUE_LOW).sub(await helpers.gasCost(this.data.tx)));
        expect(await balance.current(this.setup.presale.address)).to.be.bignumber.equal(this.data.balances[1].add(helpers.VALUE_LOW));
        expect(await this.setup.token.balanceOf(user1)).to.be.bignumber.equal(this.data.balances[2].add(helpers.RETURN_LOW));
        expect(await this.setup.token.balanceOf(this.setup.presale.address)).to.be.bignumber.equal(this.data.balances[3].sub(helpers.RETURN_LOW));
      });
    });
  });
});
