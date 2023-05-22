<script>
  // imports
  import {
    readContractWOthent,
    writeContractWOthent,
  } from "permawebjs/contract";
  import { profile } from "../store";
  import { onMount } from "svelte";

  // id variable to get the transaction id of an asset (post) from the view page
  export let id = "";

  // object to store likes information for a post
  let likes = {};

  // function to like posts
  async function likePost() {
    // function to call `likePost` function from post's contract\
    const res = await writeContractWOthent({
      apiId: "YOUR_API_KEY",
      othentFunction: "sendTransaction",
      data: {
        toContractId: id,
        toContractFunction: "likePost",
        txnData: {
          function: "likePost",
        },
      },
    });

    // fetches the latest likes on a post and stores result in 'likes'
    likes = await readLikes();
  }

  // reads the state of a post and returns the likes object
  async function readLikes() {
    const res = await readContractWOthent({
      apiId: "YOUR_API_KEY",
      contractTxId: id,
    });

    return res.state["likes"];
  }

  // fetches the latest likes information for a post on the components first render
  onMount(async () => {
    likes = await readLikes();
  });
</script>

<section>
  <!-- Calculates number of keys object -->
  <!-- number keys corresponds to the number of likes for a post -->
  <p class="text-center">{Object.keys(likes).length}</p>
  <!-- button to like a post -->
  <!-- button is disabled if user has already liked post -->
  <button
    class="btn btn-block"
    disabled={Object.keys(likes).includes($profile.contract_id)}
    on:click|preventDefault={likePost}>Like</button
  >
</section>
