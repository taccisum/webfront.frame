
require(["base"], function(){

    if(DEBUG){
        require(["mockdata"], function(mock){
            window.mock = mock;
        })
    }

    require(["systools","sidebar"],function(tool, sbm){
        window.tool = tool;
        $.getJSON("data/menus.json", function (json) {
            var sidebar = sbm.newInstance(json, "#nav-list");
            sidebar.Load();
            sidebar.Open(sidebar.CurrentMenuId(), true);
        })
    })
});