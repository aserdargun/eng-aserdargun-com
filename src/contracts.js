import contractVersions from './versions.json' with { type: 'json' };

// ENG runs no experiment, world model, simulator, or scoring engine.
export const CONTRACT_VERSIONS = Object.freeze(contractVersions);
export const versions = CONTRACT_VERSIONS;
