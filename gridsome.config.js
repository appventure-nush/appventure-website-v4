const path = require('path');

function addStyleResource (rule) {
  rule.use('style-resource')
    .loader('style-resources-loader')
    .options({
      patterns: [
        path.resolve(__dirname, './src/assets/styles/base/_variables.scss'),
        // you can also use a glob if you'd prefer
        //path.resolve(__dirname, './src/assets/styles/**/*.scss'),
      ],
    });
}

module.exports = {
  siteName: 'AppVenture',
  icon: 'src/assets/favicon.png',
  plugins: [
    { use: 'gridsome-plugin-typescript' },
    {
      use: '@gridsome/source-filesystem',
      options: {
        typeName: 'BlogPost',
        path: 'content/blog/**/*.md',
        refs: {
          author: 'Contributor',
          tags: 'Tag',
        },
        remark: {
          plugins: [['@gridsome/remark-prismjs', {transformInlineCode: true}],'gridsome-remark-katex','remark-attr'],
        },
      },
    },

    {
      use: '@gridsome/source-filesystem',
      options: {
        typeName: 'Event',
        path: 'content/events/**/*.yaml',
        refs: {
          tags: 'Tag',
        },
      },
    },

    {
      use: '@gridsome/source-filesystem',
      options: {
        typeName: 'Project',
        path: 'content/projects/**/*.yaml',
        refs: {
          tags: 'Tag',
          allContributors: 'Contributor',
        },
      },
    },

    {
      use: 'gridsome-plugin-rss',
      options: {
        contentTypeName: 'BlogPost',
        latest: true,
        maxItems: 20,
        feedOptions: {
          title: 'nush.app Blogposts',
          description: 'Featuring student-written articles on programming and internal events',
          feed_url: 'https://nush.app/rss.xml',
          site_url: 'https://nush.app',
          language: 'en',
        },
        feedItemOptions: (node) => {
          const url = `https://nush.app/blog/${node.date.getFullYear()}/${String(node.date.getMonth() + 1).padStart(2,'0')}/${String(node.date.getDate()).padStart(2,'0')}/${node.slug}`;
          const marked = require('marked')
          return {
            title: node.title,
            description: marked.parse(node.content),
            url: url,
            author: node.author.map((x) => x.name)[0],
            date: node.date,
            category: node.tags.map((x) => x.name),
          };
        },
        output: {
          dir: './dist',
          name: 'rss.xml'
        }
      }
    }

  ],
  templates: {
    BlogPost: '/blog/:year/:month/:day/:slug',
    Contributor: '/contributor/:id',
    Event: '/events/:id',
    Project: '/projects/:id',
  },
  chainWebpack (config) {
    // Load variables for all vue-files
    const types = ['vue-modules', 'vue', 'normal-modules', 'normal'];

    // or if you use scss
    types.forEach((type) => {
      addStyleResource(config.module.rule('scss').oneOf(type));
    });
  },
};
