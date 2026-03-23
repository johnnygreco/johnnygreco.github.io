import beaconImage from '../assets/projects/beacon.png';

export interface Project {
  name: string;
  description: string;
  url: string;
  tags: string[];
  image?: ImageMetadata;
  addedDate: Date;
  hideFromActivity?: boolean;
}

export const projects: Project[] = [
  {
    name: 'beacon',
    description:
      'A lightweight CLI tool for managing and deploying AI agent workflows. Define agent pipelines as config, run them locally or in the cloud, and track every execution with built-in observability.',
    url: 'https://github.com/johnnygreco/beacon',
    tags: ['go', 'cli', 'agents'],
    image: beaconImage,
    addedDate: new Date('2025-01-15'),
  },
  {
    name: 'hugs',
    description:
      'The Huntsman Universe Galaxy Survey — a Python pipeline for detecting ultra-diffuse galaxies in deep imaging data. Built during my PhD to automate the search for the faintest galaxies in the universe.',
    url: 'https://github.com/johnnygreco/hugs',
    tags: ['python', 'astronomy', 'image-processing'],
    addedDate: new Date('2024-06-01'),
  },
  {
    name: 'evalkit',
    description:
      'A lightweight framework for writing and running LLM evaluation suites. Define test cases as YAML, run them against any model provider, and get structured scoring with human-readable reports. Designed for fast iteration during prompt development.',
    url: 'https://github.com/johnnygreco/evalkit',
    tags: ['python', 'evaluation', 'llm'],
    addedDate: new Date('2024-11-20'),
  },
  {
    name: 'astro-dot-grid',
    description:
      'An Astro component for rendering subtle CSS-only dot grid backgrounds with dark mode support. Zero JavaScript, configurable spacing and opacity, designed for personal sites and portfolios.',
    url: 'https://github.com/johnnygreco/astro-dot-grid',
    tags: ['astro', 'css', 'open-source'],
    addedDate: new Date('2025-03-08'),
  },
  {
    name: 'treequery',
    description:
      'A CLI tool for running structural code searches using tree-sitter grammars. Find function definitions, call sites, and import patterns across large codebases without regex. Supports TypeScript, Python, Go, and Rust.',
    url: 'https://github.com/johnnygreco/treequery',
    tags: ['rust', 'cli', 'developer-tools'],
    addedDate: new Date('2025-08-12'),
  },
];
