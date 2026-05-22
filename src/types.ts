export type StackChoice = 'react-spa' | 'nextjs' | 'node-express' | 'node-hono';

export type FeatureChoice = 'docker' | 'cicd' | 'linting' | 'auth';

export interface ScaffoldConfig {
  projectName: string;
  stack: StackChoice;
  features: FeatureChoice[];
  targetDir: string;
}

export interface StackInfo {
  name: string;
  description: string;
  repo: string;
}

export interface FeatureInfo {
  name: string;
  description: string;
}
