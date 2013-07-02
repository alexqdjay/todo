/**
 * Created with JetBrains PhpStorm.
 * User: alex
 * Date: 13-5-21
 * Time: ??8:07
 * To change this template use File | Settings | File Templates.
 */

var CP = {} || CP;

$(function(){

    var param = getModule();

    CP.collapse = new Fan.Collapse();

    // collapse
    if(param.action==null || param.action=='index'|| param.action=='home') {
        var tmp = param.module;
        tmp = tmp.substr(0,1).toLowerCase() + tmp.substring(1,tmp.length);
//        CP.collapse.select(tmp+"Nav");
    }
    else {
//        CP.collapse.select(param.action+"Nav");
        var tpp = $("#"+param.action+"Nav").parent().parent();
        if(tpp.hasClass('accordion-body')) {
//            tpp.collapse('show');
        }
    }

    //breadcrumb
//    var c = {
//        items:[{
//            text:'首页',
//            href:URL+'/../',
//            icon:'icon-home'
//        }]
//    };
//    if(param.action==null || param.action=='index') {
//        var tmp = param.module;
//        tmp = tmp.substr(0,1).toLowerCase() + tmp.substring(1,tmp.length);
//        var m = $('#'+tmp+'Nav');
//        var href = m.attr('href');
//        var icon = m.children('i').attr('class');
//        var name = m.text();
//        c.items.push({
//            text:name,
//            href:href,
//            icon:icon
//        });
//    }
//    else {
//        var a = $("#"+param.action+"Nav");
//        var aName = a.text();
//        var aIcon = a.children('i').attr('class');
//        var aHref = a.attr('href');
//        var ap = a.parent().parent().parent().children('.accordion-heading').children();
//        if(ap.get(0) != undefined) {
//            var apName = ap.text();
//            var apIcon = ap.children('i').attr('class');
//            c.items.push({
//                text:apName,
//                href:null,
//                icon:apIcon
//            });
//            c.items.push({
//                text:aName,
//                href:aHref
//            });
//        }
//    }
//    var bc = new Fan.Breadcrumb($('#breadcrumb .breadcrumb'));
//    bc.creatItems(c);
//    CP.breadcrumbItems = c;

    // user name set
//    var username = CP.getCookie('uu');
//    if(username == null) username = "login";
//    $('#userBtn').find('span').text(username);

});

var urlReg = new RegExp('/\\S+/(\\S+)');
function getModule() {
    var url = URL;
    var url2 = PATH;
    var match = url.match(urlReg);
    var module = null;
    var action = null;
    if(match && match.length>1) {
        module = match[1];
    }
    var tmpReg = new RegExp(module+'/(\\w+)');
    match = url2.match(tmpReg);
    if(match && match.length>1) {
        action = match[1];
    }
    return {
        module:module,
        action:action
    };
}

CP.getCookie = function(name) {
    var cookie = document.cookie;
    if(cookie.length>0) {
        var start = cookie.indexOf(name+"=");
        if(start != -1) {
            var end = cookie.indexOf(";",start);
            if(end == -1) {
                return cookie.substring(start+name.length+1,cookie.length);
            }
            return cookie.substring(start+name.length+1,end);
        }
    }
    return null;
}

CP.setCookie = function(obj) {
    for(f in obj) {
        document.cookie = f+"="+obj[f];
    }
}