/**
 * Created with JetBrains PhpStorm.
 * User: alex
 * Date: 13-5-22
 * Time: 下午7:45
 * To change this template use File | Settings | File Templates.
 */

var slide = null;
var ps;
var hasChanged = false;
$(function(){

    //init slide
    ps = $('#projectSlide');
    slide = new Fan.panel.SlidePanel({
        renderTo:ps
    });

    $(slide).bind('afterhide',function(){
        if(hasChanged) {
            window.location.reload();
        }
    });

    // init calender
    $('#inputTime').datepicker();

    // init select mamager
    $('#inputManager').select2();

    $('#inputEngineer').select2();

    // init model
    $('body').append($('#confirmDel'));
    $('#confirmDel').modal({
        show:false
    });

   //init search select
    $('#proSelect').select2({
        placeholder: "输入查询的项目",
        allowClear:true
    }).on('change',function(e){
//        e.val
    });
    $('#proSelect').select2('data',{});
});

function onEdit(pid) {
    ps.find('h3').text('编辑项目');
    $.ajax({
        url:URL+"/../Project/get",
        data:{
            pid:pid
        },
        success:function(data){
            initProjEidt(data);
            slide.show();
        }
    });
}

function initProjEidt(data) {
    if(data == null){
        var d = new Date();
        data={
            "id":null,
            "name":"",
            "time": d.getTime()/1000+"",
            "type":null,
            "director_id":null,
            "manager_id":UID,
            engineers:[UID]
        };
    }
    for(var k in data) {
        var item = ps.find('input[name="'+k+'"],select[name="'+k+'"]');
        if(item.size() == 0) {
            continue;
        }
        var v = data[k];
        if(k == "time" && v != null && v.length >0) {
            var d = new Date();
            d.setTime(parseInt(v)*1000);
            v = $.datepicker.formatDate('mm/dd/yy',d);
        }
        item.val(v);
        item.trigger("change");
    }
}

function onSaveProj() {
    var data = {};
    var b = true;
    ps.find('input,select').each(function(){
        b = b && $(this).validate();
        var v = $(this).val();
        var k = $(this).attr('name');
        if(k != null && v != null) {
            data[k] = v.toString();
        }
    });

    if(!b) {
        return;
    }
    var date = $.datepicker.parseDate("mm/dd/yy",data['time']);
    data['time'] = date.getTime()/1000;
    $.ajax({
        url:URL+'/../Project/save',
        data:data,
        success:function(res) {
            if(res.success) {
                alert('success');
                hasChanged = true;
                if(data.id == null || data.id=='') {
                    ps.find('input').each(function(){
                        $(this).val('');
                    });
                }
            }
        }
    });
}

function onConfirmDelPro() {
    $('#confirmDel').modal('hide');
    var pid = $('#confirmDel').data('pid');
    $.ajax({
        url:URL+'/../Project/close',
        data:{
            pid:pid
        },
        success:function(res) {
            if(res.success && res.success != 0) {
                $('#pro_'+pid).fadeOut("slow");
            }
        }
    });
}

function onProjClose(i) {
    $('#confirmDel').modal('show');
    $('#confirmDel').data('pid',i);
}

    function onAddProj() {
    initProjEidt();
    ps.find('h3').text('新建项目');
    slide.show();
}

function onClose() {
    slide.hide();
}