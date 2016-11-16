/**
 * @author tac
 * @desc 此js是为了使ace.js能通过requireJS加载而从ace.{min.}js抽离出来的
 */

jQuery(function (a) {
    window.ace.click_event = a.fn.tap ? "tap" : "click"
});
jQuery(function (a) {
    ace.handle_side_menu(jQuery);
    ace.enable_search_ahead(jQuery);
    ace.general_things(jQuery);
    ace.widget_boxes(jQuery);
    ace.widget_reload_handler(jQuery)
});