import axios from 'axios'
import async from 'async'
import store from '../store/store'
import { getFriendList,getGroupList,getUserInfo } from '@/store/action'
import { SortMail } from '@/public/SortMail'
import _ from 'lodash'
import { appKey,callbacks } from '@/rongcloud/initParams'
import { initSDK } from '@/rongcloud/initSDK'
export class Ajax {
    static user_token
    static r_token
    // 用户登录
    static login(params,callback){
        const { mobile,login_type,password} = params
        axios.post('/weinong' + '/session',{
            mobile,login_type,password
        }).then(res=>{
            if(res.data.status=='1'){
                sessionStorage.setItem('user_token',res.data.data.token)
                sessionStorage.setItem('r_token',res.data.data.r_token)
                Ajax.user_token = res.data.data.token
                Ajax.r_token = res.data.data.r_token
				        window.$loginTime = new Date().getTime()
                console.log(res.data.data)
                async.parallel([Ajax.getFriendList,Ajax.getGroupList],(err,result)=>{
                    if(err){
                        console.log(err)
                    }else{
                        store.dispatch(getFriendList(new SortMail({list:result[0].data}).getSortMail()))
                        store.dispatch(getGroupList(new SortMail({list:result[1].data}).getSortMail()))
                        store.dispatch(getUserInfo(res.data.data))
                        callback(result)
                        initSDK(RongIMLib,{appKey,token:res.data.data.r_token},callbacks)
                    }
                })
            }
        })
    }
    // 获取好友列表
    static getFriendList(callback){
        axios.get('/weinong' + '/v1/friends',{
            params:{
                token:Ajax.user_token
            }
        }).then(res=>{
            if(res.data.status=='1'){
                callback(null,res.data)
            }

        })
    }
    // 获取群组列表
    static getGroupList(callback){
        axios.get('/weinong' + '/v1/group/1',{
            params:{
                token:Ajax.user_token
            }
        }).then(res=>{
            if(res.data.status=='1'){
                callback(null,res.data)
            }
        })
    }
    // 查询好友信息
    static getFriendInfo(params,callback){
        let { friendList } = store.getState()
        if(friendList.length>0){
            let friend = _.find(friendList,(item)=> item.uuid==params.uuid)
            if(friend==undefined){
                axios.get('/weinong' + '/v1/search_friends',{
                    params:{
                        token:Ajax.user_token,
                        to_user:params.uuid
                    }
                }).then(res=>{
                    if(res.data.status=='1'){
                        callback(res.data.data)
                    }
                })
            }else{
                callback(friend)
            }
        }
    }
    // 查找群组资料
    static getGroupInfo(params,callback){
        axios.get('/weinong' + '/v1/group/query/' + params.id,{
            params:{
                token:Ajax.user_token
            }
        }).then(res=>{
            if(res.data.status=='1'){
                callback(res.data.data)
            }
        })
    }
    // 检测版本
    static checkVersion(callback){
        axios.get('/weinong' + '/api/version',{
            params:{
                version_id:'1.0.0',
                type:'3'
            }
        }).then(res=>{
            callback(res.data)
        })
    }
}
