import React from 'react'
import { connect } from 'react-redux'
import style_conversationList from './conversation.scss'
import { Conversation } from './conversation'
import _ from 'lodash'
import store from '@/store/store'
import { getTotalUnreadCount } from '@/store/action'

export class ConversationList extends React.Component{
    constructor(props){
        super(props)
    }

		sortConversationList(){
			  let totalUnreadCount = 0
				this.props.conversationList.forEach(con=>{
						if(con.unreadCount){
							  totalUnreadCount += con.unreadCount
						}
				})
				store.dispatch(getTotalUnreadCount(totalUnreadCount))
			  let sortList = this.props.conversationList.sort((conA,conB)=>{
			  		return parseInt(conB.sentTime)-parseInt(conA.sentTime)
			  })
				if(sortList){
					  return _.uniqBy(sortList,'targetId').map(con=>{
								return <Conversation key={con.targetId} conversation={con}></Conversation>
						})
				}
		}

    render(){
        return <div id="conversation-list">
            {this.sortConversationList.bind(this)()}
        </div>
    }
}
const mapState = (state)=>{return {conversationList:state.conversationList}}
export default connect (mapState)(ConversationList)
