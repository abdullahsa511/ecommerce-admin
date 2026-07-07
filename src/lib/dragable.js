var hasTouch = 'ontouchstart' in window;

/**
 * Detect CSS pointer-events property
 * events are normally disabled on the dragging element to avoid conflicts
 * https://github.com/ausi/Feature-detection-technique-for-pointer-events/blob/master/modernizr-pointerevents.js
 */
var hasPointerEvents = (function() {
    var el = document.createElement('div'),
        docEl = document.documentElement;
    if(!('pointerEvents' in el.style)) {
        return false;
    }
    el.style.pointerEvents = 'auto';
    el.style.pointerEvents = 'x';
    docEl.appendChild(el);
    var supports = window.getComputedStyle && window.getComputedStyle(el, '').pointerEvents === 'auto';
    docEl.removeChild(el);
    return !!supports;
})();

var eStart = hasTouch ? 'touchstart' : 'mousedown',
    eMove = hasTouch ? 'touchmove' : 'mousemove',
    eEnd = hasTouch ? 'touchend' : 'mouseup',
    eCancel = hasTouch ? 'touchcancel' : 'mouseup';

var options = {
    contentCallback: function(item) {return item.content || '' ? item.content : item.id;},
    listNodeName: 'ol',
    itemNodeName: 'li',
    handleNodeName: 'div',
    contentNodeName: 'span',
    rootClass: 'dd',
    listClass: 'dd-list',
    itemClass: 'dd-item',
    dragClass: 'dd-dragel',
    handleClass: 'dd-handle',
    contentClass: 'dd-content',
    collapsedClass: 'dd-collapsed',
    placeClass: 'dd-placeholder',
    noDragClass: 'dd-nodrag',
    noChildrenClass: 'dd-nochildren',
    emptyClass: 'dd-empty',
    expandBtnHTML: '<button class="dd-expand" data-action="expand" type="button">Expand</button>',
    collapseBtnHTML: '<button class="dd-collapse" data-action="collapse" type="button">Collapse</button>',
    group: 0,
    maxDepth: 5,
    threshold: 20,
    fixedDepth: false, //fixed item's depth
    fixed: false,
    includeContent: false,
    callback: function(l, e, p) {},
    onDragStart: function(l, e, p) {},
    listRenderer: function(children, options) {
        var html = '<' + options.listNodeName + ' class="' + options.listClass + '">';
        html += children;
        html += '</' + options.listNodeName + '>';

        return html;
    },
    itemRenderer: function(item_attrs, content, children, options, item) {
        var item_attrs_string = $.map(item_attrs, function(value, key) {
            return ' ' + key + '="' + value + '"';
        }).join(' ');

        var html = '<' + options.itemNodeName + item_attrs_string + '>';
        html += '<' + options.handleNodeName + ' class="' + options.handleClass + '">';
        html += '<' + options.contentNodeName + ' class="' + options.contentClass + '">';
        html += content;
        html += '</' + options.contentNodeName + '>';
        html += '</' + options.handleNodeName + '>';
        html += children;
        html += '</' + options.itemNodeName + '>';

        return html;
    }
};
const dragStart = function(e) {
    var mouse = this.mouse,
        target = $(e.target),
        dragItem = target.closest(options.itemNodeName);

    var position = {};
    position.top = e.pageY;
    position.left = e.pageX;

    options.onDragStart.call(this, this.el, dragItem, position);

    this.placeEl.css('height', dragItem.height());

    mouse.offsetX = e.pageX - dragItem.offset().left;
    mouse.offsetY = e.pageY - dragItem.offset().top;
    mouse.startX = mouse.lastX = e.pageX;
    mouse.startY = mouse.lastY = e.pageY;

    this.dragRootEl = this.el;
    this.dragEl = $(document.createElement(options.listNodeName)).addClass(options.listClass + ' ' + options.dragClass);
    this.dragEl.css('width', dragItem.outerWidth());

    this.setIndexOfItem(dragItem);

    // fix for zepto.js
    // dragItem.after(this.placeEl).detach().appendTo(this.dragEl);
    dragItem.after(this.placeEl);
    dragItem[0].parentNode.removeChild(dragItem[0]);
    dragItem.appendTo(this.dragEl);

    $(document.body).append(this.dragEl);
    this.dragEl.css({
        'left': e.pageX - mouse.offsetX,
        'top': e.pageY - mouse.offsetY
    });
    // total depth of dragging item
    var i, depth,
        items = this.dragEl.find(options.itemNodeName);
    for(i = 0; i < items.length; i++) {
        depth = $(items[i]).parents(options.listNodeName).length;
        if(depth > this.dragDepth) {
            this.dragDepth = depth;
        }
    }
};

