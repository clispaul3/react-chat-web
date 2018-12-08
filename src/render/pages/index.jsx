import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import globalCssStyle from '@/assets/iconfont/iconfont.css'
import globalStyle from '@/style/common'
import indexStyle from '@/style/index'
import UserInfo from '@module/userInfo/userInfo'
import { FriendList } from '@module/friendList/friendList'
import store from '@/store/store.js'
import GroupInfo from '@module/groupInfo/groupInfo'
import 'element-theme-default'
import { Scrollbars } from 'react-custom-scrollbars'
import { SearchInput } from '@base/searchInput/searchInput'
import LeftNav from '@module/leftNav/leftNav.jsx'
import { connect } from 'react-redux'
import TalkArea from '@module/talkArea/talkArea'
import ConversationList from '@module/conversationList/conversationList'
const logoImgUrl = require('@static/logo-image.png')
export class Index extends React.Component{
    constructor(props){
        super(props)
    }
	
	// 全局搜索结果列表
	renderGlobalSearchList(){
		const searchResList = store.getState().createGroup
		if(searchResList.length==0){
			return
		}
		if(searchResList.length>0 && searchResList[0].range){
			const styleObj = {
				width:242,
				height:472,
				left:70,
				top:52,
				position:'absolute',
				zIndex:5000,
				background:'#fff'
			}
			return <Scrollbars style={styleObj}  autoHide autoHideDuration={200}
					onScroll={DOMController.showModalBox.bind(this,[{selector:'.scroll-search-list',display:'block'}])} 
					className={'scroll-search-list scroll-container'}>
					<div id="search-list">
						<FriendList friendList={searchResList} showEl={[{selector:'#user-info',display:'block'}]}
						    firstLetter={'1'}>
						</FriendList>
					</div>
				</Scrollbars>
		}
		
	}
	showModalBox(idx){
		DOMController.closeAllModalBox()
		DOMController.controlLeftNavIcon(idx)
	}
	componentDidMount(){
		window.scrollConList = this.refs.scrollConList
	}
    render(){
        return <div style={{position:"absolute",top:'0px',left:'0px',bottom:'0px',right:'0px'}}>
                <LeftNav></LeftNav>
                <SearchInput left={'70px'} closeAll={'1'} range={'发起会话'}></SearchInput>
                <UserInfo></UserInfo>
                <div className="logo-image">
                    <img src={logoImgUrl} alt=""/>
                </div>
                <GroupInfo></GroupInfo>
                <Scrollbars style={{ width:242, height:472,left:70 }}  autoHide autoHideDuration={200} ref={'scrollConList'}
                    onScroll={this.showModalBox.bind(this,0)} className={'scroll-conversation-list scroll-container'}>
                    <ConversationList></ConversationList>
                </Scrollbars>
                <Scrollbars style={{ width:242, height:472,left:70 }}  autoHide autoHideDuration={200}
                    onScroll={this.showModalBox.bind(this,1)} className={'scroll-mail-list scroll-container'}>
                    <div id="mail-list">
                        <FriendList friendList={this.props.friendList} title="friend" showEl={[{selector:'#user-info',display:'block'}]}></FriendList>
                        <FriendList friendList={this.props.groupList} title="group" firstLetter={'1'} showEl={[{selector:'#group-info',display:'block'}]}></FriendList>
                    </div>
                </Scrollbars>
				{this.renderGlobalSearchList.bind(this)()}
                <TalkArea></TalkArea>
            </div>
    }
}
const mapState = (state)=>{return {friendList:state.friendList,groupList:state.groupList,searchContent:state.searchContent}}
export default connect (mapState)(Index)