export const ERROR = Object.freeze({
  UNKNOWN: 'UNKNOWN',
  METADATA_NO_CREATORS: 'METADATA_NO_CREATORS',
} as const)

export type ProjectError = typeof ERROR[keyof typeof ERROR]
