(function ($) {
    if ($.fn.roll) {
        return;
    }
    var setMethods = {
        refresh: refresh
    };
    var getMethods = {
        pause: pause,
        run: run
    };
    $.fn.roll = function () {
        var args = arguments, params, method;
        if (!args.length || typeof args[0] == 'object') {
            return this.each(function (idx) {
                var $self = $(this);
                $self.data('roll', $.extend(true, {}, $.fn.roll.default, args[0]));
                params = $self.data('roll');
                _init.call($self, params);
                _render.call($self);
            });
        } else {
            if (!$(this).data('roll')) {
                throw new Error('You has not init roll!');
            }
            params = Array.prototype.slice.call(args, 1);
            if (setMethods.hasOwnProperty(args[0])) {
                method = setMethods[args[0]];
                return this.each(function (idx) {
                    var $self = $(this);
                    method.apply($self, params);
                    _render.call($self);
                });
            } else if (getMethods.hasOwnProperty(args[0])) {
                method = getMethods[args[0]];
                return method.apply(this, params);
            } else {
                throw new Error('There is no such method');
            }
        }
    }
    $.fn.roll.default = {
        speed: 50
    }
    function _init(params) {
        return this;
    }
    function _render() {
        var $self = this,
            params = $self.data("roll"),
            speed = params.speed;
        var container = $self.get(0),
            rollItem = container.querySelector(".roll-item");
        if (!rollItem) {
            content = container.firstElementChild;
        } else {
            content = rollItem.firstElementChild;
        }
        var containerHeight = container.clientHeight,
            containerWidth = container.clientWidth,
            contentHeight = content.offsetHeight;

        var newRollItem = $("<div/>", {
            "class": "roll-item"
        })
            .css({
                "width": containerWidth,
                "animationDuration": function () {
                    return contentHeight / speed + "s";
                }
            })
            .append(content);
        //当容器小于要滚动的元素的时候才滚动否则不滚动
        $(container)
            .toggleClass("roll-pause", containerHeight > contentHeight)
            .addClass("roll-container")
            .prop("will-change", true)
            .html(
                $("<div/>", {
                    "class": "roll-inner"
                }).css({
                    "width": contentHeight,
                    "height": contentHeight
                })
                    .append(
                        newRollItem,
                        function () {
                            if (containerHeight < contentHeight) {
                                return $(newRollItem).clone(true, true);
                            }
                        }()
                    )
            )
        if (!("onanimationend" in window)&&containerHeight < contentHeight) {
            
            doMove.call($self);
            var inner = $self.find(".roll-inner").get(0);
            inner.addEventListener("mouseenter", function () {
                params.pause = true;
            });
            inner.addEventListener("mouseleave", function () {
                params.pause = false;
                doMove.call($self);
            });
        }
    }
    function doMove() {
        var $self = this,
        params = $self.data("roll");
        var inner = $self.find(".roll-inner").get(0);
        var dom = inner.firstElementChild,
            preTime = 17;
            clearTimeout(params._t);
        IEMove();
        function IEMove() {
            [].forEach.call(inner.children, function (element) {
                $(element).css({
                    top: function (idx,val) {
                        if(val==="auto"){
                            val=0;
                        }
                        return parseFloat(val) - params.speed / (1000 / 17);
                    }
                });
            });
            if (!params.pause) {
                if (parseFloat($(dom).css("top")) + dom.clientHeight > 0) {
                    params._t = setTimeout(function () {
                        IEMove();
                    }, preTime);
                } else {
                    [].forEach.call(inner.children, function (element) {
                        $(element).css({ top: 0 });
                    });
                    doMove.call($self);
                }
            }
        }
    }
    function pause() {
        var $self = this,
            params = $self.data("roll");
        params.pause = true;
        $self.addClass("roll-pause");
    }
    function run() {
        var $self = this,
            params = $self.data("roll");
        params.pause = false;
        var container = $self.get(0),
            rollItem = container.querySelector(".roll-item");
        if (!rollItem) {
            content = container.firstElementChild;
        } else {
            content = rollItem.firstElementChild;
        }
        var containerHeight = container.clientHeight,
            contentHeight = content.offsetHeight;
        if (containerHeight < contentHeight) {
            $self.removeClass("roll-pause");
            if (!("onanimationend" in window)) {
                doMove.call($self);
            }
        }
    }
    function refresh() {

    }
})(jQuery);