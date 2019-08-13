import { html } from 'lit-html'
import { Button, UserAction, UserActionButton, UserActionInput, OnSubmitResponse } from '../types'
import { action, store } from '../store'

const getData = () => store.getState().data

const isButtonAction = (action: UserAction): action is UserActionButton =>
  action.type === 'buttons'

const isInputAction = (action: UserAction): action is UserActionInput =>
  action.type === 'input'

const onClick = (button: Button, onSubmit: (button: Button, data: any, setData: (property: string, value: any) => void) => OnSubmitResponse) => () =>
  action.userAnswered(onSubmit(button, getData(), action.setData))

const button = (onSubmit: (button: Button, data: any, setData: (property: string, value: any) => void) => OnSubmitResponse) =>
  (button: Button) =>
    html`
      <button
        class="user-action user-action-button"
        @click=${ onClick(button, onSubmit) }
        >${button.label}</button>
    `

const buttons = ({ buttons, onSubmit }: UserActionButton) =>
  buttons.map(button(onSubmit))

const onKeyUp = (onSubmit: (userInput: string, data: any, setData: (property: string, value: any) => void) => OnSubmitResponse) =>
  (e: any) => {
    if (e.key === 'Enter') {
      action.userAnswered(onSubmit(e.target.value, getData(), action.setData))
      e.target.value = ''
    }
  }

const input = ({ placeholder, onSubmit }: UserActionInput) =>
  html`
    <input
      class="user-action user-action-input"
      placeholder=${ placeholder || ''}
      @keyup=${ onKeyUp(onSubmit) }
      />
  `

const inputType = (action: UserAction) => {
  if (isButtonAction(action)) {
    return buttons(action)
  }
  if (isInputAction(action)) {
    return input(action)
  }
  return null
}


export default (action: UserAction) =>
  html`
    <div class="user-action-container">
      ${ inputType(action) }
    </div>`