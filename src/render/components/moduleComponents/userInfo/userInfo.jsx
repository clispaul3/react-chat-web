import React from 'react'
import css_userInfo from './userInfo.scss'
import { UserPortrait } from '@base/userPortrait/Userportrait'
import { connect } from 'react-redux'
import { SetInput } from '@base/setInput/setInput'
import store from '@/store/store'
import { entryOfSendMsg } from '@/public/entryOfSendMsg'
import _ from 'lodash'
/**
 * props: friendInfo
 */
export class UserInfo extends React.Component{
    constructor(props){
				super(props)
				this.state = {
						sexClassName:'sex iconfont icon-nan',
						friendInfo:null
				}
    }
    componentWillReceiveProps(){
				if(store.getState().friendInfo==undefined){
						this.setState({
							friendInfo:store.getState().userInfo
						})
				}
				if(store.getState().friendInfo){
					  const { sex } = store.getState().friendInfo
						this.setState({
							  friendInfo:store.getState().friendInfo
						})
						if(sex=='女'){
							  this.setState({sexClassName:'sex iconfont icon-icon-nv'})
						}
				}
    }
    renderHTMLup(){
			  if(this.state.friendInfo){
						return <div className="up">
								<div className="left">
										<p className={'nickname'}>
												<span>{this.state.friendInfo.nickname}</span>
												<i className={this.state.sexClassName}></i>
										</p>
										<p className={'mc-number'}>{'米仓号：'}{this.state.friendInfo.number}</p>
								</div>
								<UserPortrait userInfo={this.state.friendInfo}  prevent={'1'} showEl={[{selector:'#user-info',display:'block'}]}></UserPortrait>
						</div>
				}
    }
    renderHTMLdown(){
			  if(this.state.friendInfo){
						return <div className={'down'}>
								<div className={'signature'}>
										<span>个性签名</span>
										<SetInput val={this.state.friendInfo.signature} operation="signature"></SetInput>
								</div>
								{this.renderButtonSendMsg.bind(this)()}
						</div>
				}

    }
		sendMessage(){
			  const { uuid } = this.state.friendInfo
			  entryOfSendMsg(uuid,'PRIVATE')
		}
		addFriend(){
			  console.log('add-new-friend')
		}
		renderButtonSendMsg(){
			  const { uuid } = this.state.friendInfo
				const { userInfo,friendList } = store.getState()
				let operationSpan = ''
				const isFriend = _.find(friendList, item => item.uuid == uuid)
				if(uuid==userInfo.uuid){
					  return ''
				}
				if(isFriend){
					  operationSpan = <span className={'iconfont icon-xiaoxi'} onClick={this.sendMessage.bind(this)}></span>
				}else{
					  operationSpan = <span className={'iconfont icon-tianjiahaoyou1'} onClick={this.addFriend.bind(this)}></span>
				}
			  return <div className={'send-message'}>
			  		{operationSpan}
			  </div>
		}

    render(){
    	return <div id="user-info" >
    			{this.renderHTMLup.bind(this)()}
    			{this.renderHTMLdown.bind(this)()}
    		</div>
    }
}
const mapStateUserInfo = (state)=>{return {userInfo:state.friendInfo}}
export default connect (mapStateUserInfo)(UserInfo)
