'use client';

import Date from '@/components/date';
import AppLayout from "@/components/app-layout";

export default function PostPage({ postData }) {
  return (
    <AppLayout lang="en-US">
      <h1 className="text-3xl font-extrabold my-4">{postData.title}</h1>
      <div className="text-gray-500">
        <Date dateString={postData.date} />
      </div>
      <div lang="en" className="blogPost" dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
    </AppLayout>
  );
}
