import React from 'react'
import { Input } from 'element-react'
import setInpputStyle from './setInput.scss'
import store from '@/store/store'
import { updateConversationNickname,updateGroupName,getGroupNotice } from '@/store/action'
export class SetInput extends React.Component{
	constructor(props){
		super(props)
		this.state = {
			userUuid:store.getState().userInfo.uuid,
			value:'',
			className:'set-input'
		}
	}
	changeOperate(value){
		this.setState({value})
		
	}
	blurOperate(){
		const { operation } = this.props
		const { id } = store.getState().groupInfo.group_info
		switch(operation){
			case 'signature':
				axios.put('/weinong' + '/user/1',{
					token:Ajax.user_token,
					signature:this.state.value
				}).then(res=>{})
				break
			case 'group-name':
				axios.put('/weinong' + '/v1/group/' + id,{
					token:Ajax.user_token,
					name:this.state.value
				}).then(res=>{
					store.dispatch(updateConversationNickname(id,this.state.value))
					store.dispatch(updateGroupName(id,this.state.value))
				})
				break
			case 'group-notice':
				axios.post('/weinong' + '/v1/group/notice',{
					token:Ajax.user_token,
					content:this.state.value,
					group_id:id
				}).then(res=>{
					store.dispatch(getGroupNotice(this.state.value))
				})
				break
			case 'group-nickname':
			    axios.put('/weinong' + '/v1/group/upnickname',{
					token:Ajax.user_token,
					nickname:this.state.value,
					gid:id
				}).then(res=>{console.log(res)})
				break
			default:
				return
		}
	}
	componentWillReceiveProps(nextProps){
		this.setState({value:nextProps.val})
		if(nextProps.operation=='group-name'){
			this.setState({className:'set-input group-name'})
		}
		if(nextProps.operation=='group-notice'){
			this.setState({className:'set-input group-notice'})
		}
	}
	createTag(){
		let operation = this.props.operation || ''
		let mySelf = false
		switch(operation){
			case 'signature':
				if(store.getState().friendInfo){
					const { uuid } = store.getState().friendInfo
					mySelf = (this.state.userUuid == uuid) ? true : false
				}
				if(mySelf){
					if(this.props.val){
						return <Input value={this.state.value} onChange={this.changeOperate.bind(this)} onBlur={this.blurOperate.bind(this)}></Input>
					}else{
						return <Input placeholder={'暂无个性签名'} onChange={this.changeOperate.bind(this)} onBlur={this.blurOperate.bind(this)}></Input>
					}
				}else{
					if(this.props.val){
						return <span title={this.state.value}>{this.state.value}</span>
					}else{
						return <span style={{color:'#8b8b8b'}}>暂无个性签名</span>
					}
				}
				break
			case 'group-name':
				if(store.getState().groupInfo){
					const { owner } = store.getState().groupInfo.group_info
					mySelf = (this.state.userUuid == owner) ? true : false
				}
				if(mySelf){
					if(this.props.val){
						return <Input value={this.state.value} onChange={this.changeOperate.bind(this)} onBlur={this.blurOperate.bind(this)}></Input>
					}
				}else{
					if(this.props.val){
						return <span title={this.state.value}>{this.state.value}</span>
					}
				}
				break
			case 'group-notice':
				if(store.getState().groupInfo){
					const { owner } = store.getState().groupInfo.group_info
					mySelf = (this.state.userUuid == owner) ? true : false
				}
				if(mySelf){
					if(this.props.val){
						return <Input value={this.state.value} onChange={this.changeOperate.bind(this)} onBlur={this.blurOperate.bind(this)}></Input>
					}else{
						return <Input placeholder={'暂无群公告'} onChange={this.changeOperate.bind(this)} onBlur={this.blurOperate.bind(this)}></Input>
					}
				}else{
					if(this.props.val){
						return <span title={this.state.value}>{this.state.value}</span>
					}else{
						return <span>暂无群公告</span>
					}
				}
				break
			case 'group-nickname':
				if(store.getState().groupInfo){
					if(this.props.val){
						return <Input value={this.state.value} onChange={this.changeOperate.bind(this)} onBlur={this.blurOperate.bind(this)}></Input>
					}
				}
				break
			default:
			    return
		}
	}
	render(){
		return <div className={this.state.className}>
			{this.createTag.bind(this)()}
		</div>
	}
}