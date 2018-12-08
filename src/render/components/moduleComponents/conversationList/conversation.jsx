import React from 'react'
import { UserPortrait } from '@base/userPortrait/userportrait'
import { getHistoryMessage } from '@/rongcloud/getHistoryMessage'
import { clearUnreadCount } from '@/rongcloud/clearUnreadCount'
import { formatTime } from '@/utils/formatTime'
import { toggleCurrentConversation,getGroupInfo,updateConversationUnreadCount,
  clearConMessageList } from '@/store/action'
import store from '@/store/store'
import _ from 'lodash'
import { MessageType } from '@/rongcloud/MessageType'
import { Group } from '@/class/Group'
/**
 * 切换当前会话的入口：1）点击某个会话 2）点击发消息的入口  其他方式都不能切换当前会话，不通过接收消息切换当前会话
 */
export class Conversation extends React.Component{
    constructor(props){
       super(props)
    }
	toggleConversation(){
	  const { targetId } = this.props.conversation
		const { conversationList } = store.getState()
		const currentCon = _.find(conversationList,(con)=>con.targetId==targetId)
		if(currentCon){
      store.dispatch(clearConMessageList())
			getHistoryMessage(targetId,0).then(res=>{
        // console.log(res.list)
				if(res.list.length>0){
					_.forEach(res.list,item=>new MessageType(item,'toggle-conversation'))
				}
        let timer = window.setTimeout(()=>{
          window.scrollMessageList.scrollToBottom()
          clearTimeout(timer)
        },100)
			})
		  DOMController.closeAllModalBox()
			if(currentCon.unreadCount>0){
				  clearUnreadCount(targetId)
					store.dispatch(updateConversationUnreadCount(targetId,0))
			}
		  store.dispatch(toggleCurrentConversation(currentCon))
			if(currentCon.conversationType=='GROUP'){
				  Group.getGroupInfo(targetId).then(res=>{
            store.dispatch(getGroupInfo(res))
          })
			}
			let conDivs = document.getElementsByClassName('conversation-')
			for(let div of conDivs){
				  div.classList.remove('current-con')
			}
			this.refs.current.classList.add('current-con')
			$('.logo-image').hide()
			DOMController.controlLeftNavIcon(0)
		}
	}

	sentTime(){
		  if(this.props.conversation.latestMsg){
				  return <span className={'sent-time'}>
					    {formatTime(this.props.conversation.sentTime)}
					  </span>
			}else{
				  return ''
			}
	}
	unreadCount(){
		  let unreadCount = this.props.conversation.unreadCount
			if(unreadCount>0){
				  let count = unreadCount>99 ? '99+' : unreadCount
				  return <span className={'unread-count'}>{count}</span>
			}
	}
  render(){
		return <div className={"conversation-"} onClick={this.toggleConversation.bind(this)} ref="current" data-id={this.props.conversation.targetId}>
				<UserPortrait userInfo={this.props.conversation} size={'default'}
						showEl={[{selector:'#user-info',display:'block'}]} prevent={'1'}></UserPortrait>
				<span className={'nickname'}>{this.props.conversation.nickname}</span>
				{this.sentTime.bind(this)()}
				<p>
				    <span className={'sender-name'}>{this.props.conversation.senderName ? (this.props.conversation.senderName + ': ') : ''}</span>
						<span className={'latest-msg'}>{this.props.conversation.latestMsg}</span>
				</p>
				{this.unreadCount.bind(this)()}
		</div>
  }
}
