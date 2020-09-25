<style lang="scss">
  .loader,
  .loader:before,
  .loader:after {
    background: $primary;
    -webkit-animation: load1 1s infinite ease-in-out;
    animation: load1 1s infinite ease-in-out;
    width: 1em;
    height: 2 * $GU;
  }
  .loader {
    color: $primary;
    text-indent: -9999em;
    margin: 0 auto;
    position: relative;
    font-size: 11px;
    -webkit-transform: translateZ(0);
    -ms-transform: translateZ(0);
    transform: translateZ(0);
    -webkit-animation-delay: -0.16s;
    animation-delay: -0.16s;
  }
  .loader:before,
  .loader:after {
    position: absolute;
    top: 0;
    content: "";
  }
  .loader:before {
    left: -1.5em;
    -webkit-animation-delay: -0.32s;
    animation-delay: -0.32s;
  }
  .loader:after {
    left: 1.5em;
  }

  @keyframes load1 {
    0%,
    80%,
    100% {
      box-shadow: 0 0;
      height: 2 * $GU;
    }
    40% {
      box-shadow: 0 #{-$GU};
      height: 3 * $GU;
    }
  }
</style>

<div class="loader">Loading...</div>
