import async from 'async'
import _ from 'lodash'
export function mentionedMsg(message,callback){
    let { mentionedInfo } = message.content
    if(mentionedInfo.type==2){
        let nameArr = message.content.content.match(/@\S+/g,'@')
        let fnArr = _.map(mentionedInfo.userIdList,(o)=>{
            return function(callback){
                Friend.getFriendInfo(o).then(info=>{
					callback(null,info)
				})
            }
        })
        async.parallel(fnArr,(errors,results)=>{
            let content = ''
            for(let i=0;i<nameArr.length;i++){
                if(results[i]){
                    let name = results[i].remark_name || results[i].nickname
                    content = message.content.content.replace(nameArr[i],'@'+name)
                }
            }
            callback(content)
        })            
    }
}























