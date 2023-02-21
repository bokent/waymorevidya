export const ERROR = Object.freeze({
  UNKNOWN: 'UNKNOWN',
  METADATA_NO_CREATORS: 'METADATA_NO_CREATORS'
} as const)

export type ErrorCode = typeof ERROR[keyof typeof ERROR]

export const SUCCESS = Object.freeze({
  MINTED: 'MINTED'
} as const)

export type SuccessCode = typeof ERROR[keyof typeof ERROR]
