import store from '@/store/store'
import { MessageType } from '@/rongcloud/messageType'
export class SendTextMessage {
  constructor(content){
    this.currentConversation = store.getState().currentConversation
    this.content = content
  }
  sendMsg(){
    const msg = new RongIMLib.TextMessage({content:this.content})
    const { conversationType,targetId } = this.currentConversation
    const conType = RongIMLib.ConversationType[conversationType]
    RongIMClient.getInstance().sendMessage(conType, String(targetId), msg, {
          onSuccess: function (message) {
              new MessageType(message,'pc-receive')
              console.log("Send successfully")
              let timer = window.setTimeout(()=>{
                window.scrollMessageList.scrollToBottom()
                clearTimeout(timer)
              },100)
          },
          onError: function (errorCode,message) {
              console.log('发送失败:' + info);
          }
       }
     )
   }
}
