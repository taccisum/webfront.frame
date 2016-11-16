/**
 * @author tac
 * @date 16/09/08
 * @desc 系统前端工具模块扩展，用于引入一些不常用的系统工具（如：图片上传工具、html编程器等）。
 * 引入本模块的目的主要是为了减少一些不必要（对于大多数页面来说）的js的加载以提高页面加载速度。
 * @important tips 参考systools.js
 */
define(["systools", "w_gridster", "w_jcrop"], function (tool, gridster, jcrop) {
    var toolExt = {
        /**
         * 上传图片截图工具(弹出框)
         * @param {} target  selector
         * @param {} conf   配置参数
         * conf   配置参数详解
         * onCut ：function(files,args){}  截取图片函数，在此获取图片文件和截取图的坐标参数，并提交到后台进行实际裁剪压缩
         * onSelect：function() {} 选框选定时事件
         * showCut ：false  初始化是否显示裁剪选框 (默认值为false)
         * onRelease : function() {}  	取消选框时事件
         * initSize: [100,100]            初始时裁剪框大小 ,默认值[100,100]
         * maxSize:   [0,0]	    裁剪选框的最大尺寸
         * minSize:   [0,0]   	裁剪选框的最小尺寸
         * aspectRatio:0    裁剪选框的宽高比： width/height
         * showCoord  false	是否展示裁剪坐标系数
         * showCenter true    裁剪框初始位置，默认（true）居中   如果是false 则是左上角
         * fixedSize  [0,0]     固定的裁剪框大小 
         * imgBoxMaxSize [800,600]	 初始化时渲染图片的区域大小，当图片实际宽高超过此数是会缩小图，缩小的系数为 此宽/图片宽，此高/图片高，取两者中小的数为系数进行缩小
         * @returns {} 
         */
        cropper: function (target, conf) {

            //四舍五入取整数
            function getInt(num) {
                return Math.round(num);
            }

            function getFileUrl($target) {
                var url = "";
                if (navigator.userAgent.indexOf("MSIE") >= 1) { // IE
                    url = $target[0].value;
                } else if (navigator.userAgent.indexOf("Firefox") > 0) { // Firefox
                    url = window.URL.createObjectURL($target[0].files.item(0));
                } else if (navigator.userAgent.indexOf("Chrome") > 0) { // Chrome
                    url = window.URL.createObjectURL($target[0].files.item(0));
                }
                return url;
            }

            var $tar = $(target);
            var $fileInput = $("<input style='display:none;' type='file' accept='image/gif, image/bmp,image/jpeg,image/png'/>");
            $tar.after($fileInput);

            var content;       //点击按钮时才渲染

            $tar.on("click", function () {
                content = (function (showCoord) {
                    var _$content = $("<div></div>");

                    var imgId = $.newPseudoGuid();
                    var $imgDiv = $("<center></center>");
                    var $img = $("<img i='" + imgId + "' id='" + imgId + "'></img>");

                    var $coordText = $("<div style='display:none;text-align:center;padding:5px'></div>");
                    var $x = $("<span></span>");
                    var $y = $("<span></span>");
                    var $w = $("<span></span>");
                    var $h = $("<span></span>");

                    $imgDiv.append($img);
                    $coordText.append("<span style='font-weight:bold'>&nbsp;X:&nbsp;</span>").append($x).append("<span style='font-weight:bold'>&nbsp;Y:&nbsp;</span>").append($y)
                        .append("<span style='font-weight:bold'>&nbsp;W:&nbsp;</span>").append($w).append("<span style='font-weight:bold'>&nbsp;H:&nbsp;</span>").append($h);
                    _$content.append($coordText);
                    _$content.append($imgDiv);

                    if (showCoord) {
                        $coordText.show();
                    }
                    return {
                        $this: _$content,
                        img: {
                            $this: $img,
                            id: imgId
                        },
                        x: {
                            $this: $x
                        },
                        y: {
                            $this: $y
                        },
                        w: {
                            $this: $w
                        },
                        h: {
                            $this: $h
                        }
                    };
                })(conf.showCoord);        //渲染dialog内容
                $fileInput.click();
            });

            $fileInput.on("change", function () {
                var clear = function () {
                    $fileInput.val("");
                }

                var url = getFileUrl($fileInput);
                content.img.$this.attr("src", url);

                var img = new Image();
                img.src = url;

                img.onload = function () {
                    var imgW = this.width;
                    var imgH = this.height;

                    //判断上传图片的宽高是否小于裁剪框的框高，是的话就不执行
                    if (conf.minSize != null && (imgW < conf.minSize[0] || imgH < conf.minSize[1])) {
                        tool.msgbox("<div class='msgbox-text'>上传图片尺寸太小，请上传" + conf.minSize[0] + "*" + conf.minSize[1] + "以上的图片</div>", "n");
                        clear();
                        return false;
                    }
                    if (conf.fixedSize != null && (imgW < conf.fixedSize[0] || imgH < conf.fixedSize[1])) {
                        tool.msgbox("<div class='msgbox-text'>上传图片尺寸太小，请上传" + conf.fixedSize[0] + "*" + conf.fixedSize[1] + "以上的图片</div>", "n");
                        clear();
                        return false;
                    }
                    //裁剪
                    var onCut = function () {
                        var args = {
                            x: getInt(content.x.$this.text()),
                            y: getInt(content.y.$this.text()),
                            width: getInt(content.w.$this.text()),
                            height: getInt(content.h.$this.text())
                        };
                        if (typeof conf.onCut == "function") {
                            if (conf.onCut($fileInput[0].files, args)) {
                                clear();
                                tool.msgbox("上传成功", "y");
                                return true;
                            } else {
                                tool.msgbox("上传失败", "n");
                                return false;
                            }
                        } else {
                            throw new Error("cropper(): onCut is required");
                        }
                    }
                    var jcrop_api;
                    //弹出框加载页面
                    var d_instance = tool.dialog({
                        title: "裁剪图片",
                        content: content.$this,
                        onshow: function () {
                            if (jcrop_api) {
                                //切换图片的时候，把原来的JCrop对象先销毁
                                jcrop_api.destroy();
                            };
                            var maxW = 800;
                            var maxH = 600;
                            if (conf.imgBoxMaxSize) {
                                maxW = conf.imgBoxMaxSize[0] || 800;
                                maxH = conf.imgBoxMaxSize[1] || 600;
                            }
                            //获取图片的缩小系数 reductNum
                            var reductNum;
                            var boxwidth = imgW > maxW ? maxW : imgW;
                            var boxheight = imgH > maxH ? maxH : imgH;

                            if (boxwidth / imgW == 1 && boxheight / imgH == 1) {
                                reductNum = 1;
                            }
                            else {
                                reductNum = boxwidth / imgW < boxheight / imgH ? boxwidth / imgW : boxheight / imgH;
                            }
                            //初始化jcrop
                            jcrop.jcrop_proxy("#" + content.img.id, {

                                boxWidth: boxwidth,
                                boxHeight: boxheight,

                                onChange: function (c) {
                                    content.x.$this.text(getInt(c.x));
                                    content.y.$this.text(getInt(c.y));
                                    content.w.$this.text(getInt(c.w));
                                    content.h.$this.text(getInt(c.h));
                                },
                                //裁剪选框选定时事件
                                onSelect: conf.onSelect,
                                //裁剪选框内双击事件
                                onDblClick: function () {
                                    if (onCut()) {
                                        d_instance.remove();
                                    }
                                },
                                //取消裁剪选框时事件
                                onRelease: conf.onRelease,
                                callback: function (api) {
                                    jcrop_api = api;
                                    //裁剪框的最大尺寸（大于等于初始化裁剪框的大小）
                                    if (conf.maxSize) {
                                        if (conf.initSize && conf.initSize[0] > conf.maxSize[0] && conf.initSize[1] > conf.maxSize[1]) {
                                            conf.initSize = [conf.maxSize[0], conf.maxSize[1]];
                                        }
                                        api.setOptions({
                                            maxSize: [conf.maxSize[0] * reductNum, conf.maxSize[1] * reductNum]
                                        });
                                    };
                                    //裁剪框的最小尺寸（小于等于初始化裁剪框的大小）
                                    if (conf.minSize) {
                                        if (conf.initSize && conf.initSize[0] < conf.minSize[0] && conf.initSize[1] < conf.minSize[1]) {
                                            conf.initSize = conf.minSize;
                                        }
                                        api.setOptions({
                                            minSize: conf.minSize
                                        });
                                        conf.showCut = true;
                                    };

                                    //裁剪框大小固定参数
                                    if (conf.fixedSize) {
                                        api.setOptions({
                                            minSize: conf.fixedSize,
                                            maxSize: [conf.fixedSize[0] * reductNum, conf.fixedSize[1] * reductNum]
                                        });
                                        if (conf.showCenter == false) {
                                            api.animateTo([0, 0, conf.fixedSize[0], conf.fixedSize[1]]);
                                        }
                                        else {
                                            api.animateTo([imgW / 2 - conf.fixedSize[0] / 2, imgH / 2 - conf.fixedSize[1] / 2, imgW / 2 + conf.fixedSize[0] / 2, imgH / 2 + conf.fixedSize[1] / 2]);
                                        }
                                        conf.showCenter = true;
                                        conf.showCut = false;
                                        conf.initSize = null;
                                        conf.aspectRatio = null;
                                    }
                                    //裁剪框宽高比例
                                    if (conf.aspectRatio != null) {
                                        api.setOptions({
                                            aspectRatio: conf.aspectRatio,
                                        });
                                    }
                                    //指定了裁剪框不居中显示,则在左上角显示
                                    if (conf.showCenter == false) {
                                        //判断是否指定了初始化裁剪框大小和宽高比例
                                        //指定了初始化裁剪框大小
                                        if (conf.initSize != null) {
                                            var temp = conf.initSize[0] / conf.initSize[1];
                                            //未指定初始化宽高比例  或指定的裁剪框大小宽高比例等于指定的宽高比例
                                            if (conf.aspectRatio == null || conf.aspectRatio == temp) {
                                                api.animateTo([0, 0, conf.initSize[0], conf.initSize[1]]);
                                            }//指定的裁剪框大小宽高比例不等于指定的宽高比例，则用默认100*100
                                            else {
                                                api.animateTo([0, 0, 100, 100]);
                                            }
                                        }//未指定初始化裁剪框大小
                                        else {
                                            //在同时没有指定宽高比和裁剪框大小的时候默认创建100X100裁剪框
                                            if (conf.aspectRatio == null) {
                                                api.animateTo([0, 0, 100, 100]);
                                            } else {
                                                //指定了宽高比未指定裁剪框大小
                                                api.animateTo([0, 0, 100 * conf.aspectRatio, 100]);
                                            }
                                        }
                                        conf.showCut = false;
                                        conf.initSize = null;
                                    }
                                    //没有指定裁剪框初始显示位置则默认居中显示，指定showCenter==true 也居中显示
                                    if (conf.showCut || conf.initSize) {
                                        //指定了初始化裁剪框大小
                                        if (conf.initSize != null) {
                                            var temp = conf.initSize[0] / conf.initSize[1];
                                            //未指定初始化宽高比例  或指定的裁剪框大小宽高比例等于指定的宽高比例
                                            if (conf.aspectRatio == null || conf.aspectRatio == temp) {
                                                api.animateTo([imgW / 2 - conf.initSize[0] / 2, imgH / 2 - conf.initSize[1] / 2, imgW / 2 + conf.initSize[0] / 2, imgH / 2 + conf.initSize[1] / 2]);
                                            } //指定的裁剪框大小宽高比例不等于指定的宽高比例，则用默认100*100
                                            else {
                                                api.animateTo([imgW / 2 - 50.5, imgH / 2 - 50, imgW / 2 + 50, imgH / 2 + 50]);
                                                conf.aspectRatio = null;
                                            }
                                        } //未指定初始化裁剪框大小
                                        else {
                                            //在同时没有指定宽高比和裁剪框大小的时候默认创建100X100居中的裁剪框
                                            if (conf.aspectRatio == null) {
                                                api.animateTo([imgW / 2 - 50.5, imgH / 2 - 50, imgW / 2 + 50, imgH / 2 + 50]);
                                            } else {
                                                //指定了长宽比未指定裁剪框大小
                                                api.animateTo([imgW / 2 - 50.5 * conf.aspectRatio, imgH / 2 - 50, imgW / 2 + 50 * conf.aspectRatio, imgH / 2 + 50]);
                                            }
                                        }
                                    }
                                    d_instance.reset();
                                }
                            });
                        },
                        button: [
                            {
                                preset: "cancel",
                                callback: clear
                            },
                            {
                                id: "cut",
                                value: "<i class='icon-ok'></i>裁剪",
                                cls: "btn btn-success btn-sm",
                                callback: function () {
                                    return onCut(d_instance);
                                }
                            }
                        ],
                        timer: 0
                    });
                    d_instance.showModal();
                };
            });
        },


        /**
         * @desc 弹出一个窗口，可通过拖放弹窗内生成的内容进行布局
         * @param {object} conf 详细见w_gridster模块，除了插件自带的配置参数外，还封装了以下自定义参数：
         * {string} conf.id 容器的id，默认为一个随机的guid。
         * {string} conf.cursor widget的cursor样式，默认为pointer
         * {int} conf.width dialog宽度所能容纳的列数，以一个widget的宽度为单位，超过这个宽度将出现滚动条。
         * {int} conf.height dialog高度所能容纳的行数，以一个widget的高度为单位，超过这个高度将出现滚动条。
         * {function} conf.onSubmit(data) 点击dialog的提交按钮时触发的回调事件，data为widgets序列化对象
         * @param {array} widgets数据 item必须要有3个属性：id, row, col，非必需属性sizex, sizey, color, content
         * @returns {object} Gridster实例
         */
        layout: function (conf, widgets) {
            var _outInstance;

            //private method
            /**
             * @desc 检查必要参数
             * @returns {void} 
             */
            var checkArgs = function() {
                if (!widgets) {
                    throw new Error("gridster(): arg widgets is required");
                }

                if (!conf.id) {
                    conf.id = $.newPseudoGuid();
                }
            }
            /**
             * @desc 将数据渲染成HTMLElement
             * @param {array} widgets数据
             * @returns {HTMLElement} jQuery HTMLElement
             */
            var render = function(array) {
                var _$content = $("<div id='" + conf.id + "' class='gridster'></div>");
                var $el = $("<ul></ul>");
                $el.css("list-style", "none");

                $.each(array, function (index, item) {
                    var $widget = $("<li></li");
                    $widget.attr({
                        "id": item.id,
                        "data-row": item.row,
                        "data-col": item.col,
                        "data-sizex": item.sizex || 1,
                        "data-sizey": item.sizey || 1,
                    });
                    $widget.css({
                        "background-color": item.color || "gray",
                        "cursor": conf.cursor || "pointer",
                        "opacity": 0.8
                    });
                    $widget.html(item.content || "widget");
                    $el.append($widget);
                });
                _$content.append($el);

                return _$content;
            }
            /**
             * @desc 根据参数计算弹窗尺寸
             * @param {} width 列数
             * @param {} height 行数
             * @param {} widget_margins widget的边距
             * @param {} widget_base_dimensions widget的尺寸
             * @returns {object} 计算得出的弹窗宽和高
             */
            var calc_dialog_size = function(width, height, widget_margins, widget_base_dimensions) {
                var _width;
                var _height;
                if (width) {
                    var _w = 0;
                    if (widget_margins) {
                        _w += (widget_margins[0] || 5) * 2;
                    } else {
                        _w += 5 * 2;
                    }
                    if (widget_base_dimensions) {
                        _w += widget_base_dimensions[0] || 80;
                    } else {
                        _w += 80;
                    }
                    _width = _w * width + 40; //因为设置的是dialog的宽度，所以要留出一部分padding
                }

                if (height) {
                    var _h = 0;
                    if (widget_margins) {
                        _h += (widget_margins[1] || 5) * 2;
                    } else {
                        _h += 5 * 2;
                    }
                    if (widget_base_dimensions) {
                        _h += widget_base_dimensions[1] || 80;
                    } else {
                        _h += 80;
                    }
                    _height = _h * height;
                }

                return {
                    width: _width || "",
                    height: _height || "800px"
                };
            }
            /**
             * @desc 修改一些默认参数
             * @param {object} conf 配置参数
             * @returns {void} 
             */
            var preset = function(conf) {
                if (!conf.serialize_params) {
                    conf.serialize_params = function($w, wgd) {
                        return {
                            id: $w.attr("id"),
                            col: wgd.col,
                            row: wgd.row,
                            size_x: wgd.size_x,
                            size_y: wgd.size_y,
                            color: $w.css("background-color"),
                            content: $w.text(),
                            //todo:: more info
                        }
                    }
                }
            }
            /**
             * @desc 关闭dialog时执行，垃圾清理
             * @returns {void} 
             */
            var destroy = function () {
                _outInstance.destroy();
            }

            checkArgs();
            var d_size = calc_dialog_size(conf.width, conf.height, conf.widget_margins, conf.widget_base_dimensions);
            var $content = render(widgets);
            $content.css("max-height", d_size.height); //超过此高度将出现滚动条
            preset(conf);

            tool.dialog({
                content: $content,
                width: d_size.width,
                title: "调整布局",
                button: [
                    {
                        preset: "cancel",
                        callback: function() {
                            destroy();
                            return true;
                        }
                    },
                    {
                        id: "add",
                        value: "<i class='icon-plus'></i>&nbsp;新增",
                        callback: function() {
                            alert("这里写新增的回调事件");
                            return false;
                        },
                        cls: "btn btn-info btn-sm",
                    },
                    {
                        id: "submit",
                        value: "<i class='icon-ok'></i>&nbsp;提交",
                        callback: function () {
                            var r = conf.onSubmit(_outInstance.serialize());
                            destroy();
                            return r;
                        },
                        cls: "btn btn-primary btn-sm",
                    },
                    {
                        preset: "ok",
                        callback: function() {
                            alert("预置的ok按钮回调，预置按钮不写回调默认操作关闭对话框");
                            destroy();
                            return true;
                        }
                    },
                ],
                onshow: function() {
                    gridster.selector = "#" + conf.id + " ul";
                    _outInstance = gridster.load(conf);
                }
            }).showModal();

            return _outInstance;
        },


        /**
         * @todo:: implement
         * @desc 指定一个标签，以其为基础生成html编辑器
         * @returns {} 
         */
        htmlEditor: function() {
            throw new Error("Method not implement");
        },


    };

    return $.extend(tool, toolExt);
});