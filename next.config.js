/**
 * @type {import('next').NextConfig}
 */
module.exports = {
  i18n: {
    locales: ['en'],
    defaultLocale: 'en'
  },
  async redirects() {
    return [
      {
        source: '/blog',
        destination: 'https://diffingdiffs.blogspot.com/',
        permanent: false,
      },
      {
        source: '/linkedin',
        destination: 'https://www.linkedin.com/in/david-barnett-bb22b636/',
        permanent: false,
      },
      {
        source: '/facebook',
        destination: 'https://facebook.com/mu.mind',
        permanent: false,
      },
      {
        source: '/twitter',
        destination: 'https://twitter.com/mu_mind',
        permanent: false,
      },
      {
        source: '/goodreads',
        destination: 'https://www.goodreads.com/review/list/104875950-david-barnett',
        permanent: false,
      }
    ];
  },
};
