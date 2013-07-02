/**
 * Created with JetBrains PhpStorm.
 * User: alex
 * Date: 13-7-1
 * Time: 下午2:39
 * To change this template use File | Settings | File Templates.
 */
$(function(){

});


function onJoinPrj(prjId) {
    $.ajax({
        url:URL+"/joinProj",
        data:{
            pid:prjId
        },
        success:function(res){
            if(res.success) {
                var td = $('#pro_'+prjId).find('.action_td').empty();
                td.append('<a class="fn-btn disabled">关注</a>');
            }
        }
    });
}

function onQuitProj(pid) {
    $.ajax({
        url:URL+"/quitProj",
        data:{
            pid:pid
        },
        success:function(res){
            if(res.success == 1) {
               $('#pro_'+pid).fadeOut();
            }
        }
    });
}
