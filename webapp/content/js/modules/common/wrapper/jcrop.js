
define(["jcrop"], function() {
    var api;        //初始化后才能获取到

    function DefConfig() {
        //自定义
        this.callback = function (api) {
        };
    }           //默认配置
    return {
        jcrop_proxy: function (selector, config) {
            var $this = $(selector);
            var conf = $.extend(new DefConfig(), config);
            $this.Jcrop(conf, function () {
                api = this;
                conf.callback(api);
            });
        }
    }
})
