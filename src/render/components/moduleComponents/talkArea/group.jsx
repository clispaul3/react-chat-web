import React from 'react'
import style_talkArea from './talkArea.scss'
import { connect } from 'react-redux'
import { UserPortrait } from '@base/userPortrait/Userportrait'
import { SetInput } from '@base/setInput/setInput'
import { ClearMessage } from '@base/clearMessage/clearMessage'
import { Scrollbars } from 'react-custom-scrollbars'
import { ChooseContainer } from '@module/chooseContainer/chooseContainer'
import { QuitOrDeleteGroup } from './quitOrDeleteGroup'
import store from '@/store/store'
import _ from 'lodash'
/**
 * props:
 *    groupInfo(Object):当前群组信息
      
 */
export class GroupInfo extends React.Component{
    constructor(props){
        super(props)
				this.state = {
					  userUuid:store.getState().userInfo.uuid,
					  owner:'',
						showLength:8,
						operation:'',
						containerClass:'container-add-friend',
						modalOperateGroup:'none'
				}
    }
		componentWillReceiveProps(){
			  if(this.props.groupInfo){
			  		const { owner } = this.props.groupInfo.group_info
						const { members } = this.props.groupInfo
						if(owner==this.state.userUuid){
							  this.setState({showLength:8},()=>{
									  if(members.length>8){
											  this.refs.seeAll.style.display = 'block'
										}else{
											  this.refs.seeAll.style.display = 'none'
										}
								})
						}else{
							  this.setState({showLength:9},()=>{
										if(members.length>9){
												this.refs.seeAll.style.display = 'block'
										}else{
											  this.refs.seeAll.style.display = 'none'
										}
								})
						}
				}
		}
		groupInfofUp(){
			  if(this.props.groupInfo){
					  const { group_info } = this.props.groupInfo
						const notice = this.props.groupNotice ? this.props.groupNotice.content : ''
						return <div className={'up'}>
								<UserPortrait userInfo={group_info} size={'default'} prevent={'1'}></UserPortrait>
								<SetInput val={group_info.name} operation={'group-name'} className={'group-name'}></SetInput>
								<p className={'group-number'}>群号: {group_info.id}</p>
								<p className={'group-notice-p'}>群公告</p>
								<SetInput val={notice} operation={'group-notice'} className={'group-notice'}></SetInput>
						</div>
				}
		}
		groupOwner(){
				if(this.props.groupInfo){
						const { owner } = this.props.groupInfo.group_info
						if(owner==this.state.userUuid){
								return <div className={'delete-member'} onClick={this.deleteMembers.bind(this)}>
										<span className={'iconfont icon-jianhao'}></span>
										<span>删除</span>
								</div>
						}
				}
		}
		showAllMember(){
				const { members } = this.props.groupInfo
			  this.setState({showLength:members.length},()=>{
					  this.refs.seeAll.style.display = 'none'
				}) 
		}
		showModals(str){
			  if(str=='clear'){
					  DOMController.showModalBox([{selector:'.group-info-',display:'block'},{selector:'.modal-clear-message',display:'block'}])
				}
				if(str=='quit-delete'){
					  DOMController.showModalBox([{selector:'.group-info-',display:'block'},{selector:'.modal-quit-delete-group',display:'block'}])
				}
		}
		addMembers(){
			  this.setState({operation:'添加群成员',containerClass:'container-add-friend'},()=>{
					  DOMController.showModalBox([{selector:'.group-info-',display:'block'},{selector:'.container-add-friend',display:'block'}])
				})
		}
		deleteMembers(){
			  this.setState({operation:'删除群成员',containerClass:'container-delete-friend'},()=>{
					  DOMController.showModalBox([{selector:'.group-info-',display:'block'},{selector:'.container-delete-friend',display:'block'}])
				})
		}
		memberOperate(){
			if(this.props.groupInfo){
				  if(this.state.operation==''){
						  return
					}
				  const { members } = this.props.groupInfo
					let searchRange = []
					if(this.state.operation=='添加群成员'){
						  const { friendList } = store.getState()
						  _.forEach(friendList,friend=>{
									let exist = false
									_.forEach(members,member=>{
											if(member.uuid==friend.uuid){
												exist = true
											}
									})
									if(exist==false){
											searchRange.push(friend)
									}
						  })
					}
					if(this.state.operation=='删除群成员'){
						  _.forEach(members,member=>{
								  if(member.uuid!=this.state.userUuid){
										  searchRange.push(member)
									}
							})
					}
					return <ChooseContainer containerTitle={this.state.operation} searchRange={searchRange} 
							createGroup={this.props.createGroup} containerClass={this.state.containerClass}>
					</ChooseContainer>
				}
		}
		deleteOrQuitGroup(){
				DOMController.showModalBox
		}
		groupInfofDown(str){
			  if(this.props.groupInfo){
						const { members } = this.props.groupInfo
						const id = this.props.groupInfo.group_info.id
						const myself = _.find(members,(item)=>item.uuid==this.state.userUuid)
						const { owner } = this.props.groupInfo.group_info
						const showMembers = members.filter((item,idx)=>idx<this.state.showLength)
						return <div className={'down'}>
						    <p className={'member-count'}>群成员{members.length}人</p>
								<Scrollbars style={{ width:282, height:191,left:0}}  autoHide autoHideDuration={200}
									className={'scroll-container'}>
									<div className={'add-member'} onClick={this.addMembers.bind(this)}>
									    <span className={'iconfont icon-jia'}></span>
											<span>添加</span>
									</div>
									
									{this.groupOwner.bind(this)()}
									{showMembers.map(item=>{
												return <div className={'member'} key={item.uuid}>
														<UserPortrait userInfo={item} size={'mini'} showEl={[{selector:'#user-info',display:'block'},{selector:'.group-info-',display:'block'}]}>
														</UserPortrait>
														<span>{item.nickname}</span>
												</div>
									})}
								</Scrollbars>
								<p className={'see-all'}>
								    <span onClick={this.showAllMember.bind(this)} ref={'seeAll'}>查看全部</span>
								</p>
								<div className={'group-nickname'}>
								    <span>我在本群的昵称</span>
								    <SetInput val={myself.nickname} operation={'group-nickname'}></SetInput>
								</div>
								<div className={'clear-message'}>
										<span onClick={this.showModals.bind(this,'clear')}>清除聊天记录</span>
								</div>
								<ClearMessage range='GROUP' targetId={id}></ClearMessage>
								<div className={'quit-group'}>
										<span onClick={this.showModals.bind(this,'quit-delete')}>{owner==this.state.userUuid ? '解散群组' : '退出群组'}</span>
								</div>
								<QuitOrDeleteGroup operation={owner==this.state.userUuid ? 'delete' : 'quit'} id={id}>
								</QuitOrDeleteGroup>
						</div>
				}
		}
    render(){
        return <div className={'group-info-'}>
            {this.groupInfofUp.bind(this)()}
						{this.groupInfofDown.bind(this)()}
						{this.memberOperate.bind(this)()}
        </div>
    }
}
const mapStategroupInfo = (state)=>{return {groupInfo:state.groupInfo,groupNotice:state.groupNotice,createGroup:state.createGroup}}
export default connect (mapStategroupInfo)(GroupInfo)