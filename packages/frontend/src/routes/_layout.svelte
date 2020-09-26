<style lang="scss">
  header {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    padding: 2 * $GU;
    height: 9 * $GU;

    img.logo {
      position: absolute;
      left: 2 * $GU;
      top: 50%;
      transform: translateY(-50%);
      height: 5 * $GU;

      @media screen and (max-width: 800px) {
        visibility: hidden;
      }
    }

    h1 {
      width: 100%;
      text-align: center;
    }
  }

  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    margin: auto;
    padding: 2 * $GU;
    max-width: 980px;
  }
</style>

<header>
  <img class="logo" src="logo.png" alt="API3" />
  <h1>API3 Presale</h1>
</header>

<main>
  <slot />
</main>
