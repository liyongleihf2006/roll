/**
 * 一个简单的上下滚动展示插件
 * @author liyongleihf2006
 * @param {Element} container 将要变为滚动展示容器的元素
 * @param {Number}   duetime 当ie9及以下浏览器的时候,因为不支持动画结束事件监听,所以需要将css3动画的持续事件手动传入
 * (当使用ie10+以及现代浏览器时,设置duetime不起作用,当ie9时,duetime的值请必须等同于css3的动画持续时间) 
 */
function roll(container, duetime) {
    var content = container.firstElementChild;
    var containerHeight = container.clientHeight,
        contentHeight = content.offsetHeight;
    //当容器小于要滚动的元素的时候才滚动否则不滚动
    if (containerHeight < contentHeight) {
        container.setAttribute("class", container.getAttribute("class") + " roll-container");
        container.setAttribute("will-change", true);
        var inner = document.createElement("div");
        inner.setAttribute("class", "roll-inner");
        container.appendChild(inner);
        var item = document.createElement("div");
        item.setAttribute("class", "roll-item");
        item.appendChild(content);
        inner.appendChild(item);
        inner.style.width = contentHeight + "px";
        var mirror = item.cloneNode(true);
        inner.appendChild(mirror);
        if ("onanimationend" in window) {
            animationend(item);
            animationend(mirror);
        } else {
            setInterval(function () {
                inner.appendChild(inner.firstElementChild);
            }, duetime);
        }
    }
    function animationend(dom) {
        dom.addEventListener("animationend", function () {
            inner.appendChild(inner.firstElementChild);
        })
    }
}