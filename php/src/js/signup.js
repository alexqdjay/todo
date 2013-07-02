/**
 * Created with JetBrains PhpStorm.
 * User: alex
 * Date: 13-6-6
 * Time: 上午10:50
 * To change this template use File | Settings | File Templates.
 */
var duplicated = false;
$(function(){
    $('#mail').on('keyup',function(){
        $('#username').val($('#mail').val());

        if($(this).val().length>0) {
            $(this).removeClass('invalid');
        }
    });

    $('#mail').on('blur',function(){
        $.ajax({
            url:URL+"/../Login/checkUserDuplicate",
            data:{
                usr:$(this).val()
            },
            success:function(re) {
                if(re.success) {
                    duplicated = false;
                    $('#username').parent().parent().removeClass('error');
                    $('#username').parent().find('span').remove();
                }
                else {
                    duplicated = true;
                    $('#username').parent().parent().addClass('error');
                    $('#username').parent().append('<span class="help-inline">该用户名已存在!</span>');
                }
            }
        });
    });

    $('#pwdack').on('keyup',function(){
        var p = $(this).parent();
        if($(this).val()!=$('#pwd').val()) {
            p.parent().addClass('error');
        }
        else {
            p.parent().removeClass('error');
        }
    });
});

function onSubmit() {
    if(duplicated)return;
    var b = $('#mail').validate({
        errorTag:false
    });
    if(!b) {
        $('#mail').addClass('invalid');
    }
    if(b) {
        b = b && $('#pwd').validate();
    }

    if(b) {
        b = b && $('#pwdack').val() == $('#pwd').val();
    }

    if(b) {
        b = b && $('#name').validate();
    }

    if(!b) return;

    $.ajax({
        method:'POST',
        url:URL+'/../Login/signup',
        data:{
            mail: $('#mail').val()+"@eccom.com.cn",
            username: $('#mail').val(),
            pwd:$('#pwd').val(),
            name:$('#name').val(),
            tel:$('#tel').val()
        },
        success:function(re){
            if(re.status == 1) {
                alert(re.info);
                window.location.href = URL+"/../"+re.url;
            }
        }
    });
}