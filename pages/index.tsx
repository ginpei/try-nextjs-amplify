// pages/index.js
import { AmplifyAuthenticator } from "@aws-amplify/ui-react";
import { Amplify, API, Auth, withSSRContext } from "aws-amplify";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { FormEventHandler, ReactElement } from "react";
import { Post } from "../src/API";
import awsExports from "../src/aws-exports";
import { createPost } from "../src/graphql/mutations";
import { listPosts } from "../src/graphql/queries";
import styles from "../styles/Home.module.css";

Amplify.configure({ ...awsExports, ssr: true });

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const SSR = withSSRContext({ req });
  const response = await SSR.API.graphql({ query: listPosts });

  return {
    props: {
      posts: response.data.listPosts.items,
    },
  };
};

const handleCreatePost: FormEventHandler = async (event) => {
  event.preventDefault();

  if (!(event.target instanceof HTMLFormElement)) {
    return;
  }

  const form = new FormData(event.target);

  try {
    const result = await API.graphql({
      // Type '"AMAZON_COGNITO_USER_POOLS"' is not assignable to type 'GRAPHQL_AUTH_MODE | undefined'.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      authMode: "AMAZON_COGNITO_USER_POOLS" as any,
      query: createPost,
      variables: {
        input: {
          title: form.get("title"),
          content: form.get("content"),
        },
      },
    });

    // Property 'data' does not exist on type 'GraphQLResult<object> | Observable<object>'.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = result as any;

    window.location.href = `/posts/${data.createPost.id}`;
  } catch ({ errors }) {
    // eslint-disable-next-line no-console
    console.error(...errors);
    throw new Error(errors[0].message);
  }
};

export default function Home({ posts = [] }: { posts: Post[] }): ReactElement {
  return (
    <div className={styles.container}>
      <Head>
        <title>Amplify + Next.js</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Amplify + Next.js</h1>

        <p className={styles.description}>
          <code className={styles.code}>{posts.length}</code>
          posts
        </p>

        <div className={styles.grid}>
          {posts.map((post) => (
            <a className={styles.card} href={`/posts/${post.id}`} key={post.id}>
              <h3>{post.title}</h3>
              <p>{post.content}</p>
            </a>
          ))}

          <div className={styles.card}>
            <h3 className={styles.title}>New Post</h3>

            <AmplifyAuthenticator>
              <form onSubmit={handleCreatePost}>
                <fieldset>
                  <legend>Title</legend>
                  <input
                    defaultValue={`Today, ${new Date().toLocaleTimeString()}`}
                    name="title"
                  />
                </fieldset>

                <fieldset>
                  <legend>Content</legend>
                  <textarea
                    defaultValue="I built an Amplify app with Next.js!"
                    name="content"
                  />
                </fieldset>

                <button>Create Post</button>
                <button type="button" onClick={() => Auth.signOut()}>
                  Sign out
                </button>
              </form>
            </AmplifyAuthenticator>
          </div>
        </div>
      </main>
    </div>
  );
}
