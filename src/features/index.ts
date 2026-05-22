import type { ScaffoldConfig, FeatureChoice } from '../types.js';
import { applyDocker } from './docker.js';
import { applyCicd } from './cicd.js';
import { applyLinting } from './linting.js';
import { applyAuth } from './auth.js';

const featureHandlers: Record<FeatureChoice, (config: ScaffoldConfig) => Promise<void>> = {
  docker: applyDocker,
  cicd: applyCicd,
  linting: applyLinting,
  auth: applyAuth,
};

export async function applyFeatures(config: ScaffoldConfig): Promise<void> {
  for (const feature of config.features) {
    await featureHandlers[feature](config);
  }
}
