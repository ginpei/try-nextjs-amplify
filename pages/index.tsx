import { DataStore } from "aws-amplify";
import { ReactElement, useEffect, useState } from "react";
import { PostItem } from "../components/home/PostItem";
import { Post, PostStatus } from "../src/models";

export default function Home(): ReactElement {
  const [saving, setSaving] = useState(false);
  const [posts] = usePostList();

  const onCreateClick = async () => {
    // eslint-disable-next-line no-alert
    const title = window.prompt("Title", "Hello Amplify World!");
    if (!title) {
      return;
    }

    setSaving(true);

    try {
      const post = new Post({
        status: PostStatus.PUBLISHED,
        title,
      });
      await DataStore.save(post);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="ui-container">
      <h1>Hoi World!</h1>
      <p>
        <button disabled={saving} onClick={onCreateClick}>
          Create
        </button>
      </p>
      {posts ? (
        <div>
          {posts.map((post) => (
            <PostItem key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <p>…</p>
      )}
    </div>
  );
}

function usePostList(): [Post[] | null, Error | null] {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    DataStore.query(Post).then((newPosts) => {
      setPosts(newPosts);
    });

    DataStore.observe(Post).subscribe((message) => {
      console.log("# message", message);

      DataStore.query(Post).then((newPosts) => {
        setPosts(newPosts);
      });
    });
  }, []);

  return [posts, error];
}
