// src/lib/airtable.ts
import axios from 'axios';

const AIRTABLE_BASE_ID = import.meta.env.AIRTABLE_BASE_ID;
const AIRTABLE_API_KEY = import.meta.env.AIRTABLE_API_KEY;

const API_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}`;

export async function fetchAirtableRecords(table: string) {
  const records: any[] = [];
  let offset = '';
  do {
    const url = `${API_URL}/${table}?pageSize=100${offset ? `&offset=${offset}` : ''}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
      },
    });
    records.push(...response.data.records);
    offset = response.data.offset;
  } while (offset);
  return records;
}

export async function getBlogPosts() {
  const records = await fetchAirtableRecords('BlogPosts');
  if (!Array.isArray(records) || records.length === 0) return [];
  return records.map((rec: any) => ({
    id: rec.id,
    ...(rec.fields || {}),
    tags: Array.isArray(rec.fields?.tags) ? rec.fields.tags : [],
    coverImage: Array.isArray(rec.fields?.coverImage) && rec.fields.coverImage[0] ? rec.fields.coverImage[0].url : '',
  }));
}

export async function getProjects() {
  const records = await fetchAirtableRecords('Projects');
  // Debug: log the fetched records for troubleshooting
  if (typeof window !== 'undefined') {
    console.log('Airtable raw records:', records);
  }
  return records
    .filter((rec: any) => rec.fields && rec.fields.title) // Only include records with a title
    .map((rec: any) => ({
      id: rec.id,
      title: rec.fields.title || '',
      tags: rec.fields.tags || [],
      publishedDate: rec.fields.publishedDate || '',
      content: rec.fields.content || '',
      excerpt: rec.fields.excerpt || '',
      coverImage: Array.isArray(rec.fields.coverImage) && rec.fields.coverImage[0] ? rec.fields.coverImage[0].url : '',
    }));
}


// NOTE: If you want to fetch blog posts from a 'BlogPosts' table, duplicate the above logic with the table name 'BlogPosts' and matching field names.
