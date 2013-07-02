/**
 * Created with JetBrains PhpStorm.
 * User: alex
 * Date: 13-5-22
 * Time: 下午3:03
 * To change this template use File | Settings | File Templates.
 */
var pwdInput;
var nameInput;
$(function(){

    var inputs = $(':input');
    pwdInput = $(inputs.get(1));
    nameInput = $(inputs.get(0));

    $('html').bind('keypress',function(e){
        if(e.keyCode == 13) {
            login();
        }
    });

    inputs.bind('keypress',function(e){
        $(this).removeClass('error');
    });

});


function login() {
    var name = nameInput.val();
    var pwd = pwdInput.val();
    if(name == null || name.length==0) {
        nameInput.addClass('error');
        return;
    }
    if(pwd == null || pwd.length==0) {
        pwdInput.addClass('error');
        return;
    }

    $(':input').removeClass('error');
    $.ajax({
        type:'POST',
        url:URL+'/../Login/login',
        data:{
            name:name,
            pwd: $.md5(pwd),
            inCookie:$('#remember').get(0).checked
        },
        success:function(data) {
            if(!data.success) {
                if(data.code == 1) {
                    nameInput.addClass('error');
                }
                else if(data.code == 2) {
                    pwdInput.addClass('error');
                    pwdInput.val('');
                }
            }
            else {
                window.location.href = URL+"/../Index/home";
            }
        }
    });

}