import React from 'react'
import { MessageContainer } from './messageContainer'
import store from '@/store/store'
import msgListStyle from './message.scss'
import { Scrollbars } from 'react-custom-scrollbars'
import { DOMController } from '@/class/DOMController'
import { getHistoryMessage } from '@/rongcloud/getHistoryMessage'
import { MessageType } from '@/rongcloud/messageType'
import _ from 'lodash'
import style_magnify from '@static/lib/jquery.magnify.min.css'

/**
  messageList:当前会话的历史消息
*/
export class MessageList extends React.Component{
    constructor(props){
      super(props)
      this.state = {
        hasMsg:true
      }
    }
    componentWillReceiveProps(){
      this.setState({hasMsg:true})
    }
    componentDidMount(){
      window.scrollMessageList = this.refs.scrollMsgList
    }
    loadingMoreMsg(ev,values){
      DOMController.closeAllModalBox()
      const topDistance = this.refs.scrollMsgList.getScrollTop()
      const { currentConversation } = store.getState()
      const handleMessge = (list)=>{
        _.forEachRight(list,item => {
          if((window.$loginTime-item.sentTime)<1000*60*60*24*5){
            new MessageType(item,'loading-more-msg')
          }else{
            this.setState({hasMsg:false},()=>{
              let timer = window.setTimeout(()=>{
                DOMController.showModalBox([{selector:'.modal-before-five-days-msg',display:'block'}])
                clearTimeout(timer)
              },100)
            })
          }
        })
      }
      if(topDistance==0){
        if(this.state.hasMsg){
          getHistoryMessage(currentConversation.targetId,null).then(res=>{
            if(res.hasMsg==false){
              this.setState({hasMsg:false},()=>{
                if(res.list.length>0){
                  handleMessge(res.list)
                }
              })
            }
            if(res.hasMsg){
              handleMessge(res.list)
              this.refs.scrollMsgList.scrollTop(100)
            }
          })
        }
      }
    }
    render(){
      return <Scrollbars style={{ width:613, height:303,left:0 }}  autoHide autoHideDuration={200}
              className={'scroll-message-list scroll-container'} ref={'scrollMsgList'}
              onScroll={this.loadingMoreMsg.bind(this)}>
            <div id="conversation-message-list">
                {_.uniqBy(this.props.messageList,'messageUId').map((item,idx)=>{
                    let showMsgSentTime = '0'
                    if(idx==0){
                      showMsgSentTime = '1'
                    }
                    if(idx>0){
                      const compareRes = (this.props.messageList[idx].sentTime - this.props.messageList[idx-1].sentTime)>1000*60*3
                      showMsgSentTime = compareRes ? '1' : '0'
                    }
                    return <MessageContainer message={item} key={item.messageUId} showMsgSentTime={showMsgSentTime}>
                        </MessageContainer>
                })}
            </div>
        </Scrollbars>
    }
}
