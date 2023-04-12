<script>
  import { postCache } from "../store";

  import { onMount } from "svelte";
  import { getAssetData } from "../lib/asset";

  let src = "https://placehold.co/400";
  let imageMsg = "";

  let assetData = getAssetData();
  let assets = [];

  $: cachedAssets = $postCache;

  onMount(async () => {
    assets = await assetData;
    console.log("This is the console from OnMount", assets);
    const i = $postCache.find((img) => img);
    if (i) {
      src = i.src;
      imageMsg =
        "Currently displaying cache, when deploying directly to arweave, it can take up to 30 minutes to show on chain...";
    }
  });
</script>

<section class="hero min-h-screen bg-base-100">
  <div class="flex-col">
    {#if cachedAssets.length > 0}
      {#each cachedAssets as asset}
        <div
          class="hero-content w-[350px] md:w-full py-5 m-0 flex-col md:flex-row md:space-x-4"
        >
          <div class="md:w-1/2 px-0 mx-0 grid place-items-center">
            <img
              class="h-[400px] w-full md:w-[500px] object-contain"
              src={asset.image}
              alt={asset.title}
            />
          </div>
          <div class="w-[325px] md:w-1/2 px-0 mx-0 md:ml-8">
            <div class="mb-4 px-0 mx-0 flex items-start justify-between">
              <h1 class="text-3xl">{asset.title}</h1>
              <p class="text-3xl">{asset.description}</p>
            </div>
          </div>
        </div>
      {/each}
    {/if}
  </div>
  {#await assetData then assets}
    {console.log("This is the console from section", assets)}
    <div class="flex-col">
      {#each assets as asset}
        <div
          class="hero-content w-[350px] md:w-full py-5 m-0 flex-col md:flex-row md:space-x-4"
        >
          <div class="md:w-1/2 px-0 mx-0 grid place-items-center">
            {#if asset.type === "image"}
              <img
                class="h-[400px] w-full md:w-[500px] object-contain"
                src={asset.image}
                alt={asset.title}
              />
            {/if}
          </div>
          <div class="w-[325px] md:w-1/2 px-0 mx-0 md:ml-8">
            <div class="mb-4 px-0 mx-0 flex items-start justify-between">
              <h1 class="text-3xl">{asset.title}</h1>
            </div>
            <p class="text-xl">{asset.description}</p>
            {#if asset.topics.length > 0}
              <p class="mt-4 text-sm">Topics: {asset.topics.join(", ")}</p>
            {/if}
            <p class="text-md">
              {new Date(asset.timestamp)}
            </p>
          </div>
        </div>
        <hr />
        <!-- <form
            class="form mt-16 px-4 md:px-0"
            on:submit|preventDefault={addComment}
            id={asset.id}
          >
            <div class="form-control">
              <label for="comment" class="label">Comments</label>
              <input
                id="comment"
                class="input input-bordered"
                bind:value={comments[asset.id]}
                required
              />
              <p class="label text-sm text-gray-400">Enter a comment</p>
            </div>
            <button disabled={!comments[asset.id]} class="btn btn-block">
              Deploy
            </button>
          </form> -->
      {/each}
    </div>
  {/await}
</section>
