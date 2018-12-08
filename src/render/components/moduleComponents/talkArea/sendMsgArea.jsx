import React from 'react'
import { Emoji } from '@/rongcloud/emojiInit'
import  ChooseContainer from '@module/chooseContainer/chooseContainer'
import store from '@/store/store'
import { SendTextMessage } from '@/rongcloud/sendTextMsg'
export class SendMsgArea extends React.Component{
	constructor(props){
		super(props)
		this.state = {
			shareFriendList:[]
		}
	}
	componentDidMount(){
		new Emoji()
	}
	showFileSelectModal(){
		$('.file-input').click()
	}
	toggleEmojiListStatus(str){
		if(str=='show'){
			if($('#modal-emoji-list').html==''){
				new Emoji()
			}
			$('#modal-emoji-list').show()
		}
		if(str=='hide'){
			$('#modal-emoji-list').hide()
		}
	}
	shareCard(){
		this.setState({
			shareFriendList:store.getState().friendList
		},()=>{
			DOMController.showModalBox([{selector:'.container-share-card',display:'block'}])
		})
	}
	renderShareCardContainer(){
		if(this.state.shareFriendList.length==0){
			return
		}else{
			return <ChooseContainer containerTitle={'分享名片'} containerClass={'container-share-card'}
			    searchRange={this.state.shareFriendList}>
				</ChooseContainer>
		}
	}
	sendMsg(){
		const content = this.refs.msgContent.value
		new SendTextMessage(content).sendMsg()
		$('textarea').val('')
	}
	sendFileOrImgMsg(ev){
		console.log(ev.target.files)
	}
	render(){
		return <div id={"send-message-area"}>
		    <div className={'area-pannel'}>
			    <div id={'modal-emoji-list'} className={'overflow-scroll'}
					onMouseOver={this.toggleEmojiListStatus.bind(this,'show')}
					onMouseOut={this.toggleEmojiListStatus.bind(this,'hide')}>
				</div>
			    <div className={'send-emoji-message'} title={'发送表情'}
				    onMouseOver={this.toggleEmojiListStatus.bind(this,'show')}
					onMouseOut={this.toggleEmojiListStatus.bind(this,'hide')}>
				    <span className={'iconfont icon-biaoqing1'}></span>
				</div>
				<div className={'send-file-message'} title={'发送文件'} onClick={this.showFileSelectModal.bind(this)}>
				    <span className={'iconfont icon-wenjian1'}></span>
					<input type='file' className={'file-input'} onChange={this.sendFileOrImgMsg.bind(this)}/>
				</div>
				<div className={'share-card-message'}title={'分享名片'} onClick={this.shareCard.bind(this)}>
				    <span className={'iconfont icon-mingpiansvg'}></span>
				</div>
				{this.renderShareCardContainer.bind(this)()}
			</div>
			<textarea className={'overflow-scroll'} onFocus={DOMController.closeAllModalBox} ref="msgContent">
			</textarea>
			<button className={'btn-success btn-send-message'} onClick={this.sendMsg.bind(this)}>发送</button>
		</div>
	}
}
