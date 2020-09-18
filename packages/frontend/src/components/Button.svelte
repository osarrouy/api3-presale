<script>
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let value = "";

  const _click = () => {
    dispatch("click");
  };
</script>

<style lang="scss">
  input[type="button"] {
    background: $primary;
    box-shadow: 0px 0px 10px lighten($primary, 0.8);
    border: none;
    outline: none;
    cursor: pointer;
    color: white;
    padding: 2 * $GU 4 * $GU;
    text-decoration: none;
    transform-style: preserve-3d;
    transition: all 0.3s ease-out;

    &:hover {
      transform: scale(0.95);
    }

    &:active {
      transform: scale(0.4);
    }
  }
</style>

<input type="button" {value} on:click={_click} />
