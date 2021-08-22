import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'

interface Props {
  id: string;
}

const PostComponent: NextPage<Props> = ({ id }) => {
  // const router = useRouter()
  // if (router.isFallback) {
  //   return <div>Loading...</div>
  // }

  return (
    <div className="u-container">
      <Head>
        <title>ID: {id}</title>
      </Head>
      <h1>ID: {id}</h1>
    </div>
  )
}

export default PostComponent;

export const getServerSideProps: GetServerSideProps<Props> = async (req) => {
  const { id } = req.params ?? {};
  
  if (typeof id !== 'string') {
    throw new Error();
  }

  return {
    props: {
      id,
    }
  }
}
