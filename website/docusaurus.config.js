/** @type {import('@docusaurus/types').Config} */
(
  module.exports = {
    title: 'Flapjack SDK Automation',
    tagline: 'Documentation for the SDK automation repository',
    url: 'https://api-clients-automation.netlify.app/',
    baseUrl: '/',
    favicon: 'img/logo-small.svg',
    organizationName: 'Flapjack',
    projectName: 'Flapjack SDK Automation',
    onBrokenLinks: 'throw',

    presets: [
      [
        '@docusaurus/preset-classic',
        /** @type {import('@docusaurus/preset-classic').Options} */
        ({
          docs: {
            path: 'docs',
            sidebarPath: 'sidebars.js',
            editUrl: 'https://github.com/flapjackhq/sdk-automation/edit/main/website/',
            showLastUpdateAuthor: true,
            showLastUpdateTime: true,
          },
          blog: false,
          theme: {
            customCss: require.resolve('./src/css/custom.css'),
          },
        }),
      ],
    ],

    themeConfig:
      /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
      ({
        navbar: {
          title: 'Flapjack SDK Automation',
          logo: {
            alt: 'Flapjack',
            src: 'img/logo-small.svg',
            srcDark: 'img/logo-small.svg',
          },
          items: [
            {
              label: 'Contributing',
              to: 'docs/introduction',
              position: 'left',
            },
            {
              label: 'Flapjack API clients documentation',
              href: 'https://docs.flapjack.io/',
              position: 'right',
            },
            {
              href: 'https://github.com/flapjackhq/sdk-automation',
              position: 'right',
              className: 'header-github-link',
            },
          ],
        },
        colorMode: {
          defaultMode: 'light',
          disableSwitch: false,
          respectPrefersColorScheme: true,
        },
        footer: {
          style: 'dark',
          links: [
            {
              label: 'GitHub',
              to: 'https://github.com/flapjackhq/sdk-automation',
            },
            {
              label: 'Flapjack Website',
              to: 'https://flapjack.io/',
            },
            {
              label: 'Flapjack Documentation',
              to: 'https://docs.flapjack.io/',
            },
          ],
          copyright: `Copyright © ${new Date().getFullYear()} Flapjack | Built with Docusaurus.`,
        },
      }),
    markdown: {
      hooks: {
        onBrokenMarkdownLinks: 'throw',
        onBrokenMarkdownImages: 'throw',
      },
    },
  }
);
