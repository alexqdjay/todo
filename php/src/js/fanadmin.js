var Fan = Fan || {};
Fan.panel = {};
/**
 *
 * Collapse 2013/03/17
 *
 * @constructor
 */
Fan.Collapse = function() {
    var _this = this;
    $('.accordion-item').bind('click',function(){
        _this.select($(this));

        $(_this).trigger('change',this);
    });

    function _constructor() {
//        $('.accordion-item').each(function(){
//
//        });
    }

    _constructor();

    /**
     *
     * @param tar id:string/jquery
     */
    this.select = function(tar) {
        var ob = null;
        if((typeof tar) == 'string') {
            ob = $('#'+tar);
        }
        else {
            ob = tar;
        }

        var parent = ob.parent();
        if(!parent.hasClass('accordion-inner')) {
            parent = parent.parent();
        }

        if(parent.hasClass('active')) {
            return;
        }

        $('.accordion-item').each(function(i){
            var parent = $(this).parent();
            if(!parent.hasClass('accordion-inner')) {
                parent = parent.parent();
            }
            parent.removeClass('active');
        });
        parent.toggleClass('active');
    }
}

/**
 *
 * Breadcrub
 *
 * @param jdom
 * @constructor
 */
Fan.Breadcrumb = function(jdom) {
    var _this = this;
    var renderObj = null;
    var items = [];
    function _constructor() {
        renderObj = jdom;
    }

    this.creatItems = function(c) {
        renderObj.empty();
        items = [];
        var defaultC  = {
            divider:'/',
            items:[]
        };
        $.extend(defaultC,c);
        $.each(defaultC.items,function(i,item){
            if(i == 0) {
                item.divider = null;
            }
            else {
                item.divider = defaultC.divider;
            }
            if(i == (defaultC.items.length-1)) {
                item.active = true;
            }
            _this.pushItem(item);
        });
    }

    this.pushItem = function(item) {
        if(item == null)return;

        var text = item.text;
        var href = item.href;
        var handler = item.handler;
        var divider = item.divider;

        var html;
        var jdom;
        if(item.active) {
            html = '<li>'+text+'</li>';
            jdom = $(html);
            if(item.active) {
                jdom.addClass('active');
            }
            if(item.icon) {
                jdom.prepend('<i class="'+item.icon+'"></i>');
            }
        }
        else {
            html = '<li><a>'+text+'</a></li>';
            jdom = $(html);
            var child = jdom.children();
            jdom.text = text;
            if(handler) {
                child.click(function(){
                    handler.call(jdom,item);
                });
            }
            if(href && href.trim() != "") {
                child.attr('href',href);
            }
            if(item.icon) {
                jdom.children('a').prepend('<i class="'+item.icon+'"></i>');
            }
        }
        if(divider) {
            jdom.prepend('<span class="divider">'+ divider+'</span>');
        }
        items.push(jdom);
        renderObj.append(jdom);
    }

    this.shitItem = function() {
        items.shift().remove();
    }

    _constructor();
}

Fan.table = {};

/**
 *@author alex
 *
 * Table
 *
 * @param c
 * @constructor
 */
Fan.table.Table = function(c) {
    var _this = this;
    var renderTo = null;
    var tbody = null;
    var columns = [];
    var defaultConfig = {
        id:'fanTbale',
        columns:[]
    };

    function _constructor() {
        $.extend(defaultConfig,c);
        columns = defaultConfig.columns;

        renderTo = $('#'+defaultConfig.id);

        tbody = renderTo.children('tbody');
        if(tbody.size() == 0) {
            tbody = $('<tbody></tbody>');
            renderTo.append(tbody);
        }

        if(defaultConfig.url != null) {
            _this.url = defaultConfig.url;
            _this.store = new Fan.table.Store({
                url:_this.url
            });

            $(_this.store).bind('load',function(e,obj){
                afterLoad(obj);
            });
        }
    }

    function afterLoad(arr) {
        if(arr == null) return;
        tbody.empty();
        $.each(arr,function(i,item){
            var tr = $('<tr></tr>');
            tbody.append(tr);
            $.each(columns,function(j,c){
                var value = item[c.dataIndex];
                var text = '';
                var td;
                if(c.render) {
                    text = c.render.call(this,value,item);
                }
                else {
                    text = value;
                }
                if(c.width) {
                    td  = $('<td style="width:'+ c.width+';">'+text+'</td>');
                }
                else {
                    td  = $('<td>'+text+'</td>');
                }

                tr.append(td);
            });
        });

        $(_this).trigger("afterrender");
    }

    _constructor();
}

