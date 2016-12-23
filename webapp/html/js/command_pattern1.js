//command
//super class
var Command = function (receiver, args) {
    this.do = function () {
        throw new Error(this.constructor.name + "'s action \"do\" is not implement");
    }

    this.undo = function () {
        throw new Error(this.constructor.name + "'s action \"undo\" is not implement");
    }


}

//sub-class
//adjust color
var AdjustColorCommand = function (receiver, args) {
    Command.apply(this, arguments);
    
    //由于receiver的old state会随着命令的执行而改变，所以必须在命令创建的时候获取
    var oldState = receiver.getColor();
    
    this.do = function () {
        receiver.setColor(args);
        return this;
    }
    this.undo = function () {
        receiver.setColor(oldState);
        return this;
    }
}
//adjust size
var AdjustSizeCommand = function (receiver, args) {
    Command.apply(this, arguments);

    var oldState = receiver.getSize();
    
    this.do = function () {
        receiver.setSize(args);
        return this;
    }
    this.undo = function () {
        receiver.setSize(oldState);
        return this;
    }
}


//receiver
//super class
var Receiver = function (selector) {
    this.getColor = function () {
        throw new Error(this.constructor.name + ".getColor() is not implement");
    }
    this.setColor = function (color) {
        throw new Error(this.constructor.name + ".setColor() is not implement");
    }
    this.getSize = function () {
        throw new Error(this.constructor.name + ".getSize() is not implement");
    }
    this.setSize = function (size) {
        throw new Error(this.constructor.name + ".setSize() is not implement");
    }
}
//sub-class
var DivReceiver = function (selector) {
    Receiver.call(this,selector);
    var self = this;
    var _$target = $(selector);

    this.getColor = function () {
        return _$target.css("background-color");
    }
    this.setColor = function (color) {
        _$target.css("background-color",color);
    }

    this.getSize = function () {
        return {
            width:  parseInt(_$target.css("width")),
            height: parseInt(_$target.css("height"))
        };
    }
    this.setSize = function (size) {
        _$target.animate({
            width: size.width + "px",
            height: size.height + "px",
        });
    }
}
var SpanReceiver = function (selector) {
    Receiver.call(this,selector);
    var self = this;
    var _$target = $(selector);
    this.getColor = function () {
        return _$target.css("color");
    }
    this.setColor = function (color) {
        _$target.css("color",color);
    }

    this.getSize = function () {
        return _$target.css("font-size");
    }
    this.setSize = function (size) {
        _$target.css("font-size", size + "px");
    }
}

//invoker
var Invoker = function () {
    var _history = [];
    var _current = -1;

    this.__defineGetter__("canDo", function () {
        return  Boolean(_history[_current + 1]);
    });
    this.__defineGetter__("canUndo", function () {
        return  Boolean(_current > -1);
    });

    var clearEnd = function (array, endIndex) {
        if(endIndex < 0){
            return array;
        }
        return array.slice(0, endIndex+1);
    }

    var insertHistory = function (command) {
        _history = clearEnd(_history, _current);
        _history.push(command);
        _current++;
    }


    this.addCommand = function (command) {
        insertHistory(command);
    }

    this.execute = function () {
            _history[_current].do();
    }

    this.redo = function () {
        if (this.canDo) {
            _history[_current + 1].do();
            _current++;
        }
    }
    this.undo = function () {
        if (this.canUndo) {
            _history[_current].undo();
            _current--;
        }
    }
}


require(["systools"],function (tool) {
    var $mydiv = $("#mydiv");
    var $myspan = $("#myspan");
    $mydiv.data("receiver", new DivReceiver("#mydiv"));
    $myspan.data("receiver", new SpanReceiver("#myspan"));    
    var $target = $mydiv;
    var myInvoker = new Invoker();

    $(".receiver").on("click", function (e) {
        $target = $(this);
    })

    var $btnDo = $("#btn_do");
    var $btnUndo = $("#btn_undo");

    function SwitchBtnDo() {
        if (!myInvoker.canDo) {
            $btnDo.attr("disabled", "disabled");
        }else{
            $btnDo.removeAttr("disabled");
        }
    }
    function SwitchBtnUndo() {
        if (!myInvoker.canUndo) {
            $btnUndo.attr("disabled", "disabled");
        }else{
            $btnUndo.removeAttr("disabled");
        }
    }
    function SwitchRedoUndoBtn() {
        SwitchBtnDo();
        SwitchBtnUndo();
    }

    function isMatchCommand(cmd) {
        var cmds = $target.data("command").split(" ");
        var isMatch = false;
        $.each(cmds, function (index, item) {
            if(item.trim() === cmd){
                isMatch = true;
            }
        })
        return isMatch;
    }

    $(".btn-color").on("click", function(e){
        if(isMatchCommand("color")){
            myInvoker.addCommand(new AdjustColorCommand($target.data("receiver"), $(this).data("color")));
            myInvoker.execute();
            SwitchRedoUndoBtn();
        }
    })
    $(".btn-size").on("click", function(e){
        if(isMatchCommand("size")){
            var size = $(this).data("size").split("x");
            myInvoker.addCommand(new AdjustSizeCommand($target.data("receiver"),{width: size[0], height: size[1]}));
            myInvoker.execute();
            SwitchRedoUndoBtn();
        }
    })
    $(".btn-font-size").on("click", function(e){
        if(isMatchCommand("font-size")){
            myInvoker.addCommand(new AdjustSizeCommand($target.data("receiver"), $(this).data("font-size")));
            myInvoker.execute();
            SwitchRedoUndoBtn();
        }
    })
    $btnDo.on("click", function (e) {
        myInvoker.redo();
        SwitchRedoUndoBtn();
    })
    $btnUndo.on("click", function (e) {
        myInvoker.undo();
        SwitchRedoUndoBtn();
    })
})