const setIndexOfItem = function(item, index) {
    if((typeof index) === 'undefined') {
        index = [];
    }

    index.unshift(item.index());

    if($(item[0].parentNode)[0] !== this.dragRootEl[0]) {
        this.setIndexOfItem($(item[0].parentNode), index);
    }
    else {
        this.dragEl.data('indexOfItem', index);
    }
};

const restoreItemAtIndex = function(dragElement) {
    var indexArray = this.dragEl.data('indexOfItem'),
        currentEl = this.el;

    for(i = 0; i < indexArray.length; i++) {
        if((indexArray.length - 1) === parseInt(i)) {
            placeElement(currentEl, dragElement);
            return
        }
        currentEl = currentEl[0].children[indexArray[i]];
    }

    function placeElement(currentEl, dragElement) {
        if(indexArray[indexArray.length - 1] === 0) {
            $(currentEl).prepend(dragElement.clone());
        }
        else {
            $(currentEl.children[indexArray[indexArray.length - 1] - 1]).after(dragElement.clone());
        }
    }
};

const dragStop = function(e) {
    // fix for zepto.js
    //this.placeEl.replaceWith(this.dragEl.children(options.itemNodeName + ':first').detach());
    var el = this.dragEl.children(options.itemNodeName).first();
    el[0].parentNode.removeChild(el[0]);
    this.placeEl.replaceWith(el);

    var position = {};
    position.top = e.pageY;
    position.left = e.pageX;

    if(this.hasNewRoot) {
        if(options.fixed === true) {
            this.restoreItemAtIndex(el);
        }
        else {
            this.el.trigger('lostItem');
        }
        this.dragRootEl.trigger('gainedItem');
    }
    else {
        this.dragRootEl.trigger('change');
    }

    this.dragEl.remove();
    options.callback.call(this, this.dragRootEl, el, position);

    this.reset();
};

