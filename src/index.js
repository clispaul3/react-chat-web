import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Ajax } from '@/public/ajax'
import { DOMController } from '@/class/DOMController'
import { Group } from '@/class/Group'
import { Friend } from '@/class/Friend'
import emojiObj from '@/rongcloud/emojiInit'
import store from '@/store/store.js'
import Index from '@/pages/index'
import axios from 'axios'
import $ from 'jquery'


window.Ajax = Ajax
window.DOMController = DOMController
window.Friend = Friend
window.emojiObj = emojiObj
window.axios = axios
window.$ = $
const App = document.querySelector('#app')
const testUserArr = [{mobile:'13400000004',password:'111111'},
    {mobile:'13265987092',password:'13265987092'}]
const user = Object.assign(testUserArr[0],{login_type:'mobile'})
Ajax.login(user,res=>{
    ReactDOM.render(
        <Provider store={store}>
            <Index></Index>
        </Provider>
    ,App)
})
