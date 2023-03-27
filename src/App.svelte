<script>
  import axios from "axios";
  import { onMount } from "svelte";
  import { functionId } from "./utils/functionId.js";
  import { v4 as uuid } from "uuid";

  $: state = {
    data: {
      posts: {},
    },
  };

  onMount(async () => {
    state = await axios({
      method: "get",
      url: `https://${functionId}.exm.run`,
    });
  });

  async function handleSubmit(e) {
    const res = await axios({
      method: "post",
      url: `https://${functionId}.exm.run`,
      data: {
        type: "createPost",
        post: {
          id: uuid(),
          author: e.target.author.value,
          topic: e.target.topic.value,
          postImg: fileinput,
          comments: [],
        },
      },
    });

    state.data.posts = res.data.data.execution.state.posts;

    e.target.reset();
  }

  async function handleComment(e) {
    const res = await axios({
      method: "post",
      url: `https://${functionId}.exm.run`,
      data: {
        type: "addComment",
        id: e.target.text.id,
        comment: {
          author: e.target.author.value,
          text: e.target.text.value,
        },
      },
    });

    state.data.posts = res.data.data.execution.state.posts;

    e.target.reset();
  }

  let avatar, fileinput;

  const onFileSelected = (e) => {
    let image = e.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = (e) => {
      avatar = e.target.result;
    };
  };
</script>

<header>
  <h1>ArGram</h1>
</header>
<main>
  <form class="discussionForm" on:submit|preventDefault={handleSubmit}>
    {#if avatar}
      <img class="avatar" src={avatar} alt="d" width="270px" />
    {:else}
      <img
        class="avatar"
        src="https://cdn4.iconfinder.com/data/icons/small-n-flat/24/user-alt-512.png"
        alt=""
        width="270px"
      />
    {/if}
    <img
      class="upload"
      src="https://static.thenounproject.com/png/625182-200.png"
      alt=""
      width="100px"
      on:click={() => {
        fileinput.click();
      }}
    />
    <div
      on:click={() => {
        fileinput.click();
      }}
    >
      Choose Image
    </div>
    <input
      type="file"
      accept=".jpg, .jpeg, .png"
      on:change={(e) => onFileSelected(e)}
      bind:this={fileinput}
    />
    <input type="text" name="author" placeholder="Your Alias" />
    <input
      type="text"
      name="topic"
      class="discussionInput"
      placeholder="Post description"
    />
    <button type="submit">Create Post</button>
  </form>
  {#each Object.values(state.data.posts) as post}
    <div class="discussion">
      <img src={post.postImg} width="270x" alt={post.topic} />
      <h4>{post.topic}</h4>
      <p>Submitted by <strong>{post.author}</strong></p>
      {#each Object.values(post.comments) as comment}
        <div class="comment">
          <strong>{post.author}</strong>: {comment.text}
        </div>
      {/each}
      <form class="commentForm" on:submit|preventDefault={handleComment}>
        <input
          type="text"
          name="author"
          class="commentName"
          placeholder="Your Alias"
        />
        <input
          type="text"
          name="text"
          class="commentInput"
          id={post.id}
          placeholder="Add Comment"
        />
        <button type="submit" class="commentButton">Add Comment</button>
      </form>
    </div>
  {/each}
</main>
