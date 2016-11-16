/**
 * @author tac
 * @desc 封装gridster.js插件，使用缺省参数将其封装成模板
 * @see jquery.js jquery.gridster.js
 */
define(["gridster"], function () {
    /**
     * @desc 以下配置中注释掉的部分表示使用插件默认配置值
     */
    var defConfig = {
        //插件提供的配置
        //auto_init: true,      //是否自动初始化，为false时要手动调用api的init方法
        //widget_selector: "li",        //确定哪个元素是widget
        widget_margins: [5, 5], //[左右, 上下]widget的边距
        widget_base_dimensions: [80, 80], //[宽, 高]面积大小

        //autogenerate_stylesheet: true,        //允许通过CSS自动生成，例如：[data-col="1"] { left: 10px; }
        //avoid_overlapped_widgets: true,       //不允许widgets加载的时候重叠（如从数据库加载widgets时数据错误）

        //extra_rows: 0,        //增加更多的横数确保空隙合适
        //extra_cols: 0,        //增加更多的列数确保空隙合适

        max_size_x: 6,        //一个widget最大多少列
        max_size_y: 6,        //一个widget最大多少横

        //max_cols: null,       //最多创建多少列，null表示没有限制
        //max_rows: null,       //最多创建多少横，null表示没有限制
        //min_cols: 1,      //至少创建多少列
        //min_rows: 15,     //至少创建多少横

        //serialize_params: function($w, wgd) {
        //    return { col: wgd.col, row: wgd.row, size_x: wgd.size_x, size_y: wgd.size_y }
        //}     //返回序列化后widget的数据

        draggable: {
            //items: '.gs-w',       //把哪个class当做可拖动的控件
            //start: function (event, ui) { },
            //drag: function (event, ui) { },
            //stop: function (event, ui) { },
        }, //拖动事件

        resize: {
            enabled: false,
            //start: function (e, ui, $widget) { },
            //resize: function (e, ui, $widget) { },
            //stop: function (e, ui, $widget) { },
            //axes: ['both'],       //['both']等同['x','y']，不同的是both会给每个widget右下角添加一个handle，而后者需要通过边上拉伸来调整size

            //handle_class: 'gs-resize-handle',     //把某个class当做改变大小的控件
            //handle_append_to: '',     //set a valid CSS selector to append resize handles to. If value evaluates to false it's appended to the widget.
            max_size: [6, 6],       //widget的x和y轴最大尺寸，以一个widget_base_dimensions为一单位
            //min_size: [1, 1]      //widget的x和y轴最小尺寸，以一个widget_base_dimensions为一单位
        }, //改变大小事件

        collision: {
            //on_overlap_start: function (collider_data) { }, 
            //on_overlap: function (collider_data) { },
            //on_overlap_stop: function (collider_data) { },
        }, //碰撞/交互事件。稍微测试了一下，貌似有bug - v0.5.6


        //自定义配置
        //todo::
        //col: 6,
        //row: 8
    };   //默认配置


    //gridster 常用 api，可通过Gridster实例进行调用
    //gridster.disable();        //禁止拖动
    //gridster.enable( );       //允许拖动
    //gridster.disable_resize();        //禁止调整大小
    //gridster.enable_resize( );       //允许调整大小
    //gridster.add_widget(html, size_x, size_y, col, row, max_size, min_size);       //添加一个widget
    //gridster.remove_widget($widget, silent, callback)      //移除一个widget，silent为true时移除widget不会调整其余widget位置
    //gridster.remove_all_widgets(callback)      //移除所有widgets
    //gridster.resize_widget($widget, size_x, size_y, callback);        //调整widget的大小
    //gridster.serialize();        //返回经serialize_params函数序列化后的对象数组
    //gridster.serialize_changed();        //返回经serialize_params函数序列化后的对象数组，但只对变动过（宽高或位置）的widget进行序列化
    //gridster.destroy();        //


    return {
        selector: "",
        load: function(config) {
            var conf = $.extend(true, {}, defConfig, config);
            var $this = $(this.selector);

            return $this.gridster(conf).data("gridster");
        }
    }
})