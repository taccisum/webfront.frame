define(["systools"], function(tool) {
    return {
        /**
         * @author tac
         * @desc 对dom中的全部.auto-tip[title]标签调用tip()方法并移除class .auto-tip及attr title，
         * 本方法在页面加载完成后会调用一次，对于在页面加载完成后添加到dom中的标签，需要
         * 重新调用一次本方法以实现这些新增标签的tip效果
         * @returns {void} 
         */
        loadAutoTip: function() {
            $.each($(".auto-tip[title]"), function (index, item) {
                var $item = $(item);
                tool.tip($item, {
                    gravity: $item.data("tip-gravity"),
                    offset: $item.data("tip-offset"),
                    opacity: $item.data("tip-opacity"),
                    fade: $item.data("tip-fade"),
                    delayIn: parseInt($item.data("tip-delayin")) || 0,
                    delayOut: parseInt($item.data("tip-delayout")),
                    trigger: $item.data("tip-trigger") == "focus" ? "focus" : undefined
                });
                $item.removeClass("auto-tip");
            });
        }
    }
})