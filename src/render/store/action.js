import TYPE from './constant'

export function getUserInfo(userInfo){
    return {
        type:TYPE.GET_USER_INFO,
        userInfo
    }
}
export function getFriendInfo(friendInfo){
    return {
        type:TYPE.GET_FRIEND_INFO,
        friendInfo
    }
}
export function getFriendList(friendList){
    return {
        type:TYPE.FRIEND_LIST,
        friendList
    }
}
export function updateFriendInfo(uuid,friendInfo){
	return {
		type:TYPE.UPDATE_FRIEND_INFO,
		uuid,friendInfo
	}
}
export function addfriend(friend){
    return {
        type:TYPE.ADD_FRIEND,
        friend
    }
}
export function deleteFriend(uuid){
    return {
        type:TYPE.DELETE_FRIEND,
        uuid
    }
}
export function getGroupInfo(groupInfo){
    return {
        type:TYPE.GET_GROUP_INFO,
        groupInfo
    }
}
export function getGroupNotice(groupNotice){
	return {
		type:TYPE.GET_GROUP_NOTICE,
		groupNotice
	}
}
export function getGroupList(groupList){
    return {
        type:TYPE.GROUP_LIST,
        groupList
    }
}
export function updateGroupInfo(id,groupInfo){
	return {
		type:TYPE.UPDATE_GROUP_INFO,
		id,groupInfo
	}
}
export function localSearchResult(seachResult){
    return {
        type:TYPE.LOCAL_SEARCH_RESULT,
        searchResultOfCreateGroup:seachResult
    }
}
export function clearLocalSearchResult(clear){
    return {
        type:TYPE.CLEAR_LOCAL_SEARCH_RESULT,
        clearFriendOfCreateGroup:clear
    }
}
export function addGroup(groupInfo){
    return {
        type:TYPE.ADD_GROUP,
        groupInfo
    }
}
export function deleteGroup(id){
    return {
        type:TYPE.DELETE_GROUP,
        id
    }
}
export function searchContent(val){
    return {
        type:TYPE.SEARCH_CONTENT,
        content:val
    }
}
export function getConversationList(list){
    return {
        type:TYPE.CONVERSATION_LIST,
        conversationList:list
    }
}
export function addOneConversation(con){
	return {
		type:TYPE.ADD_ONE_CONVERSATION,
		conversation:con
	}
}
export function deleteOneConversation(targetId){
	return {
		type:TYPE.DELETE_ONE_CONVERSATION,
		targetId
	}
}
export function updateConversationSentTime(targetId,sentTime){
	return {
		type:TYPE.UPDATE_CONVERSATION_SENTTIME,
		targetId,sentTime
	}
}
export function updateConversationLatestMsg(targetId,content){
	return {
		type:TYPE.UPDATE_CONVERSATION_LATESTMSG,
		targetId,content
	}
}
export function updateConversationSenderName(targetId,senderName){
	return {
		type:TYPE.UPDATE_CONVERSATION_SENDERNAME,
		targetId,senderName
	}
}
export function updateConversationIcon(targetId,icon){
	return {
		type:TYPE.UPDATE_CONVERSATION_ICON,
		targetId,icon
	}
}
export function updateConversationNickname(targetId,nickname){
	return {
		type:TYPE.UPDATE_CONVERSATION_NICKNAME,
		targetId,nickname
	}
}
export function updateConversationUnreadCount(targetId,count){
	return {
		type:TYPE.UPDATE_CONVERSATION_UNREADCOUNT,
		targetId,count
	}
}
export function getTotalUnreadCount(count){
	return {
		type:TYPE.GET_TOTAL_UNREAD_COUNT,
		count
	}
}
export function toggleCurrentConversation(con){
	return {
		type:TYPE.TOGGLE_CURRENT_CONVERSATION,
		currentConversation:con
	}
}
export function clearConMessageList(){
  return {
    type:TYPE.CLEAR_CON_MESSAGE_LIST
  }
}
export function pushOneMsgToMsgList(message){
	return {
		type:TYPE.ADD_ONE_MESSAGE,
		message
	}
}
export function shiftOneMsgToMsgList(message){
  return {
    type:TYPE.SHIFT_ONE_MESSAGE,
    message
  }
}
