class fastJson {
    static isArray (a){
        return"object"==typeof a&&"[object array]"==Object.prototype.toString.call(a).toLowerCase()
    }
    static isObject (a){
        return"object"==typeof a&&"[object object]"==Object.prototype.toString.call(a).toLowerCase()
    }
    static format (a){
        if(null==a)return null;"string"==typeof a&&(a=eval("("+a+")"));return this._format(a,a,null,null,null)
    }
    static _randomId (){
        return"randomId_"+parseInt(1E9*Math.random())
    }
    static _getJsonValue (a,c){
        var d=this._randomId(),b;
        b=""+("function "+d+"(root){")+("return root."+c+";");
        b+="}";
        b+="";
        var e=document.createElement("script");
        e.id=d;
        e.text=b;
        document.body.appendChild(e);
        d=window[d](a);
        e.parentNode.removeChild(e);
        return d
    }
    static _format (a,c,d,b,e){
        d||(d="");
        if(this.isObject(c)){
            if(c.$ref){
                var g=c.$ref;
                0==g.indexOf("$.")&&(b[e]=this._getJsonValue(a,g.substring(2)));
                return
            }
            for(var f in c)b=d,
                ""!=b&&(b+="."),g=c[f],b+=f,this._format(a,g,b,c,f)
        }else if(this.isArray(c))
                for(f in c)b=d,g=c[f],b=b+"["+f+"]",this._format(a,g,b,c,f);
                return a
    }
}
export default fastJson