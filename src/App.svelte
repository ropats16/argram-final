<script>
  import { Route } from "tinro";
  import Navbar from "./components/navbar.svelte";
  import Upload from "./pages/upload.svelte";
  import View from "./pages/view.svelte";
  import Start from "./pages/start.svelte";
  import { profile } from "./store";
</script>

<Navbar />
<main>
  <Route path="/">
    <Start />
  </Route>
  <Route path="/upload">
    {#if $profile}
      <Upload />
    {:else}
      <Start />
    {/if}
  </Route>
  <Route path="/view">
    <View />
  </Route>
</main>
