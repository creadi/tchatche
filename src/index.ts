import { html, render } from 'lit-html'
import Message from './components/message'
import UserAction from './components/userAction'
import { action, store } from './store'
import { BotConfig, Listener, Message as Msg } from './types'

const config: BotConfig = {
  container: document.body,
  messages: [
    {
      id: 'first',
      botSays: ['Hello', 'world', 'Your name?'],
      userAction: {
        type: 'input',
        onSubmit: (name: string, data, setData) => {
          setData('hello', 'world')
          if (name.length >= 2) {
            return Promise.resolve({ nextMessageId: 'second', data: { property: 'name', value: name } })
          }
          return Promise.resolve({ nextMessageId: 'first-validation-error', data: { property: 'name', value: name } })
        }
      },
    },
    {
      id: 'first-validation-error',
      botSays: ['Seriously, your name?'],
      userAction: {
        type: 'input',
        onSubmit: (name: string, data) => {
          console.log(data)
          if (name.length >= 2) {
            return Promise.resolve({ nextMessageId: 'second', data: { property: 'name', value: name } })
          }
          return Promise.resolve({ nextMessageId: 'first-validation-error', data: { property: 'name', value: name } })
        }
      },
    },
    {
      id: 'second',
      botSays: ['Choose one'],
      userAction: {
        type: 'buttons',
        buttons: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
        ],
        onSubmit: ({ value, label }) => {
          return Promise.resolve({ isEnd: true, data: { property: 'choice', value, label } })
        }
      },
    }
  ]
}

const createBot = (config: BotConfig) => {

  let listeners: Listener[] = []

  store.subscribe(() => {
    const { conversation, current, end, data } = store.getState()

    listeners
      .filter(({ event }) => event === 'render')
      .forEach(({ callback }) => callback({ conversation, data }))

    if (end) {
      listeners
        .filter(({ event }) => event === 'end')
        .forEach(({ callback }) => callback({ conversation, data }))
    }

    const App = html`
      ${Message(conversation)}
      ${ current ? UserAction(current.userAction) : null }
    `
    render(App, config.container)
  })

  action.init(config.messages)

  return {
    on: (event: 'end' | 'render', callback: (d: { conversation: Msg[], data: object }) => void) => {
      listeners.push({ event, callback })
    }
  }
}

const bot = createBot(config)

bot.on('end', ({ conversation, data }) => {
  console.log('done', { conversation, data })
})

bot.on('render', console.log)
