/**
 * @author tac
 * @desc 封装art dialog插件，使用缺省参数将其封装成模板
 * @see jquery.js dialog.js
 */
define(["artDialog"], function () {
    var btn = {
        "cancel": {
            id: "cancel",
            value: "<i class='icon-remove'></i>&nbsp;取消",
            callback: function() {
                return true;
            },
            cls: "btn btn-default btn-sm",
        },
        "ok": {
            id: "ok",
            value: "<i class='icon-ok'></i>&nbsp;确认",
            callback: function() {
                return true;
            },
            cls: "btn btn-success btn-sm",
        }
    };      //预置的按钮

    var icon = {
        "y": ["icon-ok-sign", "#87b87f"],
        "n": ["icon-remove-sign", "#d15b47"],
        "i": ["icon-info-sign", "#6fb3e0"],
        "w": ["icon-exclamation-sign", "#ffb752"],
        "q": ["icon-question-sign", "#428bca"]
    };

    function DefConfig() {
        this.fixed = true;      //是否固定dialog，若使用showModal()进行展示，则背景会加上一层遮罩
        this.title = "系统窗口";
    }; //dialog 默认配置

    function DefConfig1() {
        this.title = "系统提示";
        this.quickClose = true;     //快速关闭（可通过esc或点击dialog以外的区域关闭）
        this.timer = 3000;      //存在时间
        this.content = "<table style='width:100%; min-width: 220px; max-width:600px;'><tr>" +
            "<td class='text-center msgbox-text' style='vertical-align: middle; width:100%; word-break:break-all; color: gray;'>@msg</td>" +
            "</tr></table>";
    }; //message box默认配置

    var isNull = function(obj) {
        return typeof obj == "undefined" || obj == null;
    }


    return {
        dialog: function(config) {
            var conf = $.extend(new DefConfig(), config);
            for (var index in conf.button) {
                if (conf.button.hasOwnProperty(index)) {
                    //preset的类型是string，则从预置中获取btn并覆盖之前btn对象
                    var item = conf.button[index].preset;
                    var callback = conf.button[index].callback;
                    if (typeof item == "string") {
                        if (isNull(btn[item])) {
                            delete conf.button[index]; //未在预置按钮中找到，则不展示
                        } else {
                            conf.button[index] = btn[item];
                            if (typeof callback == "function") {
                                conf.button[index].callback = callback;     //覆盖回调
                            }
                        }
                    }
                }
            }

            var d = dialog(conf);

            return d;
        },

        msgbox: function (config) {
            if (isNull(config.content)) {
                throw Error("msgbox(): argument msg is required");
            }

            if (isNull(config.icon)) {
                config.icon = "i";
            }

            var conf = new DefConfig1();
            conf.button = config.button;

            //title
            conf.title = "<span style='color: @color;'><i class='@icon' style='margin-right: 5px;'></i>";
            if (!isNull(config.title)) {
                conf.title += config.title + "</span>";
            }
            //timer
            if (!isNull(config.timer)) {
                conf.timer = config.timer;
            }
            //icon
            var _icon = isNull(icon[config.icon]) ? icon["i"] : icon[config.icon];

            //replace placeholder
            conf.title = conf.title.replace("@icon", _icon[0]).replace("@color", _icon[1]);
            conf.content = conf.content.replace("@msg", config.content);

            var d = dialog(conf);
            d.show();

            setTimeout(function() {
                if (typeof d != "undefined")
                    d.close().remove();
            }, conf.timer);

            return d;
        }
    }
})