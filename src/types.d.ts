export interface OnSubmitResponse {
  nextMessageId: string
  data?: { property: string, value: string, label?: string }
}

export interface UserActionInput {
  type: 'input'
  placeholder?: string
  onSubmit: (userInput: string) => OnSubmitResponse
}

export interface Button {
  label: string
  value: string
}

export interface UserActionButton {
  type: 'buttons'
  buttons: Button[]
  onSubmit: (button: Button) => OnSubmitResponse
}

export type UserAction = UserActionInput
  | UserActionButton

export interface BotMessage {
  id: string
  botSays: string[]
  userAction: UserAction
}

export interface BotConfig {
  container: HTMLElement
  messages: BotMessage[]
}

export interface Message {
  message: string
  isBot?: boolean
}