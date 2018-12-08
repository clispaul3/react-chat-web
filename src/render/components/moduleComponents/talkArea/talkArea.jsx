import React from 'react'
import { connect } from 'react-redux'
import style_talkArea from './talkArea.scss'
import GroupInfo from './group'
import { Group } from '@/class/Group'
import store from '@/store/store'
import { SendMsgArea } from './sendMsgArea'
import { getFriendInfo,getGroupInfo,getGroupNotice } from '@/store/action'
import { MessageList } from '@module/messageList/messageList'
import { ModalBeforeFiveDaysMsg } from '@module/modalBox/beforeFiveDaysMsg'
export class TalkArea extends React.Component{
    constructor(props){
       super(props)
    }

		showFriendInfo(){
			  const { targetId } = this.props.currentConversation
				Friend.getFriendInfo(targetId).then(info=>{
					  store.dispatch(getFriendInfo(info))
						DOMController.showModalBox([{selector:'#user-info',display:'block'}])
				})
		}
		showGroupInfo(){
				const { targetId } = this.props.currentConversation
				Group.getGroupInfo(targetId).then(info=>{
					  store.dispatch(getGroupInfo(info))
				})
				axios.get('/weinong' + '/v1/group/notice',{
						params:{
							  token:Ajax.user_token,
							  group_id:targetId
					  }
				}).then(notice=>{
					  if(notice.data.status=='1'){
							  store.dispatch(getGroupNotice(notice.data.data))
						}
				})
				DOMController.showModalBox([{selector:'.group-info-',display:'block'}])

		}
		renderConNickname(){
			  if(this.props.currentConversation){
					  const { conversationType } = this.props.currentConversation
						if(conversationType=='PRIVATE'){
							  return <span className={'iconfont icon-geren1'} onClick={this.showFriendInfo.bind(this)}></span>
						}
						if(conversationType=='GROUP'){
							  return <span className={'iconfont icon-qunmingpian'} onClick={this.showGroupInfo.bind(this)}></span>
						}
				}
		}
    render(){
        return <div id="talk-area">
            <div className="top">
                {<span className={'con-nickname'}>{this.props.currentConversation ? this.props.currentConversation.nickname : ''}</span>}
                {this.renderConNickname.bind(this)()}
            </div>
            <MessageList messageList={this.props.conMessageList}></MessageList>
            <GroupInfo></GroupInfo>
						<SendMsgArea></SendMsgArea>
            <ModalBeforeFiveDaysMsg></ModalBeforeFiveDaysMsg>
        </div>
    }
}
const mapState = (state)=>{return {groupInfo:state.groupInfo,
  currentConversation:state.currentConversation,conMessageList:state.conMessageList}}
export default connect (mapState)(TalkArea)
