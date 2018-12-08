import { Switch } from 'element-react'
import React from 'react'
import { ClearMessage } from '@base/ClearMessage/clearMessage'
export function SystemSetting(props){
    return <div className={"modal-system-setting"}>
        <p className={"p-title"}>
            <span className={'notice'}>系统设置</span>
            <span className={"iconfont icon-guanbi"} onClick={props.cancel.bind(this,'close-all')}></span>
        </p>
        <p className={"message-notice"}>
            <span>接收新消息通知</span>
        </p>
        <Switch value={true} onColor="#498EF2" offColor="#BFBFBF"></Switch>
        <p className={"message-voice"}>
            <span>消息提示声</span>
        </p>
        <Switch value={true} onColor="#498EF2" offColor="#BFBFBF"></Switch>
        <p className={"clear-message"}>
            <span style={{color:'#7595F1'}} onClick={props.cancel.bind(this,'clear-all-message')}>清除聊天记录</span>
        </p>
        <ClearMessage range='ALL'></ClearMessage>
    </div>
}