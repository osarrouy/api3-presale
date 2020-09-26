<script>
  import { onMount } from "svelte";
  import Button from "../components/Button.svelte";
  import { NotificationDisplay, notifier } from "../components/Notification";
  import {
    CHAIN_ID,
    CHAIN_NAME,
    TOKEN_ADDRESS,
    PRESALE_ADDRESS,
    ERRORS
  } from "../lib/";
  import ERC20 from "../lib/ERC20";
  import API3Presale from "../lib/API3Presale";

  let ethers;
  let chain, account, _account, balance, error;
  let provider, signer;
  let token, presale;
  let value = 0,
    loading = false;
  let metamask = "pending",
    connected = false,
    whitelisted = false;

  // chain id notification
  $: {
    if (chain && chain !== CHAIN_ID) {
      notifier.danger(ERRORS.CHAIN);
    }
  }

  // connection state derivation
  $: {
    if (chain === CHAIN_ID) {
      provider = new ethers.providers.Web3Provider(ethereum);
      signer = provider.getSigner();
      token = new ethers.Contract(TOKEN_ADDRESS, ERC20, signer);
      presale = new ethers.Contract(PRESALE_ADDRESS, API3Presale, provider);
      _isWhitelisted(account)
        .then(_whitelisted => {
          if (_whitelisted) {
            whitelisted = true;
            connected = true;
          } else {
            whitelisted = false;
            connected = false;
            notifier.danger(ERRORS.WHITELISTED);
          }
        })
        .catch(e => {
          connected = false;
          notifier.danger(e.message);
        });
    } else {
      connected = false;
    }
  }

  // shorten account derivation
  $: {
    if (account) {
      _account = account.slice(0, 8) + "...";
    }
  }

  // token balance derivation
  $: {
    if (token && connected) {
      token
        .balanceOf(account)
        .then(_balance => (balance = ethers.utils.formatUnits(_balance)))
        .catch(e => {
          notifier.danger(e.message);
        });
    }
  }

  onMount(async () => {
    ethers = (await import("ethers")).default.ethers;
  });

  const _isWhitelisted = async _account => {
    return presale.isWhitelisted(_account);
  };

  const _update = async () => {
    balance = ethers.utils.commify(
      ethers.utils.formatUnits(await token.balanceOf(account))
    );
  };

  const connect = async () => {
    loading = true;
    if (typeof ethereum !== "undefined" && ethereum.isMetaMask) {
      // initialize account and network
      account = (await ethereum.request({ method: "eth_requestAccounts" }))[0];
      chain = ethereum.chainId;
      // initialize provider and signer
      provider = new ethers.providers.Web3Provider(ethereum);
      signer = provider.getSigner();
      // initialize contracts abstractions
      token = new ethers.Contract(TOKEN_ADDRESS, ERC20, signer);
      presale = new ethers.Contract(PRESALE_ADDRESS, API3Presale, provider);
      // listen to metamask events
      ethereum.on("accountsChanged", accounts => {
        account = accounts[0];
      });
      ethereum.on("chainChanged", chainId => {
        chain = chainId;
      });
      // update state
      metamask = true;
    } else {
      metamask = false;
      notifier.danger(ERRORS.NO_METAMASK);
    }
    loading = false;
  };

  const buy = async () => {
    if (!value || value <= 0) {
      error = "Please provide a positive ETH amount.";
    } else {
      error = null;
      loading = true;
      try {
        const tx = await signer.sendTransaction({
          to: PRESALE_ADDRESS,
          value: ethers.utils.parseEther(value.toString())
        });
        console.log(tx);
        value = 0;
        notifier.info("Transaction being minted through tx " + tx.hash);
        await tx.wait();
        notifier.success("Transaction minted");
        setTimeout(await _update(), 3000);
      } catch (e) {
        notifier.danger(e.message);
      }
      loading = false;
    }
  };

  const copy = async () => {
    try {
      navigator.clipboard.writeText(PRESALE_ADDRESS);
      notifier.success("Address copied to clipboard.");
    } catch (e) {
      notifier.danger(e.message);
    }
  };
</script>

<style lang="scss">
  section {
    text-align: center;
    margin: 2 * $GU 0;
    width: 100%;

    h2 {
      border-bottom: 1px solid $primary;
      text-align: left;
      margin: $GU 0 2 * $GU 0;
      padding-bottom: $GU;
    }

    p {
      text-align: left;
    }

    &.welcome {
      p {
        text-align: center;
      }
    }

    &.error {
      min-height: 2.5rem;
      p {
        color: $error;
        font-size: 0.9em;
        text-align: center;
      }
    }

    div.dashboard {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
    }

    div.form {
      display: flex;
      align-items: center;
      justify-content: space-between;
      input[type="number"] {
        display: block;
        background: transparentize($primary, 0.8);
        border: none;
        border-bottom: 1px solid $primary;
        outline: none;
        cursor: pointer;
        color: $white;
        padding: 2 * $GU;
      }

      div {
        display: flex;
        align-items: center;
        justify-content: center;
        span {
          position: relative;
          left: calc(-30px - #{2 * $GU});
        }
      }
    }
  }
</style>

<NotificationDisplay />

{#if !connected}
  <section class="welcome">
    <p>
      This interface enables you to contribute to the API3 presale. Note that
      your ethereum address
      <strong>must have been whitelisted</strong>
      beforehand to do so.
    </p>
  </section>
  {#if metamask === 'pending'}
    <section>
      <Button {loading} value="CONNECT" on:click={connect} />
    </section>
  {/if}
  {#if metamask == true}
    <section class="error">
      {#if chain !== CHAIN_ID}
        <p>Please connect to {CHAIN_NAME}</p>
      {:else if !whitelisted}
        <p>Please connect with a whitelisted address</p>
      {/if}
    </section>
  {/if}
  {#if !metamask}
    <section class="welcome">
      <p>Your browser does not seem to come with Metamask installed.</p>
      <p>
        To contribute to this presale through another
        <strong>whitelisted</strong>
        wallet, just send the amount of ETH up to which you want to contribute
        to the following address.
      </p>
    </section>
    <Button value={PRESALE_ADDRESS} on:click={copy} />
  {/if}
{:else}
  <section>
    <h2>API3 token address</h2>
    <p>
      <a href="https://etherscan.io/token/{TOKEN_ADDRESS}" target="_blank">
        {TOKEN_ADDRESS}
      </a>
    </p>
  </section>
  <section>
    <h2>Account</h2>
    <div class="dashboard">
      <p>
        <a href="https://etherscan.io/address/{account}" target="_blank">
          {_account}
        </a>
      </p>
      <p>{balance} API3</p>
    </div>

  </section>
  <section>
    <h2>Invest</h2>
    <div class="form">
      <div>
        <input type="number" min="0" disabled={loading} bind:value />
        <span>ETH</span>
      </div>
      <Button {loading} value="BUY" on:click={buy} />
    </div>
  </section>
  <section class="error">
    {#if error}
      <p>{error}</p>
    {/if}
  </section>
{/if}
