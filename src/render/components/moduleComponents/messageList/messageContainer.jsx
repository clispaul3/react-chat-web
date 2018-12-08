import React from 'react'
import { UserPortrait } from '@base/userPortrait/Userportrait'
import { Friend } from '@/class/Friend'
import store from '@/store/store'
import _ from 'lodash'
import msgListStyle from './message.scss'
import { formatMsgSentTime } from '@/public/formatMsgSentTime'
import '@static/lib/jquery.magnify.min.js'
import $ from 'jquery'
/**
   消息展示类型：
     1）展示类消息
     2）提示类消息
   消息展示内容：
     1）消息时间 2）消息内容 3）发送者头像
   props:
     showMsgSentTime(String): '1' 显示 ‘0’ 不显示
*/
export class MessageContainer extends React.Component{
    constructor(props) {
        super(props)
        this.state = {
          userInfo:store.getState().userInfo,
          imageUri:'',
          commonObjName:['RC:TxtMsg','RC:ImgMsg','RC:FileMsg','RC:VcMsg','RC:LBSMsg',
            'WY:CallNotificationMessage','RC:SightMsg','RCBQMM:GifMsg','RCBQMM:EmojiMsg'],
          specialObjName:['RC:CardMsg','RC:GrpNtf','WY:FriendHandle','WY:UploadpicNotification',
            'WY:IdentityNotification'],
          receiveOrSendMsg:['RC:StkMsg','RCBQMM:EmojiMsg','RC:CardMsg','RC:SightMsg',
            'WY:ShareReportMessage','RCBQMM:GifMsg','WY:CallNotificationMessage',
            'RC:VcMsg','WY:RedPacketMessage','WY:RedPacketHandleMessage',
            'WY:RedPacketAcknowledgeMessage']
        }
    }
    componentDidUpdate(){
      $("[data-magnify=gallery]").magnify({
        callbacks: {
          opened: function(el){
            $('.magnify-modal i.icon-xiazai1').hide()
          }
        }
      })
    }
    componentWillReceiveProps(){
      const { objectName } = this.props.message
      if(objectName=='RC:ImgMsg'){
        const { imageUri } = this.props.message.content
        this.setState({imageUri})
      }
    }
    renderMsgSentTime(){
      const { sentTime } = this.props.message
      const { showMsgSentTime } = this.props
      if(showMsgSentTime=='1'){
        return <p className={'msg-sent-time'}>{formatMsgSentTime(sentTime)}</p>
      }else{
        return <p className={'msg-sent-time'}></p>
      }

    }
    renderMsgContent(){
      const { objectName } = this.props.message
      if(objectName=='RC:TxtMsg'){
        const { content } = this.props.message.content
        return <p className={'text-message'}>
            {RongIMLib.RongIMEmoji.symbolToEmoji(content)}
          </p>
      }
      if(objectName=='RC:ImgMsg'){
        const { imageUri } = this.props.message.content
        return <div className={'image-message'}>
            <img src={imageUri} data-magnify="gallery" data-src={imageUri}/>
          </div>
      }
      if(objectName=='RC:LBSMsg'){
        const { senderUserId } = this.props.message
        return <p className={'group-notification-message'}>
            {(senderUserId==this.state.userInfo.uuid ? '发出' : '收到') + '定位消息，请在手机上查看'}
          </p>
      }
      if(objectName=='RC:VcMsg'){
        const { senderUserId } = this.props.message
        return <p className={'group-notification-message'}>
            {(senderUserId==this.state.userInfo.uuid ? '发出' : '收到') + '语音消息，请在手机上查看'}
          </p>
      }
      if(this.state.receiveOrSendMsg.indexOf(objectName)>=0){
        return <p className={'group-notification-message'}>
            {this.props.message.content.content}
          </p>
      }

      if(objectName=='RC:GrpNtf'){
        const { operation,operatorUserId } = this.props.message.content
        const { operatorNickname } = this.props.message.content.data
        if(operation=='Add'){
          const {targetUserDisplayNames} = this.props.message.content.data
          return <p className={'group-notification-message'}>
              {(this.state.userInfo.uuid == operatorUserId ? '你' : operatorNickname) + '邀请' + targetUserDisplayNames.join(',') + '加入群聊'}
            </p>
        }
        if(operation=='Kicked'){
          const {targetUserDisplayNames} = this.props.message.content.data
          return <p className={'group-notification-message'}>
              {(this.state.userInfo.uuid == operatorUserId ? '你' : operatorNickname) + '将' + targetUserDisplayNames.join(',') + '移出群聊'}
            </p>
        }
        if(operation=='Rename'){
          const { targetGroupName } = this.props.message.content.data
          return <p className={'group-notification-message'}>
              {(this.state.userInfo.uuid == operatorUserId ? '你' : operatorNickname) + '修改群名称为：' + targetGroupName}
            </p>
        }
        if(operation=='Quit'){
          const {targetUserDisplayNames} = this.props.message.content.data
          return <p className={'group-notification-message'}>
              {targetUserDisplayNames.join(',') + '退出了群聊'}
            </p>
        }
      }
    }
    renderMsgPortrait(){
      const { messageDirection,conversationType,targetId,senderUserId,objectName } = this.props.message
      const { friendList,groupInfo } = store.getState()
      const showEl = [{selector:'#user-info',display:'block'}]
      if(this.state.receiveOrSendMsg.indexOf(objectName)>=0 || objectName=='RC:LBSMsg' || objectName=='RC:VcMsg'){
        return
      }
      if(conversationType==1){
        if(messageDirection==1){
          return <UserPortrait userInfo={this.state.userInfo} showEl={showEl}></UserPortrait>
        }else{
          const friendInfo = _.find(friendList,item => item.targetId==targetId)
          return <UserPortrait userInfo={friendInfo} showEl={showEl}></UserPortrait>
        }
      }
      if(conversationType==3){
        if(objectName=='RC:GrpNtf'){
          return
        }
        if(messageDirection==1){
          return <UserPortrait userInfo={this.state.userInfo} showEl={showEl}></UserPortrait>
        }else{
          const memberInfo = groupInfo ? _.find(groupInfo.members,item => item.uuid == senderUserId) : undefined
          if(memberInfo){
            return <UserPortrait userInfo={memberInfo} showEl={showEl}></UserPortrait>
          }else{
            return <UserPortrait showEl={showEl}></UserPortrait>
          }
        }
      }
    }
    render(){
      return <div className={this.props.message.messageDirection==1 ? 'message-container msg-from-me clearfix' : 'message-container msg-from-friend clearfix'}>
          {this.renderMsgSentTime.bind(this)()}
          {this.renderMsgPortrait.bind(this)()}
          {this.renderMsgContent.bind(this)()}
        </div>
    }
}
