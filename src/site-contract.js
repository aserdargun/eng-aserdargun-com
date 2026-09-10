// Only the behavior and artifact export exist in this static manifesto.
// null explicitly means no executable experiment, world, simulation, or metric schema.
export const SCHEMA_VERSIONS = Object.freeze({
  behavior: 2,
  experiment: null,
  world: null,
  simulation: null,
  metric: null,
  export: 1,
});