const dragMove = function(e) {
    var list, parent, prev, next, depth,
        opt = options,
        mouse = this.mouse;

    this.dragEl.css({
        'left': e.pageX - mouse.offsetX,
        'top': e.pageY - mouse.offsetY
    });

    // mouse position last events
    mouse.lastX = mouse.nowX;
    mouse.lastY = mouse.nowY;
    // mouse position this events
    mouse.nowX = e.pageX;
    mouse.nowY = e.pageY;
    // distance mouse moved between events
    mouse.distX = mouse.nowX - mouse.lastX;
    mouse.distY = mouse.nowY - mouse.lastY;
    // direction mouse was moving
    mouse.lastDirX = mouse.dirX;
    mouse.lastDirY = mouse.dirY;
    // direction mouse is now moving (on both axis)
    mouse.dirX = mouse.distX === 0 ? 0 : mouse.distX > 0 ? 1 : -1;
    mouse.dirY = mouse.distY === 0 ? 0 : mouse.distY > 0 ? 1 : -1;
    // axis mouse is now moving on
    var newAx = Math.abs(mouse.distX) > Math.abs(mouse.distY) ? 1 : 0;

    // do nothing on first move
    if(!mouse.moving) {
        mouse.dirAx = newAx;
        mouse.moving = true;
        return;
    }

    // calc distance moved on this axis (and direction)
    if(mouse.dirAx !== newAx) {
        mouse.distAxX = 0;
        mouse.distAxY = 0;
    }
    else {
        mouse.distAxX += Math.abs(mouse.distX);
        if(mouse.dirX !== 0 && mouse.dirX !== mouse.lastDirX) {
            mouse.distAxX = 0;
        }
        mouse.distAxY += Math.abs(mouse.distY);
        if(mouse.dirY !== 0 && mouse.dirY !== mouse.lastDirY) {
            mouse.distAxY = 0;
        }
    }
    mouse.dirAx = newAx;

    /**
     * move horizontal
     */
    if(mouse.dirAx && mouse.distAxX >= opt.threshold) {
        // reset move distance on x-axis for new phase
        mouse.distAxX = 0;
        prev = this.placeEl.prev(opt.itemNodeName);
        // increase horizontal level if previous sibling exists, is not collapsed, and can have children
        if(mouse.distX > 0 && prev.length && !prev.hasClass(opt.collapsedClass) && !prev.hasClass(opt.noChildrenClass)) {
            // cannot increase level when item above is collapsed
            list = prev.find(opt.listNodeName).last();
            // check if depth limit has reached
            depth = this.placeEl.parents(opt.listNodeName).length;
            if(depth + this.dragDepth <= opt.maxDepth) {
                // create new sub-level if one doesn't exist
                if(!list.length) {
                    list = $('<' + opt.listNodeName + '/>').addClass(opt.listClass);
                    list.append(this.placeEl);
                    prev.append(list);
                    this.setParent(prev);
                }
                else {
                    // else append to next level up
                    list = prev.children(opt.listNodeName).last();
                    list.append(this.placeEl);
                }
            }
        }
        // decrease horizontal level
        if(mouse.distX < 0) {
            // we can't decrease a level if an item preceeds the current one
            next = this.placeEl.next(opt.itemNodeName);
            if(!next.length) {
                parent = this.placeEl.parent();
                this.placeEl.closest(opt.itemNodeName).after(this.placeEl);
                if(!parent.children().length) {
                    this.unsetParent(parent.parent());
                }
            }
        }
    }

    var isEmpty = false;

    // find list item under cursor
    if(!hasPointerEvents) {
        this.dragEl[0].style.visibility = 'hidden';
    }
    this.pointEl = $(document.elementFromPoint(e.pageX - document.body.scrollLeft, e.pageY - (window.pageYOffset || document.documentElement.scrollTop)));
    if(!hasPointerEvents) {
        this.dragEl[0].style.visibility = 'visible';
    }
    if(this.pointEl.hasClass(opt.handleClass)) {
        this.pointEl = this.pointEl.closest(opt.itemNodeName);
    }
    if(this.pointEl.hasClass(opt.emptyClass)) {
        isEmpty = true;
    }
    else if(!this.pointEl.length || !this.pointEl.hasClass(opt.itemClass)) {
        return;
    }

    // find parent list of item under cursor
    var pointElRoot = this.pointEl.closest('.' + opt.rootClass),
        isNewRoot = this.dragRootEl.data('nestable-id') !== pointElRoot.data('nestable-id');

    /**
     * move vertical
     */
    if(!mouse.dirAx || isNewRoot || isEmpty) {
        // check if groups match if dragging over new root
        if(isNewRoot && opt.group !== pointElRoot.data('nestable-group')) {
            return;
        }

        // fixed item's depth, use for some list has specific type, eg:'Volume, Section, Chapter ...'
        if(options.fixedDepth && this.dragDepth + 1 !== this.pointEl.parents(opt.listNodeName).length) {
            return;
        }

        // check depth limit
        depth = this.dragDepth - 1 + this.pointEl.parents(opt.listNodeName).length;
        if(depth > opt.maxDepth) {
            return;
        }
        var before = e.pageY < (this.pointEl.offset().top + this.pointEl.height() / 2);
        parent = this.placeEl.parent();
        // if empty create new list to replace empty placeholder
        if(isEmpty) {
            list = $(document.createElement(opt.listNodeName)).addClass(opt.listClass);
            list.append(this.placeEl);
            this.pointEl.replaceWith(list);
        }
        else if(before) {
            this.pointEl.before(this.placeEl);
        }
        else {
            this.pointEl.after(this.placeEl);
        }
        if(!parent.children().length) {
            this.unsetParent(parent.parent());
        }
        if(!this.dragRootEl.find(opt.itemNodeName).length) {
            this.dragRootEl.append('<div class="' + opt.emptyClass + '"/>');
        }
        // parent root list has changed
        this.dragRootEl = pointElRoot;
        if(isNewRoot) {
            this.hasNewRoot = this.el[0] !== this.dragRootEl[0];
        }
    }
}