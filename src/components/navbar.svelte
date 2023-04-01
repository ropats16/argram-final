<script>
  import { createEventDispatcher } from "svelte";
  import { profile } from "../store.js";
  import { take } from "ramda";
  const dispatch = createEventDispatcher();
  $: addr = $profile ? $profile.addr : "";
  function handleConnect() {
    dispatch("xyz");
  }
  async function handleDisconnect() {
    await window.arweaveWallet.disconnect();
    $profile = null;
  }
</script>

<div class="navbar bg-base-100">
  <div class="navbar-start" />
  <div class="hidden navbar-center md:flex">
    <a href="/" class="btn btn-ghost normal-case text-xl">img</a>
  </div>
  <div class="hidden navbar-end md:flex">
    {#if $profile}
      <a href="/home" class="btn btn-ghost">Upload</a>
      <a href="/hx/{addr}" class="btn btn-ghost">My IMGs</a>

      <button class="btn btn-ghost" on:click={handleDisconnect}
        >{take(5, $profile.addr)}...</button
      >
    {:else}
      <button on:click={handleConnect} class="btn btn-ghost">Connect</button>
    {/if}
  </div>
</div>