/**
 *
 * Store
 *
 * @param c
 * @constructor
 */
Fan.table.Store = function(c) {
    var _this = this;
    var url = c.url;
    this.baseParams = {};
    _this.url = url;

    this.load = function(option) {
        var op = option || {};
        $.extend(_this.baseParams,op.params);
        $.ajax({
            url:_this.url,
            data:_this.baseParams,
            success:function(obj) {
                try {
                    if(op.callBack) {
                        _this.record = obj;
                        op.callBack.call(_this,obj);
                    }
                }
                catch(e){alert(e)}
               $(_this).triggerHandler('load',[obj]);
            }
        });
    }
}

/**
 *
 * PageTool
 *
 * @param option
 * @constructor
 */
Fan.table.PageTool = function(option) {
    var _this = this;
    option = option || {};
    var store;
    var renderTo;
    _this.url;
    var limit = 10;
    this.total = 0;
    this.page = 1;
    this.totalPage=0;
    this.sibling = null;
    var autoLoad = option.autoLoad==null?true:option.autoLoad;
    var nextBtn,preBtn,pageNum;
    function _constructor() {
        store = option.store;
        renderTo = $('#'+option.id);
        _this.url = option.url;
        limit = option.limit;

        nextBtn = renderTo.find('ul .pagination-next');
        preBtn = renderTo.find('ul .pagination-pre');
        pageNum = renderTo.find('.pagination-currentNum');
        nextBtn.click(function(){
            _this.nextPage();
        });

        preBtn.click(function(){
            _this.prePage();
        });

        if(autoLoad) {
            _this.reload();
        }
    }

    this.setSibling = function(s) {
        _this.sibling = s;

        s.sibling = _this;
    }

    this.reload = function(params){
        _this.page = 1;
        $.ajax({
            url:_this.url,
            data:params,
            success:function(obj){
                _this.total = obj.total;
                _this.totalPage = Math.ceil(_this.total/limit);
                refreshPageNum();
            }
        });
    }

    function refreshPageNum() {
        pageNum .text(_this.page+'/'+_this.totalPage);
        if(_this.page == 1) {
            preBtn.addClass('disabled');
        }
        else {
            preBtn.removeClass('disabled');
        }
        if(_this.page == _this.totalPage) {
            nextBtn.addClass('disabled');
        }
        else {
            nextBtn.removeClass('disabled');
        }
    }

    this.changePage = function(p) {
        _this.page = p;
        refreshPageNum();
    }

    this.nextPage = function() {
        if(_this.page+1>_this.totalPage)return;
        _this.page += 1;
        if(_this.sibling){
            _this.sibling.changePage(_this.page);
        }
        refreshPageNum();
        store.load({
            params:{
                start:_this.page-1,
                limit:limit
            }
        });
    }

    this.prePage = function() {
        if(_this.page==1)return;
        _this.page -= 1;
        if(_this.sibling){
            _this.sibling.changePage(_this.page);
        }
        refreshPageNum();
        store.load({
            params:{
                start:_this.page-1,
                limit:limit
            }
        });
    }

    _constructor();
}


Fan.silder = {};

/**
 *
 * @param C
 * @constructor
 */
