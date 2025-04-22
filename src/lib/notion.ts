import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";
import { marked } from "marked";

const notion = new Client({
  auth: import.meta.env.NOTION_API_KEY,
});

const n2m = new NotionToMarkdown({ notionClient: notion });

export async function getBlogPosts() {
  try {
    const databaseId = import.meta.env.NOTION_DATABASE_ID;
    const response = await notion.databases.query({
      database_id: databaseId,
      sorts: [
        {
          property: "Published",
          direction: "descending",
        },
      ],
    });

    const posts = await Promise.all(
      response.results.map(async (page) => {
        const mdBlocks = await n2m.pageToMarkdown(page.id);
        const mdString = n2m.toMarkdownString(mdBlocks);
        const htmlContent = marked(mdString);

        return {
          id: page.id,
          title: page.properties.Title.title[0].plain_text,
          slug: page.properties.Slug.rich_text[0].plain_text,
          excerpt: page.properties.Excerpt.rich_text[0].plain_text,
          coverImage: page.properties.CoverImage.url,
          tags: page.properties.Tags.multi_select.map((tag) => tag.name),
          publishedDate: page.properties.Published.date.start,
          content: htmlContent,
        };
      })
    );

    return posts;
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return [];
  }
}

export async function getBlogPost(slug: string) {
  try {
    const databaseId = import.meta.env.NOTION_DATABASE_ID;
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: "Slug",
        rich_text: {
          equals: slug,
        },
      },
    });

    if (!response.results.length) {
      return null;
    }

    const page = response.results[0];
    const mdBlocks = await n2m.pageToMarkdown(page.id);
    const mdString = n2m.toMarkdownString(mdBlocks);
    const htmlContent = marked(mdString);

    return {
      id: page.id,
      title: page.properties.Title.title[0].plain_text,
      slug: page.properties.Slug.rich_text[0].plain_text,
      excerpt: page.properties.Excerpt.rich_text[0].plain_text,
      coverImage: page.properties.CoverImage.url,
      tags: page.properties.Tags.multi_select.map((tag) => tag.name),
      publishedDate: page.properties.Published.date.start,
      content: htmlContent,
    };
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return null;
  }
}