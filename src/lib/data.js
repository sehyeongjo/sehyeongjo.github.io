import { camelizeKeys } from 'humps';
import { supabaseUrl, supabaseKey } from '../../config';

async function select(table, query) {
  const response = await fetch(`${supabaseUrl}/rest/v1/${table}?${query}`, {
    headers: { apikey: supabaseKey },
  });
  if (!response.ok) {
    throw Error(`Supabase ${table} ${response.status}: ${await response.text()}`);
  }
  return response.json();
}

// Images (thumbnails, profile photo) are file names in the public 'thumbnails' Storage bucket; full URLs are used as-is.
function imageUrl(name) {
  return !name || /^https?:\/\//.test(name)
    ? name
    : `${supabaseUrl}/storage/v1/object/public/thumbnails/${encodeURI(name)}`;
}

// Each item is one bullet; its extra lines are indented to continue that bullet.
function toMarkdown({ title, isList, sectionItems }) {
  const body = isList
    ? sectionItems.map(({ content }) => `- ${content.replace(/\n/g, '\n  ')}`).join('\n')
    : sectionItems.map(({ content }) => content).join('\n\n');
  return `## ${title}\n\n${body}`;
}

export async function getData() {
  const [contents, sections, publications] = await Promise.all([
    select('contents', 'select=id,content'),
    select('sections', 'select=id,title,is_list,section_items(content)&order=position&section_items.order=position'),
    select('publications', 'select=*&order=id.desc'),
  ]);
  const index = contents.reduce((acc, row) => ({ ...acc, [row.id]: row.content }), {});
  return {
    index: { ...index, image: imageUrl(index.image) },
    sections: camelizeKeys(sections).map(section => ({ ...section, markdown: toMarkdown(section) })),
    publications: camelizeKeys(publications).map(publication => ({
      ...publication,
      thumbnail: imageUrl(publication.thumbnail),
    })),
  };
}
