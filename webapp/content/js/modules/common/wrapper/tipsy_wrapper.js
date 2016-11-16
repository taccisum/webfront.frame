define(["tipsy"], function() {
    function DefConfig() {
        //plugin config
        //this.gravity = 'n';      //arrow direction use [nw | n | ne | w | e | sw | s | se], or $.fn.tipsy.autoNS
        //this.fade = false;       //fade in&fade out
        this.title = "title";       //tooltip content attribute
        this.fallback = "use '<span class='bold'>" + this.title + "</span>' attribute to show you tooltip";      //placeholder when title attribute undefined or empty
        this.html = true;       //support html content
        //this.delayIn = 500;     //
        //this.delayOut = 500;
        this.opacity = 0.75;       //opacity of tooltip
        //this.offset= 0;     // pixel offset of tooltip from element

        //custom config
        //this.content = "";
    };      //default config
    return {
        /**
         * 
         * @param {} selector jquery selector or jquery object of HTMLElement
         * @param {} config 
         * @returns {object} custom api
         * {function} content(str) modify tip content
         * {function} show() show tip, not null when config's trigger is 'manual'
         * {function} hide() hide tip, not null when config's trigger is 'manual'
         */
        tip: function (selector, config) {
            var target;
            if (typeof selector == "string") {
                target = $(selector);
            } else {
                target = selector;
            }

            var conf = {};
            var api = {};
            var api_extend = {};

            if (typeof config == "string") {
                conf = config;
                target.tipsy(conf);
            }else if (typeof config == "object") {
                conf = $.extend(true, new DefConfig(), config);
                if (conf.content) {
                    target.attr(conf.title, conf.content);
                }

                if (conf.trigger == "manual") {
                    api_extend = {
                        show: function() {
                            target.tipsy("show");
                        },
                        hide: function() {
                            target.tipsy("hide");
                        }
                    }
                }
            }

            api = {
                content: function(str) {
                    target.attr(conf.title, str);
                }
            };

            target.tipsy(conf);

            return $.extend(api, api_extend);
        }
    }
})