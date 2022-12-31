// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs'),
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  fm = require('front-matter'),
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  RSS = require('rss'),
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  marked = require('marked');

const contents = fs.readdirSync('content/blog').map((blogfolder) => {
  const filename = fs.readdirSync(`content/blog/${blogfolder}`).find((file) => file.endsWith('.md'));
  return fs.readFileSync(`content/blog/${blogfolder}/${filename}`, 'utf8');
});

const rsses = contents.map((content) => fm(content));
// eslint-disable-next-line no-console

const feed = new RSS({
  title: 'Nush.app Blogposts',
  description: 'Featuring student-written articles on programming and internal events',
  // eslint-disable-next-line @typescript-eslint/camelcase
  feed_url: 'https://nush.app/rss.xml',
  // eslint-disable-next-line @typescript-eslint/camelcase
  site_url: 'https://nush.app',
  language: 'en',
});

rsses.forEach((entry) => {
  const url = `https://nush.app/blog/${entry.attributes.date.getFullYear()}/${String(entry.attributes.date.getMonth() + 1).padStart(2,'0')}/${String(entry.attributes.date.getDate()).padStart(2,'0')}/${entry.attributes.slug}`;
  feed.item({
    title: entry.attributes.title,
    description: marked.parse(entry.body),
    url: url,
    author: entry.attributes.author,
    date: entry.date,
    categories: entry.attributes.tags.map((x) => x.name),
  });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
fs.writeFile('static/rss.xml',feed.xml(),(_) => {});