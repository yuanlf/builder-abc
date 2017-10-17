import React from 'react'
import ReactDOM, { render } from 'react-dom'
import Demo from 'demo/index'

const mountNode = document.querySelector('#app')

render(
  <Demo />,
  mountNode
)