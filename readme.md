# tchatche

For chat-like conversation UI

[demo](https://tchatche-example.surge.sh)

## Usage

```typescript
import createBot from 'tchatche'
import { BotConfig } from 'tchatche/dist/types'

const config: BotConfig = {
  // see below
}

const bot = createBot(config)

bot.on('end', ({ conversation, data }) => {

})
```

### `config` object

```typescript
export interface BotConfig {
  container: HTMLElement
  messages: BotMessage[]
  pace?: number
}
```

* `container` is the element to which you want to add the chat.
* `pace` is the speed at which the bot is writing messages. 500 (ms) by default.
* `messages` is an array of "pages".

### `message`

```typescript
export interface BotMessage {
  id: string
  botSays: string[]
  userAction: UserAction
}
```

* `id` is used as a reference to get to that particular message in the flow. Must be unique.
* `botSays` is an array of strings representing what the bot says.
* `userAction` describes what the user can do after the bot has talked.

### `userAction`

```typescript
export interface UserActionInput {
  type: 'input'
  placeholder?: string
  onSubmit: (userInput: string, data: object, setData: (property: string, value: any) => void) => OnSubmitResponse
}

export interface Button {
  label: string
  value: string
}

export interface UserActionButton {
  type: 'buttons'
  buttons: Button[]
  onSubmit: (button: Button, data: object, setData: (property: string, value: any) => void) => OnSubmitResponse
}

export type UserAction = UserActionInput
  | UserActionButton
```

At the moment there are only two possible user actions:

1. An input field
2. A choice of buttons

The `onSubmit` function is triggered when the user has either clicked a button or pressed enter in an input and has the following arguments:

* the value of the input or the clicked button
* the `data` collected so far
* a setter to add any property to `data` (useful for temporary data that needs to be passed between messages)

### `onSubmit` response

`onSubmit` has to be an `async` function returning a `OnSubmitResponse`

```typescript
export interface OnSubmitData {
  nextMessageId: string
  data: { property: string, value: string, label?: string }
}

export interface OnSubmitEnd {
  data: { property: string, value: string, label?: string }
  isEnd: true
}

export type OnSubmitResponse = Promise<OnSubmitData | OnSubmitEnd>
```

It either redirects to another message or ends the conversation. In both cases it has to return the data collected from the user.

## Example



```typescript
import createBot from 'tchatche'
import { BotConfig } from 'tchatche/dist/types'

const config: BotConfig = {
  container: document.body,
  messages: [
    {
      id: 'first',
      botSays: [
        'Hello',
        'What is your name?'
      ],
      userAction: {
        type: 'input',
        onSubmit: async (name: string) =>
          name.length >= 2
            ? { nextMessageId: 'second', data: { property: 'name', value: name } }
            : { nextMessageId: 'first-validation-error', data: { property: 'name', value: name } }
      },
    },
    {
      id: 'first-validation-error',
      botSays: [
        'That is not your name',
        'Seriously...',
        'What is your name?',
      ],
      userAction: {
        type: 'input',
        onSubmit: async (name: string) =>
          name.length >= 2
            ? { nextMessageId: 'second', data: { property: 'name', value: name } }
            : { nextMessageId: 'first-validation-error', data: { property: 'name', value: name } }
      },
    },
    {
      id: 'second',
      botSays: [
        'Thanks',
        'Choose one or two',
      ],
      userAction: {
        type: 'buttons',
        buttons: [
          { value: 'one', label: 'One' },
          { value: 'two', label: 'Two' },
        ],
        onSubmit: async ({ value, label }) =>
          ({ isEnd: true, data: { property: 'choice', value, label } })
      },
    }
  ]
}

const bot = createBot(config)

bot.on('end', ({ conversation, data }) => {
  console.log('done', { conversation, data })
})
```