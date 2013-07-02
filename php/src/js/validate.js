/**
 * Created with JetBrains PhpStorm.
 * User: alex
 * Date: 13-5-30
 * Time: 下午6:01
 * To change this template use File | Settings | File Templates.
 */

$.fn.validate = function(option) {
    option = option || {};
    var _this = this;
    var required = this.attr('data-required');
    var maxLength = this.attr('data-maxlength');
    var minLength = this.attr('data-minlength');
    var reg = this.attr('data-reg');
    var value = null;
    var successTag = option.successTag;
    var errorTag = option.errorTag==null?true:option.errorTag;
    var isMail = this.attr('data-email');
    var MAIL_REG = new RegExp("^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.([a-zA-Z0-9_-])+)+)$");

    this.bind('keyup',function(){
        check();
    });

    function check() {
        var b = true;
        value = _this.val();
        if(required && (value == null || value.length == 0)) {
            addErrorTag("不能为空!");
            b = false;
        }
        else if(maxLength && maxLength < value.length) {
            addErrorTag("最大长度为"+maxLength+" !");
            b = false;
        }
        else if(minLength && minLength> value.length) {
            addErrorTag("最小长度为"+minLength+" !");
            b = false;
        }
        else if(reg != null && reg.length>0) {
            var R = new RegExp(reg);
            b = R.test(value);
            if(!b) {
                addErrorTag("格式出错 ！");
            }
        }
        if(isMail && !MAIL_REG.test(value)) {
            addErrorTag("不符合Email格式 ！");
            b = false;
        }

        if(b){
            addSuccess();
        }

        return b;
    }

    function addErrorTag(msg) {
        if(!errorTag)return;
        var p = _this.parent();
        if(_this.parent().hasClass('input-append')) {
            p = p.parent();
        }
        p.find('.help-inline').remove();
        p.append('<span class="help-inline">'+msg+'</span>');
        p.parent().addClass('error');
    }

    function addSuccess() {
        _this.parent().find('.help-inline').remove();
        _this.parent().parent().removeClass('error');
        if(successTag) {
            _this.parent().append('<span class="help-inline"><i class="icon-ok"></i></span>');
        }
    }

    return check();
}