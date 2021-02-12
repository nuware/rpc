import { isRequest, CalleeErrorType, MethodErrorType } from './common.js'

export const createCallee = () => {
  const handlers = new Map()

  const define = (name, handler) => {
    if (typeof handler !== 'function') {
      throw new Error(`Argument "handler" required and should be a function`)
    }
    handlers.set(name, handler)
  }

  const execute = async (handler, { method, params, id }, meta) => {
    try {
      return await Promise.resolve(handler(params, meta))
    } catch (error) {
      const message = `An unexpected error occurred while executing "${method}" RPC method:`
      console.warn(message, { id, params, error })
      throw error
    }
  }

  const receive = async (payload = {}, meta) => {
    const { id = null, method, params } = payload

    try {
      if (!isRequest(payload)) {
        throw { message: 'Invalid Request', type: CalleeErrorType }
      }

      if (!handlers.has(method)) {
        throw { message: 'Method not found', type: CalleeErrorType }
      }

      const handler = handlers.get(method)

      const result = await execute(handler, { method, params, id }, meta)

      return id ? { id, result, error: null } : null
    } catch (reason) {
      const { message = 'Unexpected error', type = MethodErrorType } = reason
      const error = { message, type }
      return id ? { id, error, result: null } : null
    }
  }

  return {
    define,
    receive,
  }
}
