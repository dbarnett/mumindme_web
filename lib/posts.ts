import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import rehypeFormat from 'rehype-format';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSanitize from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import {unified} from 'unified';

export interface PostMetadata {
  id: string;
  title: string;
  date: string;
  tags: string[];
}

export interface PostData extends PostMetadata {
  contentHtml: string;
}

const postsDirectory = path.join(process.cwd(), 'posts');

export function getSortedPostsData(): PostMetadata[] {
  const filenames = fs.readdirSync(postsDirectory);
  const allPostsData = filenames.map((filename): PostMetadata => {
    const id = filename.replace(/\.md$/, '');

    const fullPath = path.join(postsDirectory, filename);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    const matterResult = matter(fileContents);

    return {
      id,
      ...(matterResult.data as Omit<PostMetadata, 'id'>),
    };
  });
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getAllPostIds(): { id: string }[] {
  const filenames = fs.readdirSync(postsDirectory);
  return filenames.map((fname) => {
    return {
      id: fname.replace(/\.md$/, ''),
    };
  });
}

export async function getPostData(id: string): Promise<PostData> {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  const matterResult = matter(fileContents);
  const processedContent = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeSanitize)
    .use(rehypeFormat)
    .use(rehypePrettyCode)
    .use(rehypeStringify)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();
  return {
    id,
    contentHtml,
    ...(matterResult.data as Omit<PostMetadata, 'id'>),
  };
}
