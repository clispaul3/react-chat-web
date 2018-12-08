import axios from 'axios'
import store from '@/store/store'
import { updateConversationNickname,updateFriendInfo,updateConversationIcon } from '@/store/action'
export class Friend {
	constructor(){
		
	}
	static getFriendInfo(uuid){
		return new Promise((resolve,reject)=>{
			axios.get('/weinong' + '/v1/search_friends',{
				params:{
					token:Ajax.user_token,
					to_user:uuid
				}
			}).then(res=>{
				if(res.data.status=='1'){
					const conNickname = res.data.data.remark_name || res.data.data.nickname
					store.dispatch(updateFriendInfo(uuid,res.data.data))
					store.dispatch(updateConversationNickname(uuid,conNickname))
					store.dispatch(updateConversationIcon(uuid,res.data.data.avatar))
					resolve(res.data.data)
				}else{
					console.log('获取好友资料失败')
				}
			})
		})
	}
}