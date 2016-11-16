/**
 * @author tac
 * @desc jQuery插件（常用函数封装）
 * @see jquery.js
 */


define(["jquery"], function (jQuery) {
    (function ($) {
        //封装全局函数的插件
        $.extend({
            //从当前页面的url中根据key搜索对应参数值并返回
            //key: string 参数名
            //ignoreCase: bool 匹配参数时是否区分大小写，true: 不区分，false: 区分
            //return: string 第一个匹配到的参数值或空字符串（参数不存在）
            "getQueryParam": function (key, ignoreCase) {
                if (typeof key == "undefined" || key == null) {
                    throw new Error("missing argument \"key\"");
                }

                var reg;
                if (ignoreCase) {
                    reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)", "i");
                } else {
                    reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
                }
                var r = window.location.search.substr(1).match(reg);
                if (r != null) {
                    return unescape(r[2]);
                }
                return "";
            },

            //从给定的url中设置将指定的key值设为val
            //url: string url
            //key: bool 参数名
            //val: string 值，null表示remove key
            //ignoreCase: ignoreCase: bool 匹配参数时是否区分大小写
            //return: 修改后的url
            "setQueryParam": function (url, key, val, ignoreCase) {
                if (typeof url == "undefined" || url == null) {
                    throw new Error("missing argument \"url\"");
                }
                if (typeof key == "undefined" || key == null) {
                    throw new Error("missing argument \"key\"");
                }

                var reg;
                if (ignoreCase) {
                    reg = new RegExp("(^|&|\\?)(" + key + "=.*?)(&|$)", "i");
                } else {
                    reg = new RegExp("(^|&|\\?)(" + key + "=.*?)(&|$)");
                }
                var r = url.match(reg);

                if (r != null) {
                    return url.replace(unescape(r[2]), key + "=" + val);
                } else {
                    if (url.match(/\?.+$/) != null) {
                        //domain?param=val 格式
                        url += "&" + key + "=" + val;
                    } else {
                        if (url.match(/\?$/) != null) {
                            //domain 格式
                            url += key + "=" + val;
                        } else {
                            //domain? 格式
                            url += "?" + key + "=" + val;
                        }
                    }
                    return url;
                }
            },

            //将选中的控件序列化为object对象
            //selector: string jQuery选择器
            //return: 以{name: value}的形式构成的object
            "getValues": function (selector) {
                if (typeof selector == "undefined") {
                    throw new Error("missing argument \"selector\"");
                }

                var params = new Object();
                $.each($(selector).serializeArray(), function (index, item) {
                    params[item.name] = item.value.trim();
                });
                return params;
            },

            //生成一个由随机数组成的伪Guid
            //return: 随机生成的32位Guid字符串
            "newPseudoGuid": function () {
                var guid = "";
                for (var i = 1; i <= 32; i++) {
                    var n = Math.floor(Math.random() * 16.0).toString(16);
                    guid += n;
                    if ((i == 8) || (i == 12) || (i == 16) || (i == 20))
                        guid += "-";
                }
                return guid;
            },

            //判断传入字符串是否为空字符串或null或undefined
            //return: 
            "isNullOrEmptyString": function (str) {
                return (typeof (str) == "undefined" || str == null || str.trim() == "");
            },


            //判断传入对象是否为null或undefined
            //return: 
            "isNull": function (obj) {
                return (typeof (obj) == "undefined" || obj == null);
            },

            //判断传入对象是否为function
            //return: 
            "isFunction": function (str) {
                return typeof (str) == "function";
            },

        });

        //封装jQuery对象方法的插件
        $.fn.extend({
            //将jQuery对象值全部置为空或指定值
            //value: string 要设置的值，不指定则置为空
            "reset": function (value) {
                if (typeof value == "undefined") {
                    value = "";
                }

                this.each(function () {
                    $(this).val(value);
                });
                return this;
            }

        });
    })(jQuery);
})

