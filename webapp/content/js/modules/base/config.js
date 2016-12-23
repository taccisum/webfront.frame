/**
 * @author tac
 * @desc requireJS配置及常用模块路径
 * @date 16/09/05
 */

(function () {
    //path
    var base = "base/";
    var common = "common/";
    var wrapper = common + "wrapper/";
    var scripts = "../";
    var jq_plugins = scripts + "jquery/plugins/";
    var css = "../../css/";
    var ace = "../../ace.admin/";

    require.config({
        baseUrl: "content/js/modules",
        paths: {
            ///public
            "base": base + "base",
            "mockdata": common + "mockdata",
            "sidebar": "view.js/shared/sidebar",
            "systools": common + "systools",
            "systools-plus": common + "systools-plus",
            "auto_tips": common + "auto_tips",
            "icon_selector": common + "icon_selector",
            
            
            
            ///private
            //common
            "jquery": scripts + "jquery/jquery-1.9.1.min",
            "bootstrap": css + "bootstrap/js/bootstrap",
            "ace-init": ace + "assets/js/ace-init",
            "ace": ace + "assets/js/ace",
            "ace-extra": ace + "assets/js/ace-extra.min",
            "ace-element": ace + "assets/js/ace-elements.min",            
            "jq_ext": common + "jq_extend",
            "js_ext": common + "js_extend",
            "global": common + "global",
            "w_shade": wrapper + "myshade",
            "mockjs": scripts + "mockjs/mock",
            "composite": scripts + "class/composite",
            "list": scripts + "class/list",

            //wrapper
            "w_datatables": wrapper + "datatables",
            "w_art_dialog": wrapper + "artDialog",
            "w_jq_ac": wrapper + "jq_autocomplete",
            "w_gridster": wrapper + "gridster",
            "w_jcrop": wrapper + "jcrop",
            "w_tipsy": wrapper + "tipsy_wrapper",

            //plugins
            "datatables": jq_plugins + "datatables/dataTables",
            "artDialog": jq_plugins + "artDialog/dist/dialog-plus",
            "gridster": jq_plugins + "gridster/jquery.gridster",
            "jcrop": jq_plugins + "jcrop/js/jquery.Jcrop",
            "tipsy": jq_plugins + "tipsy/javascripts/jquery.tipsy",
        },
        shim: {
            //为一些非amd规范的js提供依赖
            "bootstrap": ["jquery"],
            "tipsy": ["jquery"],
            "ace-init": ["jquery", "ace"],
            "ace": ["jquery", "ace-extra"],
            "ace-extra": ["jquery"],
            "artDialog": ["jquery"],
        }
    });
})();
