export async function handle(state, action) {
  // desctructing the input object passed in as data with the write call
  const { input } = action;
  if (input.type === 'createPost') {
    state.posts[input.post.id] = input.post;
  }
  if (input.type === 'addComment') {
    state.post[input.id].comments.push(input.comment);
  }
  return { state };
}