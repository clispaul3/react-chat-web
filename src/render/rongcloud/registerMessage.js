export class RegisterMessage{
	constructor(){
		
	}
	// WY:FriendHandle(同意好友请求)
	// WY:FriendNotification(1-->添加，2-->拒绝，4-->删除)
	static handleFriend(params, objectName, callback){
		const messageName = "handleFriend"
		const mesasgeTag = new RongIMLib.MessageTag(true,true)
		const prototypes = ['backUpMsg','handleType','receiverUUID','senderAvatar','senderUUID','senderNickName']
		RongIMClient.registerMessageType(messageName,objectName,mesasgeTag,prototypes)
		const targetId = params.receiverUUID
		if(targetId==''){
			return
		}
		const conversationType = RongIMLib.ConversationType.PRIVATE
		const msg = new RongIMClient.RegisterMessage.handleFriend({
			backUpMsg:params.backUpMsg,
			handleType:params.handleType,
			receiverUUID:params.receiverUUID,
			senderAvatar:params.senderAvatar,
			senderUUID:params.senderUUID,
			senderNickName:params.senderNickName,
		})
		
		RongIMClient.getInstance().sendMessage(conversationType,targetId, msg, {
			onSuccess: function (message) {
				console.log(message)
				callback(message)
			},
			onError: function (errorCode) {
				callback(errorCode)
			}
		});
	}
	// 自定义提醒认证消息
	static remindAuthentication(params,callback){
		const messageName = 'IdentityNotification'
		const objectName = 'WY:IdentityNotification' // 消息内置名称，请按照此格式命名。
		const mesasgeTag = new RongIMLib.MessageTag(true,true);//
		const prototypes = ['receiverUUID','senderUUID','tipsContent']
		RongIMClient.registerMessageType(messageName,objectName,mesasgeTag,prototypes)
		const targetId = params.receiverUUID; // 想获取自己和谁的历史消息，targetId 赋值为对方的 Id。
		if(targetId==''){
			return
		}
		const conversationType = RongIMLib.ConversationType.PRIVATE
		const msg = new RongIMClient.RegisterMessage.IdentityNotification({
			receiverUUID:params.receiverUUID,
			senderUUID:params.senderUUID,
			tipsContent:params.tipsContent,
		})
		RongIMClient.getInstance().sendMessage(conversationType,targetId, msg, {
			onSuccess: function (message) {
				callback(message)
			},
			onError: function (errorCode) {
				callback(errorCode)
			}
		})
	}
	// 自定义分享名片消息
	static shareCard(params){
		const messageName = 'ShareCard'
		const objectName = 'RC:CardMsg'
		const mesasgeTag = new RongIMLib.MessageTag(true,true)
		const prototypes = ['name','sendUserId','sendUserName','userId']
		const conversationType = RongIMLib.ConversationType[params.conversationType]
		const msg = new RongIMClient.RegisterMessage.ShareCard({
			name:params.name,
			sendUserId:params.sendUserId,
			sendUserName:params.sendUserName,
		})
		RongIMClient.getInstance().sendMessage(conversationType,targetId, msg, {
			onSuccess: function (message) {
				callback(message)
			},
			onError: function (errorCode) {
				callback(errorCode)
			}
		})
	}
}
export function initRegisterMsg(){
	let params = {receiverUUID:''}
	RegisterMessage.handleFriend(params, 'WY:FriendHandle',res=>{})
	RegisterMessage.handleFriend(params, 'WY:FriendNotification',res=>{})
	let params3 = {receiverUUID:''}
	RegisterMessage.remindAuthentication({receiverUUID:''}, res=>{})
}