import { Conversation } from '@/class/Conversation'
import { Group } from '@/class/Group'
import store from '@/store/store'
import _ from 'lodash'
import { getConversationList,deleteOneConversation,deleteFriend,deleteGroup,addFriend,
    addGroup,addOneConversation,toggleCurrentConversation,updateGroupInfo,updateConversationNickname } from '@/store/action'
import { getHistoryMessage } from '@/rongcloud/getHistoryMessage'
import { clearConHistoryMsg } from '@/rongcloud/clearHistoryMsg'
import { MessageType } from '@/rongcloud/messageType'
const appKeyArr = ['qd46yzrfqiomf-dev','kj7swf8ok1rl2-pro']
export const appKey = appKeyArr[0].split('-')[0]

/**
 * 部分会话中的最近一条消息体中没有targetId字段
 */
export let callbacks = {
    getInstance : function(instance){

    },
    getCurrentUser : function(userInfo){
        Conversation.getAllConversationList(list=>{
            const { friendList,groupList } = store.getState()
            let _friendList = _.map(friendList,(item)=>{
                item.targetId = item.uuid
                return item
            })
            let _groupList = _.map(groupList,(item)=>{
                item.targetId = String(item.id)
                return item
            })
			let conversationList = _.concat(_.intersectionBy(list,_friendList,'targetId'),_.intersectionBy(list,_groupList,'targetId'))
			let $conversationList = _.map(conversationList,(item)=>{
				let con = {}
                _.forEach(friendList,(friend)=>{
                    if(item.targetId==friend.uuid){
						con = {
							targetId:item.targetId,
							avatar:friend.avatar,
							nickname:friend.remark_name || friend.nickname,
							conversationType:'PRIVATE'
						}
                    }
                })
                _.forEach(groupList,(group)=>{
                    if(item.targetId==group.id){
						con = {
							targetId:item.targetId,
							avatar:group.icon,
							nickname:group.name,
							conversationType:'GROUP'
						}
                    }
                })
				return con
            })
            store.dispatch(getConversationList($conversationList))
			_.forEach(conversationList,(con)=>{
				new Conversation(con).initConversation()
			})
        })
    },
    receiveNewMessage : function(message){
		//处理优先级: 会话数量(删除|增加|不变)
		// 删除会话的情况：1) 自己解散群组 2）删除好友(自己删除好友|被好友删除) 3) 自己退出群组
		// console.log(message)
		const { objectName,messageDirection,targetId,conversationType } = message
		const { conversationList, friendList, groupList,currentConversation } = store.getState()
		const userUuid = store.getState().userInfo.uuid
		const existCon = _.find(conversationList,item => item.targetId == targetId)
		const existGroup = _.find(groupList,item => item.targetId == targetId)
		const existFriend = _.find(friendList,item => item.targetId == targetId)
		const showLogo = ()=>{
			if(existCon){
				store.dispatch(deleteOneConversation(targetId))
				if(currentConversation){
					if(currentConversation.targetId==targetId){
						store.dispatch(toggleCurrentConversation(null))
						$('.logo-image').show()
					}
				}
			}
		}
		let conditionType = true
		// 删除会话类消息-->更新通讯录
		if(objectName=='RC:GrpNtf'){
			const { operation } = message.content
			if(operation=='Dismiss'){
				conditionType = false
				showLogo()
				store.dispatch(deleteGroup(targetId))
			}
			if(operation=='Quit'){
				const { operatorUserId } = message.content
				if(operatorUserId==userUuid){
					store.dispatch(deleteGroup(targetId))
					clearConHistoryMsg(targetId)
					showLogo()
				}
			}
		}
		if(objectName=='WY:FriendNotification'){
			const { handleType } = message.content
			if(handleType==4){
				conditionType = false
				clearConHistoryMsg(targetId)
				store.dispatch(deleteFriend(targetId))
				showLogo()
			}
		}
		// 增加会话类消息-->更新通讯录
		if(objectName=='WY:FriendHandle'){
			conditionType = false
			Conversation.createConversation(targetId,'PRIVATE',newCon=>{
				store.dispatch(addOneConversation(newCon))
				new MessageType(message,'pc-receive')
				Friend.getFriendInfo(targetId).then(info=>store.dispatch(addFriend(info)))
			})
		}
		// 增加会话类消息-->更新通讯录
		if(objectName=='RC:GrpNtf'){
			const { operation } = message.content
			let create = operation=='Create' ? true : false
			if(operation=='Add'){
				const { targetUserIds } = message.content.data
				if(targetUserIds.indexOf(userUuid)>=0){
					create = true
				}
			}
			if(create){
				conditionType = false
				Conversation.createConversation(targetId,'GROUP',newCon=>{
					store.dispatch(addOneConversation(newCon))
					new MessageType(message,'pc-receive')
					Group.getGroupInfo(targetId).then(info=>store.dispatch(addGroup(info.group_info)))
				})
			}
		}
		// 增加会话类消息-->不更新通讯录
		if(conditionType){
			if(existCon==undefined){
				conditionType = false
				if(conversationType==1){
					Conversation.createConversation(targetId,'PRIVATE',newCon=>{
						store.dispatch(addOneConversation(newCon))
						new MessageType(message,'pc-receive')
					})
				}
				if(conversationType==3){
					Conversation.createConversation(targetId,'GROUP',newCon=>{
						store.dispatch(addOneConversation(newCon))
						new MessageType(message,'pc-receive')
					})
				}
			}
		}
		// 不增加会话-->只更新会话中的字段
		if(conditionType){
			new MessageType(message,'pc-receive')
		}
    }
}
