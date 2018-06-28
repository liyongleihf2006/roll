/**
 * 一个简单的上下滚动展示插件
 * @author liyongleihf2006
 * @param {Element} container 将要变为滚动展示容器的元素
 * @param {Number}   duetime 当ie浏览器的时候,动画的周期时长
 * (当使用现代浏览器时,设置duetime不起作用,动画周期请在roll.css中大约9行设置) 
 */
function roll(container, duetime) {
    var content = container.firstElementChild;
    var containerHeight = container.clientHeight,
        contentHeight = content.offsetHeight;
    //当容器小于要滚动的元素的时候才滚动否则不滚动
    if (containerHeight < contentHeight) {
        container.setAttribute("class", (container.getAttribute("class") || "") + " roll-container");
        container.setAttribute("will-change", true);
        var inner = document.createElement("div");
        inner.setAttribute("class", "roll-inner");
        container.appendChild(inner);
        var item = document.createElement("div");
        item.setAttribute("class", "roll-item");
        item.appendChild(content);
        inner.appendChild(item);
        inner.style.width = contentHeight + "px";
        if(window.jQuery){
            var mirror = $(item).clone(true,true);
            $(inner).append(mirror);
            mirror = mirror.get(0);
        }else{
            var mirror = item.cloneNode(true);
            inner.appendChild(mirror);
        }
        if ("onanimationend" in window) {
            animationend(item);
            animationend(mirror);
        } else {
            var i = 0,
                pause = false;
            doMove();
            function doMove() {
                var dom = inner.firstElementChild,
                    countTotal = 100,
                    speed = contentHeight / countTotal,
                    preTime = duetime / countTotal;
                IEMove();
                function IEMove() {
                    dom.style.marginTop = -speed * (i + 1) + "px";
                    if (!pause) {
                        if (i < countTotal) {
                            setTimeout(function () {
                                i++;
                                IEMove();
                            }, preTime);
                        } else {
                            i = 0;
                            dom.style.marginTop = 0;
                            inner.appendChild(dom);
                            doMove();
                        }
                    }
                }
            }
            inner.addEventListener("mouseenter", function () {
                pause = true;
            });
            inner.addEventListener("mouseleave", function () {
                pause = false;
                doMove();
            });
        }
    }
    function animationend(dom) {
        dom.addEventListener("animationend", function () {
            inner.appendChild(inner.firstElementChild);
        });
    }
}