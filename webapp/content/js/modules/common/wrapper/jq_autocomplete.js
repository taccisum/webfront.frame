/**
 * @author tac
 * @desc 封装jquery自动补全插件，使用缺省参数将其封装成模板
 * @see jquery.js jquery-ui.js jq_extend.js
 */

define([], function () {
    function DefConfig() {
        /**
         * 此处需注意：
         * 使用jq_autocomplete插件传入的对象数组必须含有value, label, desc(可选，这个是在原插件的基础上加的)字段
         */
        this.source = [];       //数据源
        this.delay = 0;     //输入内容后autocomplete提示出现的时间间隔
        this.height = 300;      //容器高度，内容超过该高度时将出现滚动条
        this.width = 150;       //容器宽度，至少为目标input框的宽度，小于该宽度时填写width无效
        this.zindex = 9999; //设置为9999使autocomplete框总显示在最上层

        //已失效参数
        this.appendTo = "";     //封装后该配置填写无效，容器会自动创建，可通过id属性配置自动创建的窗器id

        //自定义配置参数
        this.id = null;     //autocomplete容器的id，若不填写，则默认为一串随机生成的guid
    }; //默认配置

    return {
        selector: "",
        load: function (config) {
            var conf = $.extend(new DefConfig(), config);
            var $this = $(this.selector);

            //
            conf = $.extend(conf, {
                focus: function(event, ui) {
                    $this.val(ui.item.label);
                    $this.attr("data-val", ui.item.value);

                    if ($.isFunction(config.focus)) {
                        config.focus();
                    }
                    return false;
                },
                select: function(event, ui) {
                    $this.val(ui.item.label);
                    $this.attr("data-val", ui.item.value);

                    if ($.isFunction(config.select)) {
                        config.select();
                    }
                    return false;
                },
                descFormatter: function (item) {
                    if ($.isFunction(config.descFormatter))
                        return config.descFormatter(item);
                    return item.desc;
                }
            });

            if (conf.id == null) {
                conf.id = $.newPseudoGuid();
            }
            if ($("#" + conf.id).length <= 0) {
                $("#jq-ui-autocomplete-container").append($("<div id='" + conf.id + "' class='ui-front'></div>"));
            }

            conf.appendTo = "#" + conf.id;

            var $r = $this.autocomplete(conf);


            //show description
            $r.data("ui-autocomplete")._renderItem = function(ul, item) {
                var $html = $("<li>");

                var desc = conf.descFormatter(item);

                if ($.isNullOrEmptyString(desc)) {
                    $html.append("<a><span class='bold'>" + item.label + "</span></a>");
                } else {
                    $html.append("<a><span class='bold'>" + item.label + "</span><br /><span style='font-size: 8px;'>" + desc + "</span></a>");
                }
                return $html.append("<hr style='height:5px; margin:0;' />").appendTo(ul);
            };

            $("#" + conf.id + " .ui-autocomplete").css({
                "max-height": conf.height + "px",
                "min-width": conf.width + "px",
                "overflow-y": "auto",
                /* 防止水平滚动条 */
                "overflow-x": "hidden",
                "z-index": conf.zindex
                //todo:: 可在这里添加更多的样式配置参数
            });

            return $r;
        }
    }
})
