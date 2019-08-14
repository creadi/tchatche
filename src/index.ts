import { html, render } from 'lit-html'
import Message from './components/message'
import UserAction from './components/userAction'
import { action, store } from './store'
import { BotConfig, Listener, Message as Msg } from './types'

const createBot = (config: BotConfig) => {

  let listeners: Listener[] = []

  store.subscribe(() => {
    const { conversation, current, end, data } = store.getState()

    if (end) {
      listeners
        .filter(({ event }) => event === 'end')
        .forEach(({ callback }) => callback({ conversation, data }))
    }

    const App = html`
      <div id="tchatche-container">
        ${Message(conversation)}
        ${ current ? UserAction(current.userAction) : null }
      </div>
    `
    render(App, config.container)
  })

  action.init(config.messages, config.pace)

  return {
    on: (event: 'end', callback: (d: { conversation: Msg[], data: object }) => void) => {
      listeners.push({ event, callback })
    }
  }
}

export default createBot
