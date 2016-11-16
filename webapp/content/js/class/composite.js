/**
 * @file Composite.js
 * @see jquery
 * @author tac
 * @desc 实现通用的Composite Pattern类
 * @version 1.0.0
 */


/**
 * @class Component
 * @author tac
 * @desc Composite模式组件类
 */
var Component = function(data, level, pnode) {};
/**
 * @class Visitor
 * @author tac
 * @desc 用于Composite模式中ForEach方法的访问者
 * @param
 * _execute: 要执行的回调函数 function
 * _applyComposite: 是否将回调函数应用于分支节点 boolean
 * _applyRoot: 是否将回调函数作用于根节点 boolean
 */
var Visitor = function(_execute, _applyComposite, _applyRoot) {};
/**
 * @class CompositeBuilder
 * @author tac
 * @desc 用于将目标数组转换成组合模式对象
 * @param
 * idAlias: 将数组对象转换为组合时所使用的id property别名，默认为"id"
 * pidAlias: 将数组对象转换为组合时所使用的父id property别名，默认为"pid"
 */
var CompositeBuilder = function(idAlias, pidAlias) {};

define(function() {
    //Component
    Component = function (data, level, pnode) {
        this.data = data;
        this.level = level;
        this.nodes = new Array();
        this.pnode = pnode;

        var self = this;

        this.Add = function (node) {
            if (node instanceof Component) {
                self.nodes.push(node);
                return self;
            } else {
                throw Error("Component.Add(): arg is not a Component");
            }
        };

        this.Remove = function (node) {
            self.nodes.splice(self.nodes.indexOf(node), 1);
            return self;
        };

        this.hasChild = function () {
            return self.nodes.length > 0;
        }

        this.ForEach = function (visitor) {
            if (self.hasChild()) {
                //分支节点的处理方式
                if (visitor.applyComposite) {
                    if (self.pnode == null) {
                        if (visitor.applyRoot) {
                            visitor.execute(self);
                        }
                    } else {
                        visitor.execute(self);
                    }
                }
                $.each(self.nodes, function (index, item) {
                    item.ForEach(visitor);
                });
            } else {
                //叶节点的处理方式
                visitor.execute(self);
            }
            return self;
        };
    };

    //Visitor
    Visitor = function (_execute, _applyComposite, _applyRoot) {
        if (typeof _applyRoot == "boolean") {
            this.applyRoot = _applyRoot;
        } else {
            this.applyRoot = false;
        }

        if (typeof _applyComposite == "boolean") {
            this.applyComposite = _applyComposite;
        } else {
            this.applyComposite = false;
        }

        if (typeof _execute == "function") {
            this.execute = _execute;
        } else {
            this.execute = function () { };
        }
    }

    //Builder
    CompositeBuilder = function (idAlias, pidAlias) {
        var self = this;
        idAlias = idAlias || "id";
        pidAlias = pidAlias || "pid";

        var tree = function (pid, pnode, list, plevel) {
            $.each(list, function (index, item) {

                if (item[pidAlias] == pid) {
                    var cnode = new Component(item, plevel + 1, pnode);
                    pnode.Add(cnode);
                    tree(item[idAlias], cnode, list, plevel + 1, pnode);
                }
            });
        }

        this.Build = function (array) {
            var rootlevel = 0;
            var root = new Component(null, rootlevel, null);
            tree(null, root, array, rootlevel);
            return root;
        };      //return a class MenuFolder
    };
})