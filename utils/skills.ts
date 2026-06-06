export type Skill = {
  name: string;
  icon: string;
  iconClass?: string;
};

export type SkillCategory = {
  title: string;
  skills: Skill[];
};

export const skillCategories: SkillCategory[] = [
  {
    title: "Frontend & Frameworks",
    skills: [
      {
        name: "React.js",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
      },
      {
        name: "Vue.js",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg",
      },
      {
        name: "Nuxt 3",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nuxtjs/nuxtjs-original.svg",
      },
      {
        name: "Next.js",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
        iconClass: "brightness-0 invert",
      },
      { name: "Shadcn UI", icon: "https://cdn.simpleicons.org/shadcnui/white" },
      {
        name: "Tailwind CSS",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg",
      },
      {
        name: "JavaScript",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
      },
      {
        name: "TypeScript",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
      },
    ],
  },
  {
    title: "Backend & Data",
    skills: [
      {
        name: "Node.js",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
      },
      { name: "Express.js", icon: "https://cdn.simpleicons.org/express/white" },
      {
        name: "MongoDB",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
      },
      { name: "Axios", icon: "https://cdn.simpleicons.org/axios/white" },
      {
        name: "Pinia / Redux",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg",
      },
      { name: "i18n", icon: "https://cdn.simpleicons.org/i18next/white" },
    ],
  },
  {
    title: "CMS & Builders",
    skills: [
      {
        name: "WordPress",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/wordpress/wordpress-plain.svg",
        iconClass: "brightness-0 invert",
      },
      {
        name: "Elementor Pro",
        icon: "https://cdn.simpleicons.org/elementor/white",
      },
      { name: "Divi", icon: "https://cdn.simpleicons.org/wordpress/white" },
      { name: "WPBakery", icon: "https://cdn.simpleicons.org/wordpress/white" },
      { name: "Shopify", icon: "https://cdn.simpleicons.org/shopify/white" },
      { name: "Webflow", icon: "https://cdn.simpleicons.org/webflow/white" },
    ],
  },
  {
    title: "Design & Tools",
    skills: [
      {
        name: "Figma",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg",
      },
      {
        name: "Photoshop",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/photoshop/photoshop-line.svg",
        iconClass: "brightness-0 invert",
      },
      {
        name: "Illustrator",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/illustrator/illustrator-line.svg",
        iconClass: "brightness-0 invert",
      },
      {
        name: "Git",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
      },
    ],
  },
  {
    title: "AI Tools",
    skills: [
      {
        name: "ChatGPT",
        icon: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/openai.svg",
        iconClass: "brightness-0 invert",
      },
      { name: "Claude", icon: "https://cdn.simpleicons.org/claude/white" },
      {
        name: "Gemini",
        icon: "https://cdn.simpleicons.org/googlegemini/white",
      },
      { name: "DeepSeek", icon: "https://cdn.simpleicons.org/deepseek/white" },
      {
        name: "Codex",
        icon: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/openai.svg",
        iconClass: "brightness-0 invert",
      },
      {
        name: "GitHub Copilot",
        icon: "https://cdn.simpleicons.org/githubcopilot/white",
      },
    ],
  },
];

export const skills = skillCategories.flatMap((category) => category.skills);