Fan.silder.SilderList = function(C) {
    C = C || {};
    var _this = this;
    var renderTo;
    var leftBtn;
    var rightBtn;
    var ilist;
    var total;
    var current;

    function _constructor() {
        renderTo = C.renderTo;
        if(typeof renderTo == "string") {
            var btnl = $(renderTo).find('.list-silder-btn');
            leftBtn = $(btnl.get(0));
            rightBtn = $(btnl.get(1));
            ilist = $(renderTo).find('.list-silder-container>ul.list-silder');
            total = ilist.find('li').size();
            ilist.css('left',-1*total*173);
            ilist.animate({
                left:0
            },{duration:400,easing:'swing'});
            current = 0;
            rightBtn.addClass('list-silder-btn-disabled');
            leftBtn.bind('click',function(e){
                if(current < (total - 5)) {
                    current += 5;
                    move();

                    if(current >= (total - 5)) {
                        leftBtn.addClass('list-silder-btn-disabled');
                    }
                    if(current > 0) {
                        rightBtn.removeClass('list-silder-btn-disabled');
                    }
                }
            });

            rightBtn.bind('click',function(e){
                if(current -5 >= 0) {
                    current -= 5;
                    move();

                    if(current < (total - 5)) {
                        leftBtn.removeClass('list-silder-btn-disabled');
                    }
                    if(current <= 0) {
                        rightBtn.addClass('list-silder-btn-disabled');
                    }
                }
            });
        }
    }

    function move() {
        ilist.animate({
            left:(-1*current*173)
        },{duration:500,easing:'swing'});
    }
    _constructor();
}


Fan.util = {};

/**
 * DateFormat
 *
 * @param format
 * @constructor
 */
Fan.util.DateFormat = function(date,fformat) {
    var format = fformat;
    function zeroize(v){
        return v<10?'0'+v:v;
    }

    var regs = [/(y{2,4})/,/(M{1,2})/,
        /(d{1,2})/,/(m{1,2})/,/H{1,2}/,/S{1,2}/,/h{1,2}/];

    $.each(regs,function(i,o){
        format = format.replace(o,function(p){
            switch(p) {
                case 'yy':return date.getFullYear().substr(2,3);
                case 'yyyy':return date.getFullYear();
                case 'M':return date.getMonth()+1;
                case 'MM':return zeroize(date.getMonth()+1);
                case 'd':return date.getDate();
                case 'dd':return zeroize(date.getDate());
                case 'H':return date.getHours();
                case 'HH':return zeroize(date.getHours());
                case 'm':return date.getMinutes();
                case 'mm':return zeroize(date.getMinutes());
                case 'S':return date.getSeconds();
                case 'SS':return zeroize(date.getSeconds());
                default: return p;
            }
        });
    });

    return format;
}

Fan.util.getWeekName = function(v) {
    switch(v) {
        case 0:return '周日';
        case 1:return '周一';
        case 2:return '周二';
        case 3:return '周三';
        case 4:return '周四';
        case 5:return '周五';
        case 6:return '周六';
    }
}

/**
 *
 * 滑动Panel
 *
 * @param C
 * @constructor
 */
Fan.panel.SlidePanel = function(C) {
    var renderTo;
    var render;
    var _this = this;
    var ftop;
    var fleft;
    var ttop;
    var tleft;

    function _constructor() {
        renderTo = C.renderTo;
        if((typeof renderTo) == 'string') {
            render = $('#'+renderTo);
        }
        else {
            render = renderTo;
        }
        ttop = C.top;
        tleft = C.left;

        render.addClass('fn-slide-container hide');
        render.attr("style","");
        render.offset({
            left:2*render.width()
        });
    }

    this.show = function() {
        $(_this).trigger('beforeshow');
        render.removeClass('hide');
        render.animate({
            left:0
        },500,function(){
            $(_this).trigger('aftershow');
        });
    }

    this.hide = function() {
        $(_this).trigger('beforehide');
        render.animate({
            left:render.width()
        },500,function(){
            render.addClass('hide');
            $(_this).trigger('afterhide');
        });
    }
    _constructor();
}


