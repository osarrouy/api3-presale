<script>
  import Button from "../components/Button.svelte";
  import { NotificationDisplay, notifier } from "../components/Notification";
  import {
    CHAIN_ID,
    CHAIN_NAME,
    CONTRACT_ADDRESS,
    GAS_COST,
    GAS_PRICE
  } from "../lib/";

  let chain,
    account,
    error,
    value = 0,
    metamask = "pending",
    connected = false;

  $: {
    if (chain && chain !== CHAIN_ID) {
      notifier.danger(
        `You're connected to the wrong network. Please connect to ${CHAIN_NAME}.`
      );
    }
  }

  $: {
    console.log(account);
    if (account && account != 0xb71d2d88030a00830c3d45f84c12cc8aaf6857a5) {
      notifier.danger(
        "Your Ethereum address is not whitelisted. Please select another address."
      );
    }
  }

  $: {
    if (
      chain === CHAIN_ID &&
      account == 0xb71d2d88030a00830c3d45f84c12cc8aaf6857a5
    ) {
      connected = true;
    } else {
      connected = false;
    }
  }

  const connect = async () => {
    if (typeof window.ethereum !== "undefined" && ethereum.isMetaMask) {
      account = (await ethereum.request({ method: "eth_requestAccounts" }))[0];
      chain = ethereum.chainId;
      ethereum.on("accountsChanged", accounts => {
        account = accounts[0];
      });
      ethereum.on("chainChanged", chainId => {
        chain = chainId;
      });
      metamask = true;
    } else {
      metamask = false;
      notifier.danger(
        "Your browser does not seem to come with Metamask installed"
      );
    }
  };

  const buy = async () => {
    if (value <= 0) {
      error = "Please provide a positive contribution.";
    } else {
      error = null;
      ethereum
        .request({
          method: "eth_sendTransaction",
          params: [
            {
              from: account,
              to: CONTRACT_ADDRESS,
              value: "0x29a2241af62c0000",
              gasPrice: GAS_PRICE.toString(16),
              gas: GAS_COST.toString(16)
            }
          ]
        })
        .then(txHash => console.log(txHash))
        .catch(error => console.error);
    }
  };

  const copy = async () => {
    try {
      navigator.clipboard.writeText(CONTRACT_ADDRESS);
      notifier.success("Address copied to clipboard.");
    } catch (e) {
      notifier.danger(e.message);
    }
  };
</script>

<style lang="scss">
  img.logo {
    position: fixed;
    left: 2 * $GU;
    top: 2 * $GU;
    width: 5 * $GU;
  }

  section {
    margin: 2 * $GU 0;
    p {
      text-align: center;
    }
    &.error {
      color: $error;
    }
    &.form {
      display: flex;
      align-items: center;
      justify-content: center;
      input[type="number"] {
        display: block;
        background: transparentize($primary, 0.8);
        box-shadow: 0px 0px 10px lighten($primary, 0.8);
        border: none;
        outline: none;
        cursor: pointer;
        color: white;
        padding: 2 * $GU 4 * $GU;
      }
      span {
        position: relative;
        left: calc(-30px - #{2 * $GU});
      }
    }
  }
</style>

<img class="logo" src="logo.png" alt="API3" />
<NotificationDisplay />

{#if metamask === 'pending' || metamask == true}
  <section>
    <p>
      This interface enables you to contribute to the API3 presale. Note that
      your ethereum address
      <strong>must have been whitelisted</strong>
      beforehand to do so.
    </p>
  </section>
{/if}
{#if metamask === 'pending'}
  <Button value="CONNECT" on:click={connect} />
{/if}
{#if metamask == true && !connected}
  <section class="error">
    {#if chain !== CHAIN_ID}
      <p>Please connect to {CHAIN_NAME}</p>
    {/if}
    {#if account != 0xb71d2d88030a00830c3d45f84c12cc8aaf6857a5}
      <p>Please connect with a whitelisted address</p>
    {/if}
  </section>
{/if}
{#if !metamask}
  <section>
    <p>Your browser does not seem to come with Metamask installed.</p>
    <p>
      To contribute to this presale through another
      <strong>whitelisted</strong>
      wallet, just send the amount of ETH up to which you want to contribute to
      the following address.
    </p>
  </section>
  <Button value={CONTRACT_ADDRESS} on:click={copy} />
{/if}
{#if connected}
  <section class="form">
    <input type="number" min="0" bind:value />
    <span>ETH</span>
    <Button value="BUY" on:click={buy} />
  </section>
  {#if error}
    <section class="error">{error}</section>
  {/if}
{/if}
