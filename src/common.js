export const isRequest = ({ method, error, result }) =>
  method !== undefined && error === undefined && result === undefined

export const isResponse = ({ error, result, method }) =>
  method === undefined && error !== undefined && result !== undefined

export const nextId = ((id) => () => ++id)(0)

export const CalleeErrorType = 'RPC:CalleeError'
export const CallerErrorType = 'RPC:CallerError'
export const MethodErrorType = 'RPC:MethodError'
