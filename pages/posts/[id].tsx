import { Amplify, API, withSSRContext } from "aws-amplify";
import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { ReactElement } from "react";
import { Post } from "../../src/API";
import awsExports from "../../src/aws-exports";
import { deletePost } from "../../src/graphql/mutations";
import { getPost, listPosts } from "../../src/graphql/queries";
import styles from "../../styles/Home.module.css";

Amplify.configure({ ...awsExports, ssr: true });

export const getStaticPaths: GetStaticPaths = async () => {
  const SSR = withSSRContext();
  const { data } = await SSR.API.graphql({ query: listPosts });
  const paths = data.listPosts.items.map((post: Post) => ({
    params: { id: post.id },
  }));

  return {
    fallback: true,
    paths,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  if (!params) {
    throw new Error();
  }

  const SSR = withSSRContext();
  const { data } = await SSR.API.graphql({
    query: getPost,
    variables: {
      id: params.id,
    },
  });

  return {
    props: {
      post: data.getPost,
    },
  };
};

export default function PostPage({ post }: { post: Post }): ReactElement {
  const router = useRouter();

  if (router.isFallback) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Loading&hellip;</h1>
      </div>
    );
  }

  async function handleDelete() {
    try {
      await API.graphql({
        // Type '"AMAZON_COGNITO_USER_POOLS"' is not assignable to type 'GRAPHQL_AUTH_MODE | undefined'.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        authMode: "AMAZON_COGNITO_USER_POOLS" as any,
        query: deletePost,
        variables: {
          input: { id: post.id },
        },
      });

      window.location.href = "/";
    } catch ({ errors }) {
      // eslint-disable-next-line no-console
      console.error(...errors);
      throw new Error(errors[0].message);
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>{post.title} – Amplify + Next.js</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>{post.title}</h1>

        <p className={styles.description}>{post.content}</p>
      </main>

      <footer className={styles.footer}>
        <button onClick={handleDelete}>💥 Delete post</button>
      </footer>
    </div>
  );
}
