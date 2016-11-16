define([], function() {
    return {
        /**
         * @author tac
         * @param {} config 
         * {string} color 遮罩的颜色
         * {int} opacity 遮罩透明度
         * {int} z_index 遮罩z轴位置
         * {string} content 遮罩显示内容（位置在遮罩正中间）
         * {function} onclick 遮罩点击事件
         * @returns {HTMLElement} jQuery object of HTMLElement
         */
        shade: function (config) {
            var _api;
            var $div = $("<div></div>");
            $div.css({
                "position": "fixed",
                "top": "0",
                "left": "0",
                "width": "100%",
                "height": "100%",
                "overflow": "hidden",
                "background-color": config.color || "#000000",
                "opacity": config.opacity || (config.opacity == 0 ? "0" : "0.3"),
                "z-index": config.z_index || "1099"
            });

            _api = {
                destroy: function () {
                    $div.remove();
                    delete _api;
                }
            }

            if (config.content) {
                var $content = $("<table style='width:100%; height:100%;'><tr><td style='vertical-align: middle; text-align: center; color: #fff;'>" + config.content + "</td></tr></table>");
                $div.append($content);
            }

            if (typeof config.onclick == "function") {
                $div.on("click", function() {
                    config.onclick(_api);
                });
            }


            $("body").append($div);
            $div.data("api", _api);
            return $div;
        }
    }
})