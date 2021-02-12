import { nextId, isResponse, CallerErrorType } from './common.js'

export const createCaller = ({ send, createId = nextId } = {}) => {
  if (typeof send !== 'function') {
    throw new Error(`Property "send" required and should be a function`)
  }

  if (typeof createId !== 'function') {
    throw new Error(`Property "createId" required and should be a function`)
  }

  const requests = new Map()

  const receive = (response) => {
    const accept = requests.get(response.id)
    if (accept) {
      requests.delete(response.id)
      accept(response)
    }
  }

  const execute = async ({ method, params, id = null }, meta) => {
    const promise = new Promise((accept) => {
      id && requests.set(id, accept)
    })

    send({ method, params, id }, meta)
    return await promise
  }

  const invoke = async ({ method, params }, meta) => {
    try {
      const id = createId()
      const response = await execute({ method, params, id }, meta)

      if (!isResponse(response)) {
        throw { message: 'Invalid response format', type: CallerErrorType }
      }

      if (response.error) {
        throw response.error
      }

      return response.result
    } catch (error) {
      throw error
    }
  }

  const notify = async ({ method, params }, meta) => {
    try {
      const id = null
      send({ method, params, id }, meta)
    } catch (error) {}
  }

  const cleanup = () => {
    for (const id of requests.keys()) {
      const error = { message: 'Pending request is aborted', type: CallerErrorType }
      const payload = { error, result: null, id }
      receive(payload)
    }
  }

  return {
    invoke,
    notify,
    receive,
    cleanup,
    send,
  }
}
