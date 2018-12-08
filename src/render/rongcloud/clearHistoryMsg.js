import store from '@/store/store'
import _ from 'lodash'
export function clearConHistoryMsg(targetId){
	const { conversationList } = store.getState()
	const conversation = _.find(conversationList,(con)=>String(con.targetId)==String(targetId))
  const type = conversation.conversationType
	if(conversation){
		let params = {
			conversationType: RongIMLib.ConversationType[type],
			targetId: String(targetId),
			timestamp: conversation.sentTime
		}
		RongIMLib.RongIMClient.getInstance().clearRemoteHistoryMessages(params, {
				onSuccess: function() {
					console.log('清除成功')
				},
				onError: function(error) {
					console.log('清除失败')
				}
		})
	}else{
		console.log('会话不存在，无法删除历史消息')
	}
}
export function clearAllHistoryMsg(){
    let list = store.getState().conversationList
    _.forEach(list,(item)=>{
        clearConHistoryMsg(item.targetId)
    })
}
