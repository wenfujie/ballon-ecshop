

import Vue from 'vue'
import moment from 'moment';

//  两位小数过滤器 + 保留小数位
Vue.filter('Fix2',function(val,num){
    if(!val) val = 0
    val = numberRound(val)
    if(!!num) {
        num = Math.abs(Number(num))
        val = val.toFixed(num)
    }
    return val
});


//  两位小数过滤器
Vue.filter('fixed2',function(value){
    value = parseFloat(value);
    return value;
});

// 金额分隔 1500 =》 1,500
Vue.filter('$goldDivide',function(value){
  if(value){
    return Number(value).toLocaleString();
  }
  return value;
});

// 图片过滤器
Vue.filter('imageFilter', function(url){
    if (!!url) {
        url = decodeURIComponent(url)
        let reg = /(http|https):\/\/([\w.]+\/?)\S*/;
        if (reg.test(url)) {
            return url;
        } else {
            if (url.substring(0,5) === 'data:') {
                return url;
            } else {
                return getImg(url);
            }
        }
    }
});

// 手机号掩码
Vue.filter('phoneMask',function(value){
    if(value){
        return value.substring(0, 3) + '****' + value.substring(7, 11);
    }
    return value;
});

// 时间过滤掉秒
Vue.filter('formatDate',function(value){
    if(value){
        value = moment(value).format('YYYY-MM-DD HH:mm')
    }
    return value;
});

let getFilter = Vue.filter('fixed2');
