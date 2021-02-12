import { createCaller } from './caller.js'

import { createCallee } from './callee.js'

export const VERSION = '[VI]{version}[/VI]'

export { createCaller, createCallee }

export const createRPC = ({ callee, caller }) => {
  const define = callee.define

  const invoke = caller.invoke

  const notify = caller.notify

  const receive = async (payload, meta = {}) => {
    if (isResponse(payload)) {
      return caller.receive(payload)
    }

    if (isRequest(payload)) {
      const response = await callee.receive(payload, meta.callee)
      if (response) {
        return caller.send(response, meta.caller)
      }
    }

    throw { message: 'Received an invalid RPC message', type: CallerErrorType }
  }

  return {
    define,
    receive,
    invoke,
    notify,
    callee,
    caller,
  }
}
