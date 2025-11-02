'use client';

import Date from '@/components/date';
import AppLayout from "@/components/app-layout";
import T from '@/components/t';
import { PostData } from '@/lib/posts';

interface PostPageProps {
  postData: PostData;
}

export default function PostPage({ postData }: PostPageProps) {
  return (
    <AppLayout>
      <h1 className="text-3xl font-extrabold my-4"><T>{postData.title}</T></h1>
      <div className="text-gray-500">
        <Date dateString={postData.date} />
      </div>
      <div lang="en-US" className="blogPost" dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
    </AppLayout>
  );
}
