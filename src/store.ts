import { createStore } from 'redux'
import { Message, BotMessage, UserAction } from './types'

interface State {
  conversation: Message[]
  config: BotMessage[]
  current?: BotMessage
  data: object
}

const defaultState = {
  conversation: [],
  config: [],
  data: {},
}

interface SetDataAction {
  type: 'SET_DATA'
  payload: {
    property: string
    value: string
  }
}

interface SetConfigAction {
  type: 'SET_CONFIG'
  payload: BotMessage[]
}

const isSetConfigAction = (action: Action): action is SetConfigAction =>
  action.type === actionType.SET_CONFIG

const isSetDataAction = (action: Action): action is SetDataAction =>
  action.type === actionType.SET_DATA

interface SetMessageAction {
  type: 'SET_MSG'
  payload: { message: string, isBot?: boolean }
}

const isSetMessageAction = (action: Action): action is SetMessageAction =>
  action.type === actionType.SET_MSG

interface SetCurrentAction {
  type: 'SET_CURRENT'
  payload: BotMessage | undefined
}

const isSetCurrentAction = (action: Action): action is SetCurrentAction =>
  action.type === actionType.SET_CURRENT

type Action = SetDataAction | SetMessageAction | SetCurrentAction | SetConfigAction

export const actionType = {
  SET_DATA: 'SET_DATA',
  SET_MSG: 'SET_MSG',
  SET_CURRENT: 'SET_CURRENT',
  SET_CONFIG: 'SET_CONFIG'
}

const reducer = (state: State = defaultState, action: Action): State => {
  if (isSetConfigAction(action)) {
    return {
      ...state,
      config: action.payload,
    }
  }
  if (isSetDataAction(action)) {
    return {
      ...state,
      data: { ...state.data, [action.payload.property]: action.payload.value }
    }
  }
  if (isSetMessageAction(action)) {
    return {
      ...state,
      conversation: [...state.conversation, action.payload],
    }
  }
  if (isSetCurrentAction(action)) {
    return {
      ...state,
      current: action.payload,
    }
  }
  return state
}

export const store = createStore(reducer)

const runIn = (time: number) => (func: Function) =>
  setTimeout(() => func(), time)

const addMessage = (msg: { message: string, isBot?: boolean }) => {
  store.dispatch({ type: 'SET_MSG', payload: msg })
  runIn(100)(() => {
    const messages = document.getElementsByClassName('message') // TODO not whole document
    const latestMessage = messages[messages.length - 1]
    latestMessage.scrollIntoView({ behavior: 'smooth' })
  })
}

const focusInput = () => {
  // @ts-ignore
  const input: HTMLInputElement = document.getElementsByClassName('user-action-input')[0]
  if (input) {
    runIn(100)(() => input.focus())
  }
}

export const action = {
  init: (messages: BotMessage[]) => {
    store.dispatch({ type: 'SET_CONFIG', payload: messages })
    const first = messages[0]
    if (first) {
      first.botSays.map((message, i) => runIn(500 * i)(() => addMessage({ message, isBot: true })))
      runIn(first.botSays.length * 500)(() => {
        store.dispatch({ type: 'SET_CURRENT', payload: first })
        focusInput()
      })
    }
  },
  userAnswered: ({ nextMessageId, data }: { nextMessageId: string, data?: { property: string, value: string, label?: string }}) => {
    store.dispatch({ type: 'SET_CURRENT', payload: undefined })
    if (data) {
      store.dispatch({ type: 'SET_DATA', payload: data })
      addMessage({ message: data.label || data.value })
    }
    const next = store.getState().config.find(({ id }) => id === nextMessageId)
    if (next) {
      next.botSays.map((message, i) => runIn(500 * i)(() => addMessage({ message, isBot: true })))
      runIn(next.botSays.length * 500)(() => store.dispatch({ type: 'SET_CURRENT', payload: next }))
      runIn((next.botSays.length * 500) + 100)(() => focusInput())
    }
  },
  setData: (property: string, value: any) =>
    store.dispatch({ type: 'SET_DATA', payload: { property, value } }),
}
