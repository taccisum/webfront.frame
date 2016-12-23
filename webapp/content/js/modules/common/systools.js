/**
 * @author tac
 * @date 16/09/05
 * @desc 系统前端工具模块，用于管理当前系统框架中一些常用插件的使用。
 * @important tips
 * 1、本模块定义为系统前端工具的调用入口。如有需要修改当前已封装好的插件，请确保对该插件的使用已经非常熟悉，以免造成某些前端模块崩溃；
 * 2、非特殊情况下不能直接调用本模块中引入的插件，必须通过本模块提供的方法来使用这些插件；
 * 3、如果在系统中引入了新的插件，需对其进行适当的封装，然后在本模块添加新的调用入口，同时在ToolDemoController新增相应的使用演示demo页；
 */
define(["w_datatables", "w_jq_ac", "w_art_dialog", "w_tipsy", "w_shade"], function (dt, ac, dg, tp, shd) {
    var sys = {
        /**
         * @author tac
         * @desc 对ajax请求进行封装，处理诸如请求失败、异常等事件
         * @param {object} config 配置参数，详细参考ajax请求参数
         * @param {boolean} lock 在执行ajax请求时是否锁屏
         * @returns {void} 
         */
        ajax: function (config, lock) {
            function ScreenLocker(_lock) {
                var __lock = _lock;
                var $shade;

                this.lock = function() {
                    if (__lock && !$shade) {
                        $shade = sys.shade("loading");
                    }
                };
                this.unlock = function () {
                    if (__lock && $shade) {
                        $shade.data("api").destroy();
                        delete $shade;
                    }
                }
            }

            var locker = new ScreenLocker(lock);

            locker.lock();
            var conf = $.extend({
                timeout: 15000, //请求超时默认时间
            }, config);

            if (window.debug) {
                conf.timeout = null;
            }

            conf.success = function (result, textStatus) {
                locker.unlock();
                if (result.Success) {
                    if (result.message.trim().length > 0) {
                        sys.msgbox(result.message, "y");
                    }

                    if (typeof config.success == "function") {
                        config.success(result.Data, textStatus);
                    }
                } else {
                    sys.excpbox(result.Message, result.Exception);
                }
            };

            conf.error = function (XMLHttpRequest, textStatus, errorThrown) {
                locker.unlock();
                if (typeof config.error == "function") {
                    config.error(XMLHttpRequest, textStatus, errorThrown);
                } else {
                    sys.excpbox("请求失败", textStatus + ": " + XMLHttpRequest.status + " " + errorThrown);
                }
            };

            $.ajax(conf);
        },
        get: function (url, callback, lock) {
            sys.ajax({
                url: url,
                type: "get",
                success: callback
            }, lock);
        },
        post: function (url, data, callback, lock) {
            sys.ajax({
                url: url,
                data: data,
                type: "post",
                success: callback
            }, lock);
        },

        /**
         * @author tac
         * @desc 指定一个table标签，为其为基础生成datatables
         * @param {string} target 目标元素，格式为jquery-selector
         * @param {} config 参考jquery-datatables开发文档——http://datatables.club/reference/  16/09/08
         * @returns {object} datatables实例
         */
        table: function(target, config) {
            dt.selector = target;
            return dt.load(config);
        },
        /**
         * @author tac
         * @desc 指定一个input标签，为其添加自动补全功能
         * @param {string} target 目标元素，格式为jquery-selector
         * @param {config} config 参考jquery-Autocomplete开发文档——http://api.jqueryui.com/autocomplete/  16/09/08
         * @returns {object} 
         */
        autocomplete: function(target, config) {
            ac.selector = target;
            return ac.load(config);
        },

        /**
         * @author tac
         * @desc 弹出一个dialog（需使用返回值手动调用show()或showModal()显示dialog实例），显示指定内容
         * @param {object} config 参考artDialog.js开发文档——http://lab.seaning.com/_doc/API.html#show 16/09/08
         * @returns {object} artDialog实例
         */
        dialog: function(config) {
            return dg.dialog(config);
        },

        /**
         * @author tac
         * @desc 弹出一个dialog，通过selector指定页面上的html作为content（该html会从页面上被移除并缓存为字符串）
         * @todo::
         * @param {} selector jQuery选择器
         * @param {} callback 
         * @returns {} 
         */
        easydialog: function(selector, title, callback) {
            if (!window.easydialog_cache) {
                window.easydialog_cache = {};
            }

            var html = "";
            if (!window.easydialog_cache[selector]) {
                if ($(selector)[0]) {
                    html = $(selector)[0].outerHTML;
                    window.easydialog_cache[selector] = html;
                    $(selector).remove();
                }
            } else {
                html = window.easydialog_cache[selector];
            }

            var $target = $(html);

            var d = dg.dialog({
                id: selector,
                title: $target.data("title") || "系统窗口",
                content: $target,
                width: $target.data("width"),
                height: $target.data("height"),

            });
            d.showModal();
            return d;
        },

        /**
         * @author tac
         * @desc 弹出一个message box（排版固定），显示指定内容
         * @param {string} msg 要展示的信息，支持html
         * @param {string} icon 要显示的图片类型：y(yes)、n(no)、i(info)、w(warning)、q(question)
         * @param {number} timer box自动关闭时间，单位ms，小于等于0时不自动关闭
         * @param {string} title 标题，支持html
         * @returns {object} artDialog实例
         */
        msgbox: function(msg, icon, timer, title) {
            var config = {
                content: msg,
                icon: icon,
                title: title || "系统消息"
            };
            if (timer != null) {
                if (timer <= 0) {
                    config.timer = 10000000;
                } else {
                    config.timer = timer;
                }
            }

            return dg.msgbox(config);
        },

        /**
         * @author tac
         * @desc 弹出一个专用于展示异常信息的消息框
         * @param {string} msg 要展示的信息，支持html
         * @param {string} exception 要显示的异常信息
         * @param {number} timer box自动关闭时间，单位ms，null或小于等于0时不自动关闭
         * @param {string} title 标题，支持html
         * @returns {object} artDialog实例
         */
        excpbox: function(msg, exception, timer, title) {
            if (!msg) {
                throw new Error("excpbox(): msg is required");
            }
            var btns = [{
                id: "close",
                value: "<i class='icon-remove'></i>&nbsp;关闭",
                callback: function () {
                    return true;
                },
                cls: "btn btn-default btn-sm",
            }];
            if (exception) {
                btns.push({
                    id: "excp",
                    value: "<i class='icon-info-sign'></i>&nbsp;异常",
                    callback: function() {
                        alert(exception);
                        return false;
                    },
                    cls: "btn btn-info btn-sm",
                });
            }
            var config = {
                content: msg,
                icon: "n",
                title: title || "系统异常",
                button: btns
            };
            if (timer == null || timer <= 0) {
                config.timer = 10000000;
            } else {
                config.timer = timer;
            }


            return dg.msgbox(config);
        },

        /**
         * @author tac
         * 为指定标签添加trigger(hover/focus/…或其它)时显示tip的效果
         * @param {} selector jquery selector或jquery对象
         * @param {} config 参考tipsy的官方文档 http://onehackoranother.com/projects/jquery/tipsy/
         * @returns {object} 自定义的api
         */
        tip: function(selector, config) {
            return tp.tip(selector, config);
        },

        /**
         * @author tac
         * 创建一个全屏遮罩层
         * @param {object} config 参考myshade.js注释部分
         * @returns {} 
         */
        shade: function (config) {
            if (typeof config == "string") {
                switch (config) {
                case "loading":
                {
                    return shd.shade({
                        content: "<i style='font-size: 45px;' class='icon-spinner icon-spin'></i>"
                    });
                }
                case "blank":
                {
                    return shd.shade({
                        opacity: 0
                    });
                }
                default:
                {
                    return shd.shade({});
                }
                }
            }

            return shd.shade(config || {});
        },
    };

    return sys;
});