<script>
  import {
    readContractWOthent,
    writeContractWOthent,
  } from "permawebjs/contract";
  import { profile } from "../store";
  import { onMount } from "svelte";

  export let id = "";

  let likes = {};

  async function likePost() {
    const res = await writeContractWOthent({
      othentFunction: "sendTransaction",
      data: {
        toContractId: id,
        toContractFunction: "likePost",
        txnData: {
          function: "likePost",
        },
      },
    });

    console.log("res of like", res);

    likes = await readLikes();
  }

  async function readLikes() {
    const res = await readContractWOthent({
      contractTxId: id,
    });

    return res.state["likes"];
  }

  onMount(async () => {
    likes = await readLikes();
  });
</script>

<section>
  {#await readLikes() then likes}
    <p>{Object.keys(likes).length}</p>
    <button
      class="btn btn-block"
      disabled={Object.keys(likes).includes($profile.contract_id)}
      on:click|preventDefault={likePost}>Like</button
    >
  {/await}
</section>
