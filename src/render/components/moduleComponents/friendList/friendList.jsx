import React from 'react'
import css_friendList from './friendList.scss'
import { UserPortrait } from '@base/userPortrait/Userportrait'
import store from '@/store/store'
import { getFriendInfo,getGroupInfo } from '@/store/action'
import { Scrollbars } from 'react-custom-scrollbars'
import { Checkbox} from 'element-react'
import { SearchInput } from '@base/searchInput/searchInput'
/**
 * props:
 *  showEl(Array):显示的弹框
    title(String):收起展开标签的标题(friend,group,new-friend)
	  friendList(Array):显示的列表
	  cancelChoosed(func)，searchResult(func)：父组件传过来的方法
	  firstLetter(String):是否显示排序 1:不排序
	  searchInput(String):是否支持搜索 1:支持
	  checkbox(String):是否支持复选框 1:支持
	  checkclose(String):是否支持删除选中 1:支持
 */
export class FriendList extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            searchStr:'',
            closeBtnStatus:'none',
            toggleIconDirection:'right',
        }
    }
    // 显示用户信息
    showUserInfo(friend,ev){
        let event = ev.nativeEvent
        if(event.target.tagName=='INPUT' || event.target.classList.contains('el-checkbox__inner') || event.target.classList.contains('icon-guanbi')){
            return
        }
		if(this.props.title){
			DOMController.controlLeftNavIcon(1)
		}
        if(friend.mobile){
            if(this.props.showFiendInfo=='0'){
                return
            }
            Friend.getFriendInfo(friend.uuid).then(info=>{
				let showEls = []
				if(friend.range=='global'){
					showEls = [{selector:'#user-info',display:'block'},{selector:'.scroll-search-list',display:'block'}]
					DOMController.showModalBox(showEls)
				}else{
					DOMController.showModalBox(this.props.showEl,event)
				}
            	store.dispatch(getFriendInfo(info))
            })
        }
        if(friend.icon){
            Ajax.getGroupInfo({id:friend.id},res=>{
				let showEls = []
				if(friend.range=='global'){
					showEls = [{selector:'#group-info',display:'block'},{selector:'.scroll-search-list',display:'block'}]
					DOMController.showModalBox(showEls)
				}else{
					DOMController.showModalBox([{selector:'#group-info',display:'block'}])
				}
				store.dispatch(getGroupInfo(res))
            })
        }
    }
    closeAllModalBox(){
        DOMController.closeAllModalBox()
    }
    // 选中好友
    selectFriend(friend,ev){
        this.props.searchResult({friend,checked:ev})
        DOMController.showModalBox(_.remove(this.props.showEl,(item)=>item.selector!='#user-info'))
    }
    // 取消选中
    cancelChoosed(friend){
        this.props.cancelChoosed(friend)
        DOMController.showModalBox(_.remove(this.props.showEl,(item)=>item.selector!='#user-info'))
    }
    // 显示排序
    showSortResult(item,idx){
        if(this.props.firstLetter=='1'){
            return ''
        }
        if(idx==0 || (idx>0 && this.props.friendList[idx].firstLetter!=this.props.friendList[idx-1].firstLetter)){
            return <p className={'first-letter'}>{item.firstLetter}</p>
        }else{
            return ''
        }
    }
    // 生成单个li
    createSingleLi(friend,idx){
		if(this.props.title && this.state.toggleIconDirection=='right'){
			return
		}
        let liClassName = 'list-style'
        if(idx==0 || (idx>0 && this.props.friendList[idx].firstLetter!=this.props.friendList[idx-1].firstLetter)){
            if(this.props.firstLetter!='1'){
                liClassName += ' special-list-style'
            }
        }
        return <li key={friend.uuid || friend.id} className={liClassName} onClick={this.showUserInfo.bind(this,friend)}>
                {this.showSortResult.bind(this,friend,idx)()}
                <p className={'nickname'}>{friend.remark_name || friend.nickname || friend.name}</p>
                {this.props.checkbox=='1' ? <Checkbox onChange={this.selectFriend.bind(this,friend)} checked={friend.checked ? friend.checked : false}></Checkbox> : ''}
                {this.props.checkclose=='1' ? <span className={'iconfont icon-guanbi'} onClick={this.cancelChoosed.bind(this,friend)}></span> : ''}
                <UserPortrait userInfo={friend} size={'default'} showEl={this.props.showEl}></UserPortrait>
            </li>
    }
    // 清空输入框
    clearSearchInput(){
        this.setState({
            searchStr:''
        },()=>{
            this.setState({
                closeBtnStatus:'none'
            })
            this.refs.searchInput.focus()
        })
    }
    // 搜索好友
    searchFriend(ev){
        this.setState({
            searchStr:ev
        },()=>{
            if(ev!=''){
                this.setState({
                    closeBtnStatus:'block'
                })
            }else{
                this.setState({
                    closeBtnStatus:'none'
                })
            }
        })
    }
    // 生成收起展开标签
    toggleList(){
        let  title = ''
        if(this.props.title=='friend'){
            title = '联系人'
        }
        if(this.props.title=='group'){
            title = '群组'
        }
        if(this.props.title=='new-friend'){
            title = '新朋友'
        }
        if(title){
            return <p className="toggle" onClick={this.toggleIconDirection.bind(this)} >
                <span className={'iconfont icon-jiantouyou'} ref={'toggleIcon'}></span>
                <span>{title}</span>
                {this.props.friendList.length>0 ? <span>{this.props.friendList.length}</span> : ''}
            </p>
        }
    }
    // 收起/展开列表
    toggleIconDirection(){
        if(this.state.toggleIconDirection=='right'){
            this.setState({
                toggleIconDirection:'down'
            })
            this.refs.toggleIcon.style.transform = 'rotate(90deg)'
            this.refs.list.style.display = 'block'
        }else{
            this.setState({
                toggleIconDirection:'right'
            },()=>{
                this.refs.toggleIcon.style.transform = 'rotate(0deg)'
                this.refs.list.style.display = 'none'
            })
        }
		DOMController.controlLeftNavIcon(1)
        DOMController.closeAllModalBox()
    }
    render(){
        return <div id="friend-list">
            {this.props.searchInput=='1' ? <SearchInput></SearchInput> : ''}
            {this.toggleList.bind(this)()}
            <ul ref='list'>
                {this.props.friendList!=undefined ? this.props.friendList.map((item,idx)=>{
                    return this.createSingleLi.bind(this,item,idx)()
                }) : ''}
            </ul>
        </div>
    }
}
