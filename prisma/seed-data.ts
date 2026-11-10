export interface LinkSeed {
  label: string;
  url: string;
}

export interface SkillSeed {
  name: string;
  category: string;
}

export interface ExperienceSeed {
  company: string;
  position: string;
  location?: string;
  /** ISO month: YYYY-MM */
  start: string;
  /** ISO month: YYYY-MM; omit for current position */
  end?: string;
  achievements: string[];
}

export interface ProjectSeed {
  name: string;
  description?: string;
  url: string;
}

export interface ProfileSeed {
  slug: string;
  name: string;
  headline: string;
  description: string;
  location?: string;
  email?: string;
  links: LinkSeed[];
  skills: SkillSeed[];
  experience: ExperienceSeed[];
  projects: ProjectSeed[];
}

export const profileSeed: ProfileSeed = {
  slug: 'stas-kolkovsky',
  name: 'Stanislau Kalkouski',
  headline: 'Senior Full-Stack & Blockchain Engineer',
  description:
    'Blockchain and full-stack engineer with 6+ years of experience shipping production Web3 products across Solana, Substrate, TON and EVM networks. Strong TypeScript / Node.js and React foundation, comfortable owning a product from backend services and chain integration through to the interfaces on top.',
  location: 'Tbilisi, Georgia',
  email: 'stas.kolkovsky@gmail.com',
  links: [
    { label: 'GitHub', url: 'https://github.com/kolkovsky' },
    {
      label: 'LinkedIn',
      url: 'https://www.linkedin.com/in/stanislau-kalkouski',
    },
    { label: 'Telegram', url: 'https://t.me/kolkovsky' },
  ],
  skills: [
    { name: 'Solana', category: 'Blockchain' },
    { name: 'Anchor', category: 'Blockchain' },
    { name: '@solana/web3.js', category: 'Blockchain' },
    { name: 'SPL tokens', category: 'Blockchain' },
    { name: 'Substrate', category: 'Blockchain' },
    { name: 'Polkadot.js', category: 'Blockchain' },
    { name: 'TON', category: 'Blockchain' },
    { name: 'tonconnect-sdk', category: 'Blockchain' },
    { name: 'Solidity', category: 'Blockchain' },
    { name: 'Hardhat', category: 'Blockchain' },
    { name: 'OpenZeppelin', category: 'Blockchain' },
    { name: 'Ethers.js', category: 'Blockchain' },
    { name: 'Web3.js', category: 'Blockchain' },
    { name: 'TypeScript', category: 'Backend' },
    { name: 'JavaScript', category: 'Backend' },
    { name: 'Rust', category: 'Backend' },
    { name: 'Node.js', category: 'Backend' },
    { name: 'Nest.js', category: 'Backend' },
    { name: 'Fastify', category: 'Backend' },
    { name: 'Express.js', category: 'Backend' },
    { name: 'GraphQL', category: 'Backend' },
    { name: 'REST APIs', category: 'Backend' },
    { name: 'WebSockets', category: 'Backend' },
    { name: 'Webhooks', category: 'Backend' },
    { name: 'AWS Lambda', category: 'Backend' },
    { name: 'React.js', category: 'Frontend' },
    { name: 'Next.js', category: 'Frontend' },
    { name: 'Redux Toolkit', category: 'Frontend' },
    { name: 'Vite + Module Federation', category: 'Frontend' },
    { name: 'Material UI', category: 'Frontend' },
    { name: 'SCSS/SASS', category: 'Frontend' },
    { name: 'React Native', category: 'Frontend' },
    { name: 'PostgreSQL', category: 'Data & infrastructure' },
    { name: 'Prisma', category: 'Data & infrastructure' },
    { name: 'Sequelize', category: 'Data & infrastructure' },
    { name: 'S3', category: 'Data & infrastructure' },
    { name: 'Docker', category: 'Data & infrastructure' },
    { name: 'NGINX', category: 'Data & infrastructure' },
    { name: 'Git', category: 'Data & infrastructure' },
    { name: 'GitHub Actions', category: 'Data & infrastructure' },
    { name: 'Claude Code', category: 'AI tooling' },
    { name: 'MCP servers and agent workflows', category: 'AI tooling' },
    { name: 'Custom AI skills', category: 'AI tooling' },
    { name: 'LLM-assisted development', category: 'AI tooling' },
    { name: 'Wallet integrations', category: 'Security' },
    { name: 'OAuth / RBAC', category: 'Security' },
  ],
  experience: [
    {
      company: 'P2P.org',
      position: 'Blockchain Engineer',
      start: '2024-04',
      achievements: [
        'Sole owner of an off-chain service (Rust) that triggers on-chain logic for a Solana DeFi product: scheduled crank execution, protocol fee collection and alerting.',
        'Built the end-to-end test suite and fuzzing harness for a yield vault program written in Anchor, and set up its governance with separate admin and upgrade-authority multisigs.',
        'Work day to day with the Solana account model, PDAs, CPIs and SPL tokens across Rust, Anchor and @solana/web3.js.',
        'Ran a security review of an internal authentication service (Google OAuth, RBAC) shared across the platform.',
        'Owned the Polkadot direction almost single-handedly: DOT staking strategies and a cashback bot.',
        'Built and evolved a non-custodial staking product for Polkadot, Kusama and Avail, covering backend services, the on-chain interaction layer and the user-facing dApp.',
        'Designed and shipped new staking strategies that raised product APR to 17%.',
        'Delivered a staking dApp for the TON network end to end using tonconnect-sdk, shipped in 3 months.',
        'Owned architecture design for new network integrations (indexing, transaction construction and signing flows); structured the frontend as micro-frontends with Vite + Module Federation.',
        'Built agent workflows and MCP integrations that automate repetitive parts of the development cycle.',
        'Authored custom AI skills for the team and drove their adoption into day-to-day engineering practice.',
      ],
    },
    {
      company: 'Vention',
      position: 'Senior Software Engineer / Tech Lead',
      start: '2022-04',
      end: '2024-04',
      achievements: [
        'Led architecture and tech-stack decisions across four products, mentored engineers and enforced code quality through review.',
        'Designed and shipped Solidity smart contracts (ERC-20, ERC-721, ERC-1155) with Hardhat and OpenZeppelin; deployed to private Proof-of-Authority networks using geth.',
        'Built and launched an NFT marketplace with auctions, direct sales and custom avatar stickers.',
        'Built REST APIs and serverless functions (Node.js, Nest.js, AWS Lambda) and designed the PostgreSQL schemas behind them.',
        'Integrated Stripe for payment processing and built webhook listeners for third-party services.',
        'Delivered React.js frontends with Redux Toolkit and Material UI, including browser-wallet integration (MetaMask, WalletConnect) and auth flows via Magic Link and Keycloak.',
      ],
    },
    {
      company: 'Aetsoft Inc.',
      position: 'Software Engineer',
      start: '2020-08',
      end: '2022-03',
      achievements: [
        'Wrote, tested and deployed Solidity contracts for ERC-20 conversion and ERC-721 minting and trading, plus voting, referral and explorer modules on Graphene-based chains; migrations and automated tests with Truffle.',
        'Built Node.js services for HealthKit data ingestion, activity-point scoring and token balance management behind a fitness-rewards app.',
        'Implemented NFT marketplace order-book handling and minting interfaces with Next.js, React, Web3.js, Ethers.js, WalletConnect and Infura.',
        'Built mobile interfaces in React Native and web UIs for NFT collection launches and marketplaces; containerised services with Docker behind an NGINX reverse proxy.',
      ],
    },
    {
      company: 'Netcracker Inc.',
      position: 'Software Engineer',
      start: '2019-01',
      end: '2020-07',
      achievements: [
        'Built and customised a telecom BSS portal in Angular (catalogue, order entry, billing history and account dashboard components); integrated the Liferay portal framework and connected the UI to backend REST services.',
      ],
    },
  ],
  projects: [
    {
      name: 'Digital Business Card API',
      description:
        'This project: NestJS + GraphQL + Prisma + PostgreSQL backend with batched nested resolvers.',
      url: 'https://github.com/kolkovsky/it-solutions-assignment',
    },
  ],
};
