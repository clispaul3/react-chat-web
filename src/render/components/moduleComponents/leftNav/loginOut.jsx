import React from 'react'

export class LoginOut extends React.Component{
    constructor(props){
       super(props)
    }
    closeModalBox(ev){
        DOMController.closeAllModalBox()
    }
    render(){
        return <div className={"modal-login-out"}>
            <p className={"p-title"}>
                <span className={'notice'}>提示</span>
                <span className="iconfont icon-guanbi" onClick={this.closeModalBox.bind(this)}></span>
            </p>
            <p className={"notice"}>您确定要退出9号米仓网页版吗？</p>
            <button className={'btn-success'} onClick={this.closeModalBox.bind(this)}>
                确定
            </button>
        </div>
    }
}
