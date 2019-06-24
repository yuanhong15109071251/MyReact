import React from 'react'
import ReactDom from 'react-dom'
import App from './App'
import MemoryUtils from './utils/memoryUtils'
import {getUser} from './utils/stirageUtils'
import './api'
//读取local保存的user 到内存中

// const user = JSON.parse(localStorage.getItem( "User-key") || '{}' )
const user=getUser()
MemoryUtils.user = user
ReactDom.render(<App/>, document.getElementById('root'))