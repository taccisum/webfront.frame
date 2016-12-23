//command
//super class
var Command = function (args) {
    this.do = function () {
        throw new Error(this.constructor.name + "'s action \"do\" is not implement");
    }

    this.undo = function () {
        throw new Error(this.constructor.name + "'s action \"undo\" is not implement");
    }
}

//sub-class
//adjust color
var AdjustColorCommand = function (args) {
    Command.apply(this, arguments);

    var $target = $(args.target);
    var oldState = $target.css("background-color");
    this.do = function () {
        $target.css("background-color",args.color);
        return this;
    }
    this.undo = function () {
        $target.css("background-color",oldState);
        return this;
    }
}
//adjust size
var AdjustSizeCommand = function (args) {
    Command.apply(this, arguments);
    var $target = $(args.target);
    var oldState ={
        width:$target.css("width"),
        height:$target.css("height"),
    } 
    this.do = function () {
        $target.animate({
            width: args.size.width + "px",
            height: args.size.height + "px",
        });
        return this;
    }
    this.undo = function () {
        $target.animate({
            width: oldState.width,
            height: oldState.height,
        });
        return this;
    }
}

//receiver
var Receiver = function (target) {
    var _selector = target;
    var _history = [];
    var _current = -1;

    this.__defineGetter__("canDo", function () {
        return  Boolean(_history[_current + 1]);
    });
    this.__defineGetter__("canUndo", function () {
        return  Boolean(_current > -1);
    });
    
    
    var clearEnd = function (array, endIndex) {
        if(endIndex<0){
            return [];
        }
        return array.slice(0, endIndex+1);
    }
    
    var insertHistory = function (command) {
        _history = clearEnd(_history, _current);
        _history.push(command);
        _current++;
        
    }


    this.adjustColor = function (color) {
        insertHistory(new AdjustColorCommand({target:_selector,color: color}).do());
    }

    this.adjustSize = function (width, height) {
        insertHistory(new AdjustSizeCommand({target: _selector, size: {width: width, height: height}}).do());
    }
    
    this.do = function () {
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
    var myCommandReceiver = new Receiver("#mydiv");
    
    var $btnDo = $("#btn_do");
    var $btnUndo = $("#btn_undo");

    function disableBtnDo() {        
        if (!myCommandReceiver.canDo) {
            $btnDo.attr("disabled", "disabled");
        }else{
            $btnDo.removeAttr("disabled");
        }
    }
    function disableBtnUndo() {        
        if (!myCommandReceiver.canUndo) {
            $btnUndo.attr("disabled", "disabled");
        }else{
            $btnUndo.removeAttr("disabled");
        }
    }

    $(".btn-color").on("click", function(e){
        myCommandReceiver.adjustColor($(this).data("color"));
        disableBtnDo();
        disableBtnUndo();
    })
    $(".btn-size").on("click", function(e){
        var size = $(this).data("size").split("x");
        myCommandReceiver.adjustSize(size[0], size[1]);
        disableBtnDo();
        disableBtnUndo();
    })
    $btnDo.on("click", function (e) {
        myCommandReceiver.do();
        disableBtnDo();
        disableBtnUndo();
    })
    $btnUndo.on("click", function (e) {
        myCommandReceiver.undo();
        disableBtnDo();
        disableBtnUndo();
    })
})
