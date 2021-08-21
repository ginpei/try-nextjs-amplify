import type { NextPage } from "next";
import Head from "next/head";
import { DataStore } from "aws-amplify";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Post } from "../src/models";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetchPosts();
    async function fetchPosts() {
      const postData = await DataStore.query(Post);
      setPosts(postData);
    }
    const subscription = DataStore.observe(Post).subscribe(() => fetchPosts());
    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1>Posts</h1>
      {posts.map((post) => (
        <Link href={`/posts/${post.id}`} key={post.id}>
          <a>
            <h2>{post.title}</h2>
          </a>
        </Link>
      ))}
    </div>
  );
};

export default Home;
