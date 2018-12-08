import md5 from 'blueimp-md5'
import $ from 'jquery'
import { modalBox, zIndex } from '@/public/modalBox'
import store from '@/store/store'
export class DOMController{
    static portraitColor(userid){
        var colors = ["#e97ffb", "#00b8d4", "#82b2ff", "#f3db73", "#f0857c"]
		var i = 0
	    if (!userid) {
	        return colors[0]
	    }else{
	    	var str = "wu" + userid + "ye"
	    	var mdstr = md5(str)[0]
	    	mdstr = mdstr ? mdstr : ""
	    	if(mdstr){
                i = mdstr.toUpperCase().charCodeAt() % 5
            }
	    }
	    return colors[i]
	}
	static closeAllModalBox(){
		modalBox.forEach(item=>{
			if(item.display=='block'){
				$(item.el).hide().css({zIndex:0})
			}
			if(item.display=='flex'){
				$(item.el).css({transform:'scale(0)'})
			}
		})
	}
	static showModalBox(el,ev){
		if(el){
			DOMController.closeAllModalBox()
			el.forEach((item,idx)=>{
				if(item==undefined){
					return
				}
				if(item.display=='block'){
					$(item.selector).show().css({zIndex:zIndex[idx]})
					DOMController.locationModalBox(item.selector,ev)
				}
				if(item.display=='flex'){
					$(item.selector).css({
						transform:'scale(1)'
					})
				}
			})
		}else{
			DOMController.closeAllModalBox()
		}
	}
	static locationModalBox(el,ev){
		if(el=='#group-info' || el=='.modal-app-setting' || el=='.group-info-' || el=='.scroll-search-list'){
			$(el).css({background:'#fff'})
			return
		}
		$(el).css({
			left:'50%',
			top:'50%',
			background:'#fff',
			transform:'translate(-50%,-50%)'
		})
	}
	// 控制侧边栏四个小图标的切换
	static controlLeftNavIcon(idx){
		if(idx==0){
			if(store.getState().currentConversation){
				$('.logo-image').hide()
			}
		}
		$('.icon-left-nav').each(function(index,el){
			if(index==idx){
				$(this).addClass('active')
			}else{
				$(this).removeClass('active')
			}
		})
	}
}
