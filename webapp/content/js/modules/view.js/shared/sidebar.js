/**
 * @file Sidebar.js
 * @see jquery.js Composite.js
 * @author tac
 * @desc side bar 菜单管理模块，提供一系列操作左侧菜单的api
 */
define(["systools", "composite"], function (tool) {
    var sidebar = null;

    var Sidebar = function(menus, appendTo) {
        var self = this;
        var cb = new CompositeBuilder("ID", "ParentId");
        var root = cb.Build(menus);
        var $container = $(appendTo);

        /**
         * @desc 菜单数据（数组）
         */
        this.menus = menus;

        /**
         * @desc 菜单数据（通过组合模式构建的Component对象）
         */
        this.tree = root;

        /**
         * @desc 获取指定菜单的jquery对象
         * @param {string} id 菜单id
         * @returns {object} 菜单的jquery对象
         */
        this.GetById = function(id) {
            return $($container.find("li[data-id=" + id + "]")[0]);
        }

        /**
         * @desc 获取当前页面对应的菜单id
         * @returns {string} 菜单id
         */
        this.CurrentMenuId = function() {
            return $($container.find("li a[data-rpath='" + location.pathname + "']")[0]).parent("li").data("id");
        };

        /**
         * @desc 清空容器中的菜单内容
         * @returns {void}
         */
        this.Clear = function() {
            $container.children().remove();
            return self;
        }

        /**
         * @desc 将菜单加载到容器中（加载前会先清空容器内容）
         * @returns {void}
         */
        this.Load = function() {
            self.Clear();
            root.ForEach(new Visitor(function(node) {
                var $li = $("<li></li>");
                var $content = $("<a></a>");

                $li.attr("data-id", node.data.ID);
                $content.attr("href", node.data.Url);

                var rPath = node.data.Url.match(/(^[^\?]+)\?/g); //相对路径，用于选中当前页菜单
                rPath = rPath != null ? rPath[0].substr(0, rPath[0].length - 1) : node.data.Url; //去掉?号
                $content.attr("data-rpath", rPath);

                $content.append($("<i></i>").addClass(node.data.Icon))
                    .append($("<span></span>").addClass("menu-text").text(" " + node.data.Name + " "));

                $li.append($content);
                if (node.level == 1) {
                    //顶级菜单
                    $container.append($li);
                } else {
                    //子菜单
                    var $parent = self.GetById(node.data.ParentId);
                    if ($parent.length > 0) {
                        var $a = $($parent.children("a")[0]);
                        $a.attr("href", "#").addClass("dropdown-toggle");

                        //防止重复添加arrow
                        if ($a.find("b.arrow.icon-angle-down").length == 0) {
                            $a.append($("<b class='arrow icon-angle-down'></b>"));
                        }

                        var $subMenu = $parent.children("ul.submenu");
                        if ($subMenu.length <= 0) {
                            $subMenu = $("<ul class='submenu'></ul>");
                            $parent.append($subMenu);
                        }

                        $subMenu.append($li);
                    }
                }
            }, true));
            return self;
        };

        /**
         * @desc 展开指定id的菜单
         * @param {string} id 菜单id
         * @param {bool} isActivate 是否要将菜单标识为active
         * @returns {void}
         */
        this.Open = function(id, isActivate) {
            root.ForEach(new Visitor(function(node) {
                if (node.data.ID == id) {
                    var $now = self.GetById(node.data.ID);
                    if (isActivate) {
                        $now.addClass("active"); //选中当前菜单
                    }

                    var activeParent = function(cnode) {
                        //递归展开
                        if (cnode.pnode.level > 0) {
                            var $p = self.GetById(cnode.pnode.data.ID);
                            var $menu = $p.children("ul");
                            if (isActivate) {
                                $p.addClass("active");
                            }
                            $p.addClass("open");
                            $menu.show();
                            activeParent(cnode.pnode);
                        }
                    }

                    activeParent(node);
                }
            }, true));

            return self;
        };

        /**
         * @desc 折叠所有菜单
         * @param {bool} isActive 是否要折叠active的菜单
         * @returns {void}
         */
        this.CollapseAll = function(isActive) {
            if (isActive) {
                $container.find("li").removeClass("active open");
                $container.find(".submenu").hide();
            } else {
                var $topMenu = $container.children("li").not(".active").removeClass("open");
                $topMenu.find("li").removeClass("open");
                $topMenu.find(".submenu").hide();
            }
        };

        /**
         * @desc 定位到指定菜单，并加以提示
         * @param {string} id 菜单id
         * @returns {void}
         */
        this.PointAt = function (id) {
            var $menu = self.GetById(id).find("a");
            var tip_api = tool.tip($menu, {
                gravity: "w",
                content: "<span style='font-size: 17px;'><i class='icon-map-marker'></i>&nbsp;&nbsp;i'm here</span>",
                trigger: "manual",
                opacity: 0.95,
                offset: 5
            });
            tip_api.show();
            tool.shade({
                onclick: function(shade_api) {
                    shade_api.destroy();
                    tip_api.hide();
                }
            });
        };
    }

    return {
        getInstance: function (munus, appendTo) {
            if (sidebar == null)
                sidebar = new Sidebar(munus, appendTo);
            return sidebar;
        },
        newInstance: function (munus, appendTo) {
            sidebar = new Sidebar(munus, appendTo);
            return sidebar;
        },
    }
})
