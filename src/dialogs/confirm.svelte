<script>
  import Modal from "../components/modal.svelte";
  import { createEventDispatcher } from "svelte";
  export let open = false;
  const dispatch = createEventDispatcher();
</script>

<Modal {open} on:cancel={() => dispatch("cancel")}>
  <div
    class="m-4 border-4 border-success pb-8 px-2 flex flex-col items-center justify-center"
  >
    <h3 class="mb-8 text-3xl bg-success text-white p-2 mt-4">Success!</h3>
    <!--
    <blockquote>
      NOTE: When uploading large images it may take a few minutes for the image
      to show up on the network.
    </blockquote>
    -->
    <a href="/view" class="link">View Posts</a>
  </div>
</Modal>
