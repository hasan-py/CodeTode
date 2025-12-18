import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const config: Config = {
  title: "CodeTode",
  tagline:
    "Build A Micro Learning Platform Project with this documentation with ease",
  favicon: "img/favicon.ico",

  markdown: {
    mermaid: true,
  },

  themes: ["@docusaurus/theme-mermaid"],

  future: {
    v4: true,
  },

  url: `https://github.com`,
  baseUrl: "",

  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ["rss", "atom"],
            xslt: true,
          },
          onInlineTags: "warn",
          onInlineAuthors: "warn",
          onUntruncatedBlogPosts: "warn",
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: "img/docusaurus-social-card.jpg",
    navbar: {
      title: "CodeTode",
      logo: {
        alt: "CodeTode Logo",
        src: "img/logo.svg",
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "tutorialSidebar",
          position: "left",
          label: "Documentation",
        },
        {
          href: "https://github.com/hasan-py/CodeTode",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Docs",
          items: [
            {
              label: "Start here",
              to: "/docs/Overview",
            },
          ],
        },
        {
          title: "Community",
          items: [
            {
              label: "Youtube",
              href: "https://www.youtube.com/@hasan-py",
            },
            {
              label: "Discord",
              href: "https://discord.gg/gjUEzqcTSz",
            },
            {
              label: "X",
              href: "https://x.com/hasan_py",
            },
          ],
        },
      ],
      copyright: `Copyright © CodeTode, Built with ❤️ by Hasan.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
