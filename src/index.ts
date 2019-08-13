import { html, render } from 'lit-html'
import Message from './components/message'
import UserAction from './components/userAction'
import { action, store } from './store'
import { BotConfig } from './types'

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
            return { nextMessageId: 'second', data: { property: 'name', value: name } }
          }
          return { nextMessageId: 'first-validation-error', data: { property: 'name', value: name } }
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
            return { nextMessageId: 'second', data: { property: 'name', value: name } }
          }
          return { nextMessageId: 'first-validation-error', data: { property: 'name', value: name } }
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
          return { nextMessageId: 'first', data: { property: 'choice', value, label } }
        }
      },
    }
  ]
}


const createBot = (config: BotConfig) => {

  store.subscribe(() => {
    const { conversation, current } = store.getState()
    const App = html`
      ${Message(conversation)}
      ${ current ? UserAction(current.userAction) : null }
    `
    render(App, config.container)
  })

  action.init(config.messages)

  return {
    getData: () => store.getState().data
  }
}

const bot = createBot(config)

setTimeout(() => console.log(bot.getData()), 10000)
/*
store.subscribe(() => {
  const { conversation, current } = store.getState()
  const App = html`
    ${Message(conversation)}
    ${ current ? UserAction(current.userAction) : null }
  `
  render(App, config.container)
})

window.addEventListener('load', () => action.init(config.messages))
*/