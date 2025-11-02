import { cache } from 'react';
import { getAllPostIds, getPostData } from "@/lib/posts";
import PostPage from './post-page';

const getPostDataCached = cache(getPostData);

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const postData = await getPostDataCached((await params).id);
  return {
    title: postData.title,
  };
}

export const dynamicParams = false;

export async function generateStaticParams() {
  return getAllPostIds();
}

export default async function Post({ params }: PageProps) {
  const postData = await getPostDataCached((await params).id);
  return <PostPage postData={postData} />;
}
