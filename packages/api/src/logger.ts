function info(msg: string, ...rest: unknown[]) {
  console.info(msg, ...rest)
}

function debug(msg: string, ...rest: unknown[]) {
  console.debug(msg, ...rest)
}

function warn(msg: string, ...rest: unknown[]) {
  console.warn(msg, ...rest)
}

function error(msg: string, ...rest: unknown[]) {
  console.error(msg, ...rest)
}

export default {
  info,
  debug,
  warn,
  error,
}
