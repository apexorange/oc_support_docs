require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { createClient } = require('@sanity/client');
const { toHTML } = require('@portabletext/to-html');
const { parse } = require('json2csv');

// Setup Sanity client
const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  apiVersion: '2023-10-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

// Portable Text to HTML serializer
const htmlComponents = {
  types: {
    image: ({ value }) => {
      const url = client.assets.document.download(value.asset._ref).url;
      const alt = value.alt || '';
      const width = value.width ? ` width="${value.width}"` : '';
      return `<img src="${url}" alt="${alt}"${width}>`;
    },
    callout: ({ value }) => {
      const style = value.style || 'info';
      return `<div class="callout ${style}">${value.content}</div>`;
    },
  },
  marks: {
    strong: ({ children }) => `<strong>${children}</strong>`,
    em: ({ children }) => `<em>${children}</em>`,
  },
  block: {
    h2: ({ children }) => `<h2>${children}</h2>`,
    h3: ({ children }) => `<h3>${children}</h3>`,
    normal: ({ children }) => `<p>${children}</p>`,
  }
};

(async () => {
  try {
    const posts = await client.fetch(`*[_type == "post"]{ title, slug, body }`);

    const rows = posts.map(post => ({
      Title: post.title,
      Slug: post.slug?.current || '',
      Content: toHTML(post.body, { components: htmlComponents })
    }));

    const csv = parse(rows, { fields: ['Title', 'Slug', 'Content'] });
    fs.writeFileSync(path.join(__dirname, 'posts.csv'), csv);
    console.log('✅ Exported to posts.csv');
  } catch (err) {
    console.error('❌ Error exporting:', err.message || err);
  }
})();
