import { DataStore } from 'aws-amplify'
import type { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Markdown from 'react-markdown'
import { Post } from '../../src/models'

const PostComponent: NextPage<{ post: Post }> = ({ post }) => {
  const router = useRouter()
  if (router.isFallback) {
    return <div>Loading...</div>
  }
  return (
    <div className="u-container">
      <Head>
        <title>{post.title}</title>
      </Head>
      <h1>{post.title}</h1>
      <Markdown>{post.content ?? ""}</Markdown>
    </div>
  )
}

export default PostComponent;

export const getStaticPaths: GetStaticPaths = async (req) => {
  // const { DataStore } = withSSRContext(req)
  const posts = await DataStore.query(Post)
  const paths = posts.map(post => ({ params: { id: post.id }}))
  return {
    paths,
    fallback: true,
  }
}

export const getStaticProps: GetStaticProps = async (req) => {
  // const { DataStore } = withSSRContext(req)
  const { params } = req
  const { id } = params ?? {};
  if (!id || Array.isArray(id)) {
    throw new Error("Single ID required");
  }
  const post = await DataStore.query(Post, id)

  return {
    props: {
      post: JSON.parse(JSON.stringify(post))
    },
    revalidate: 1
  }
}