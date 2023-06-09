<script>
  // imports
  import {
    writeContractWOthent,
    readContractWOthent,
  } from "arweavekit/contract";
  import { profile } from "../store";
  import { take } from "ramda";
  import Deploy from "../dialogs/deploy.svelte";
  import Error from "../dialogs/error.svelte";
  import { onMount } from "svelte";

  // id variable to get the transaction id of an asset (post) from the view page
  export let id = "";

  // object to handle users' requests to add comments on multiple posts
  let comments = {};

  // array storing the comments information for a post
  let commentsArray = [];

  // pop dialog boxes for status updates
  let deployDlg = false;
  let errorMessage = "";
  let errorDlg = false;

  // function to add comment
  async function addComment(e) {
    try {
      // opens pop up showing posting in progress
      deployDlg = true;

      // function to call `addComment` function from post's contract
      // sends function name, username and comment text as inputs
      const res = await writeContractWOthent({
        // function name to indicate writing to a contract
        apiId: import.meta.env.VITE_OTHENT_API_ID,
        othentFunction: "sendTransaction",
        data: {
          toContractId: id,
          toContractFunction: "addComment",
          txnData: {
            function: "addComment",
            username: $profile ? $profile.name : "",
            comment: comments[id],
          },
        },
      });

      // closes pop up after successful comment addition and resets the input box in ui
      deployDlg = false;
      e.target.reset();

      // fetches the latest comments on a post and stores result in commentsArray
      commentsArray = await readComments();
    } catch (e) {
      // error handling to display error in pop up
      deployDlg = false;
      errorMessage = e.message;
      errorDlg = true;
    }
  }

  // reads the state of a post and returns the list of comments from it
  // requires the post's transaction id (received from View Page in the 'id' var)
  async function readComments() {
    const res = await readContractWOthent({
      apiId: import.meta.env.VITE_OTHENT_API_ID,
      contractTxId: id,
    });

    return res.state["comments"];
  }

  // fetches the latest list of comments for a post on the components first render
  onMount(async () => {
    commentsArray = await readComments();
  });
</script>

<section
  class=" pb-4 bg-black flex flex-col self-center border-solid border-2 border-slate-300 rounded-lg"
>
  <div class="flex flex-col self-start m-2">
    <!-- ensures commentsArray has comments -->
    {#if commentsArray.length > 0}
      <!-- maps over elements of commentsArray -->
      <!-- each element is given temp name 'comment' -->
      {#each commentsArray as comment}
        <p class="text-sm px-4 md:px-12 gap-2 flex flex-row w-full">
          <!-- renders commenter's username or id -->
          <strong
            >{comment.username && comment.username != ""
              ? comment.username
              : take(5, comment.id)}</strong
          >: {comment.comment}
        </p>
      {/each}
    {/if}
  </div>
  <hr class="w-10/12 self-center" />
  <!-- input form for calling 'addComment' function -->
  <form
    class="form px-4 md:px-12 mx-0 gap-2 flex flex-row items-center justify-center w-full"
    on:submit|preventDefault={addComment}
  >
    <div class="form-control w-full flex">
      <label for="comment" class="label">Comments</label>
      <!-- input field for comment text -->
      <!-- bind:value adds the comment text to the 'comments' variable -->
      <input
        id="comment"
        class="input input-bordered"
        bind:value={comments[id]}
        required
        placeholder="Enter comment to enable"
      />
    </div>
    <!-- button to submit comment form -->
    <!-- button is disabled until valid comment is passed in -->
    <button disabled={!comments[id]} class="btn btn-block w-1/4 self-end">
      Comment
    </button>
  </form>
</section>

<!-- error handling pop ups -->
<Deploy open={deployDlg} />
<Error
  open={errorDlg}
  msg={errorMessage}
  on:cancel={() => (errorDlg = false)}
/>
