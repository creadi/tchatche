import { html } from 'lit-html'
import { Message } from '../types'

const message = ({ message, isBot }: Message) =>
  html`
    <div class="message ${isBot ? 'bot-message' : 'user-message'}">
      ${message}
    </div>
  `

export default (messages: Message[]) =>
  messages.map(message)