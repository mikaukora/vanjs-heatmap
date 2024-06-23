import './style.scss'
import van from 'vanjs-core'
import { App } from './App'
;(async () => {
  van.add(document.body, await App())
})()
