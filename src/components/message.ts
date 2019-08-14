import { html } from 'lit-html'
import { Message } from '../types'

const message = ({ message, isBot }: Message) =>
  html`
    <div class="message-container">
      <div class="message ${isBot ? 'bot-message' : 'user-message'}">
        ${message}
      </div>
    </div>
  `

export default (messages: Message[]) =>
  html`
    <div id="tchatche-messages">
      ${messages.map(message)}
    </div>
  `