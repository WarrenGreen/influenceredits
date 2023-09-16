import type PostType from '@/interfaces/post'
import { getPostBySlug, getAllPosts, markdownToHtml} from '@/helpers/blog'
import PostHeader from '@/components/blog/post-header'
import PostBody from '@/components/blog/post-body'

import { useRouter } from 'next/router'
import ErrorPage from 'next/error'
import Head from 'next/head'



type Props = {
  post: PostType
  morePosts: PostType[]
  preview?: boolean
}


export default function Post({ post, morePosts, preview }: Props) {
  const router = useRouter()
  const title = `${post.title}`
  if (!router.isFallback && !post?.slug) {
    return <ErrorPage statusCode={404} />
  }

  return (
    <>
      <main>
      {router.isFallback ? (
        <h1>Loading...</h1>
      ):
      (<>
        <article className="mb-32">
          <Head>
            <title>{title}</title>
            <meta property="og:image" content={post.ogImage.url} />
          </Head>
          <PostHeader
            title={post.title}
            coverImage={post.coverImage}
            date={post.date}
          />
          <PostBody content={post.content} />
        </article>
      </>)}
      </main>
    </>
        )
}

type Params = {
  params: {
    slug: string
  }
}

export async function getStaticProps({ params }: Params) {
  const post = getPostBySlug(params.slug, [
    'title',
    'date',
    'slug',
    'content',
    'ogImage',
    'coverImage',
  ])
  const content = await markdownToHtml(post.content || '')

  return {
    props: {
      post: {
        ...post,
        content,
      },
    },
  }
}

export async function getStaticPaths() {
  const posts = getAllPosts(['slug'])

  return {
    paths: posts.map((post) => {
      return {
        params: {
          slug: post.slug,
        },
      }
    }),
    fallback: false,
  }
}
