/**
 * @author tac
 * @see jquery.js
 * @desc 简单的集合操作类
 */


var List = function (array) { };

define(function() {
    List = function(array) {

        if (!(this instanceof List)) {
            return new List(array);
        }

        var _data;

        //private
        function isNull(str) {
            if (typeof (str) == "undefined" || str == null) {
                return true;
            }
            return false;
        };


        this.set = function(data) {
            if (data instanceof Array) {
                _data = data.slice();
            } else if (typeof array == "undefined" || array == null) {
                _data = new Array();
            } else {
                throw Error("set(): new data is not an Array");
            }
        };

        this.getArray = function() {
            return _data.slice();
        }; //返回一个数组的副本

        this.add = function(item) {
            _data.push(item);
        };

        this.getBy = function(key, val) {
            if (_data.length == 0 || typeof _data[0][key] == "undefined") {
                return null;
            }
            for (var index in _data) {
                if (_data.hasOwnProperty(index)) {
                    if (_data[index][key] == val) {
                        return _data[index];
                    }
                }
            }

            return null;
        }; //获取属性为key值为val的第一项

        this.removeBy = function(key, val) {
            _data.splice(_data.indexOf(this.getBy(key, val)), 1);
        }; //移除属性为key值为val的第一项

        this.exist = function(key, val) {
            return this.getBy(key, val) != null;
        }; //判断是否存在属性为key值为val的项

        this.length = function() {
            return _data.length;
        }; //获取长度

        this.divide = function(keys, newKeys) {
            if (isNull(keys)) {
                throw Error("divide(keys, newKeys): required param keys");
            }
            var isKeep = isNull(newKeys);
            if (!isKeep && keys.length != newKeys.length) {
                throw Error("divide(keys, newKeys): old keys' length is not equals new keys' length");
            }

            var resultArray = new Array;

            if (isKeep) {
                $.each(_data, function(index, item) {
                    var obj = new Object();
                    $.each(keys, function(i, key) {
                        obj[key] = item[key];
                    });
                    resultArray.push(obj);
                });
            } else {
                $.each(_data, function(index, item) {
                    var obj = new Object();
                    $.each(keys, function(i, key) {
                        obj[newKeys[i]] = item[key];
                    });
                    resultArray.push(obj);
                });
            }

            return new List(resultArray);
        }; //通过指定keys将List分割, newKeys为空则默认使用keys作为属性名

        this.clone = function() {
            return new List(_data.slice());
        }; //克隆一个List自身

        //执行构造函数
        (function(self) {
            self.set(array);
        })(this);

    }
});

