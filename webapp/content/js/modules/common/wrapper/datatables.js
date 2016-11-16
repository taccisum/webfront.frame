/**
 * @author tac
 * @desc 封装datatabls插件，使用缺省参数将其封装成模板
 */
define(["datatables"],function(dt) {
        function DefConfig() {

            //datatables定义参数（部分）
            this.ordering = false;
            this.processing = true;
            this.scrollX = true; //宽度过大时x轴滚动
            this.filter = false; //搜索框
            this.stateSave = true; //再次加载页面时是否还原表格状态
            this.serverSide = true;
            this.pagingType = "full_numbers";
            this.language = {
                processing: "<p style='color:gray;'><i class='icon-spinner icon-spin'></i>&nbsp;&nbsp;正在加载…</p>",
                lengthMenu: " _MENU_ ",
                zeroRecords: "<span class='bold' style='color: salmon;'><i class='icon-search'></i>&nbsp;&nbsp;查询不到相关数据！</span>",
                info: "<span class='bold' style='font-size: 13px; color: royalblue;'>当前显示 _START_ ~ _END_ ，共 _TOTAL_ 条记录</span>",
                infoFiltered: "<span class='bold' style='font-size: 13px; color: royalblue;'>数据表中总共有 _MAX_ 条记录</span>",
                search: "搜索",
                paginate: {
                    first: "<i class='icon-fast-backward'></i>",
                    previous: "<i class='icon-step-backward'></i>",
                    next: "<i class='icon-step-forward'></i>",
                    last: "<i class='icon-fast-forward'></i>"
                }
            };

            //额外参数（用户自定义）
            this.select = true; //行是否可选
            this.hover = true;
            this.errorImg = "/Image/image_picture_128px_1132441_easyicon.net.png"; //表格内的img标签src404时的默认展示图片    todo:: 考虑会去掉该属性，让开发人员自己处理url 404的问题
            this.rowDbClick = function(api, rowData, tableData) {
            }; //行双击事件
            this.init = function(api, tableData) {

            }; //表格初始化事件
        }; //默认配置

        return {
            selector: "",

            load: function (config) {
                var $table = $(this.selector);

                var conf = $.extend(new DefConfig(), config);

                //todo
                if (typeof conf.width == "string") {
                    //通过正则判断是否有效格式, 50%                 

                } else if (typeof conf.width == "number") {

                }

                if (conf.hover) {
                    $table.addClass("display");
                } else {
                    $table.removeClass("display");
                }

                var table = $table.DataTable(conf); //datatables instance
                var api = $table.DataTable(); //datatables api
                var tableData = api.data(); //datatables table data

                if (conf.select) {
                    $table.find("tbody").on("click", "tr", function() {
                        $(this).toggleClass("selected");
                    });
                }

                if (typeof conf.rowDbClick == "function") {
                    $table.find("tbody").on("dblclick", "tr", function(indexes) {
                        var rowData = api.rows(this).data()[0];
                        conf.rowDbClick(api, rowData, tableData);
                    });
                }

                var errorImgHandler = function() {
                    return;
                }
                if (typeof conf.errorImg == "string") {
                    errorImgHandler = function() {
                        this.src = conf.errorImg;
                    }
                }

                //表格重绘事件
                $table.on("draw.dt", function() {
                    $table.find("img").bind("error", errorImgHandler); //处理error404的img
                });
                
                //表格初始化事件
                $table.on("init.dt", function () {
                    conf.init(api, tableData);
                });



                return table;

            }
        }
        
    }
)