
/**
 * @desc Date prototype extend
 */
(function () {
    /**
     * @author tac
     * @desc 将时间戳解析为Date实例
     * @see 
     */
    Date.parseTimestamp = function (timestamp) {
        if (typeof timestamp == "string") {
            var t = parseInt(timestamp.match(/\d+/g)[0]);       //转换为int
            if (!isNaN(t))
                return new Date(t);
        }else if (typeof timestamp == "number") {
            return new Date(parseInt(timestamp)); //可能是小数
        } else {
            throw Error("parseTimestamp(): timestamp's type isn't string or number");
        }
    };

    /**
 * @author meizz
 * @desc 格式化输出date
 * @see 
 */
    Date.prototype.Format = function (fmt) {
        var o = {
            "M+": this.getMonth() + 1,                 //月份   
            "d+": this.getDate(),                    //日   
            "h+": this.getHours(),                   //小时   
            "m+": this.getMinutes(),                 //分   
            "s+": this.getSeconds(),                 //秒   
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度   
            "S": this.getMilliseconds()             //毫秒   
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }
})();

