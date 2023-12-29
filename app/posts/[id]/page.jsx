import Date from '@/components/date';
import Layout from "@/components/layout";
import { cache } from 'react';
import { getAllPostIds, getPostData } from "@/lib/posts";

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
  return (
    <Layout>
      <h1 className="text-3xl font-extrabold my-4">{postData.title}</h1>
      <div className="text-gray-500">
        <Date dateString={postData.date} />
      </div>
      <div className="blogPost" dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
    </Layout>
  );
}
