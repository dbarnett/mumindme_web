import { cache } from 'react';
import { getAllPostIds, getPostData } from "@/lib/posts";
import PostPage from './post-page';

const getPostDataCached = cache(getPostData);

export async function generateMetadata({ params }) {
  const postData = await getPostDataCached(params.id);
  return {
    title: postData.title,
  };
};

export const dynamicParams = false;

export async function generateStaticParams() {
  return getAllPostIds();
}

export default async function Post({ params }) {
  const postData = await getPostDataCached(params.id);
  return <PostPage postData={postData} />;
}
