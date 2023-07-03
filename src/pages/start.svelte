<script>
  import { meta } from "tinro";

  // imports
  import { profile } from "../store.js";
  import { Othent } from "arweavekit/auth";

  // function to handle a user login
  // returns the user profile and stores it in $profile, a cache variable
  async function handleConnect() {
    $profile = await Othent.logIn({
      apiId: import.meta.env.VITE_OTHENT_API_ID,
    });
  }
</script>

<!-- landing page ui -->
<section class="hero h-full min-h-screen bg-black">
  <div class="hero-content flex-col space-y-16">
    <h1 class="text-8xl text-white font-bold hover:text-primary font-lobster">
      ArGram
    </h1>
    <p class="text-2xl dark:text-white text-center">
      A decentralised image sharing application on Arweave <br /> that allows
      you to post your images <br /> as atomic assets.
    </p>
    <div class="flex space-x-4">
      <!-- connect button to handle log in -->
      <button class="btn btn-primary" on:click={handleConnect}>Log In</button>
    </div>
  </div>
</section>
