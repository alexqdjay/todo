/**
 * Created with JetBrains PhpStorm.
 * User: alex
 * Date: 13-6-4
 * Time: 下午10:08
 * To change this template use File | Settings | File Templates.
 */

var selectedPeople;

$(function(){
    $("#peopleTable tbody tr").on('click',function(){
        if($(this).hasClass('active'))return;
        $("#peopleTable tr").each(function(){
            $(this).removeClass('active');
        });
        $(this).addClass('active');
        selectedPeople = $(this).attr('data-id');
        getMembers($(this).attr('data-id'));
    });

    //init partner select
    $('#partnerSelect').select2({
        minimumInputLength:1,
        ajax: {
            url: URL+"/../Partner/getAddPartner",
            dataType: 'json',
            data: function (term, page) {
                return {
                    q: term,
                    mid:selectedPeople
                };
            },
            results: function (data, page) {
                return {results: data};
            }
        },
        formatResult:function(object, container, query){
            return '<span data-id="'+object.id+'">'+object.name+'('+object.username+')'+'</span>';
        },
        formatSelection:function(object, container) {
            return object.name;
        },
        initSelection:function(element, callback) {

        }
    });

    $('#partnerSelect').on('change',function(val){
        addPartner(val.added);
    });

    $('#userSelect').select2({
        minimumInputLength:1,
        placeholder: "输入过滤",
        allowClear:true
    });
});

function addPartner(item) {
    if(item == null)return;
    $.ajax({
        url:URL+"/../Partner/add",
        data:{
            pid:item.id,
            mid:selectedPeople
        },
        success:function(res){
            if(res.success && res.success != 0) {
                var html = generateMemHtml({
                    name:item.name,
                    id:item.id
                });
                var tar = $(html);
                tar.fadeIn(500);
                $('#partnerTable tbody').prepend(tar);
                $("#partnerSelect").select2("val", "");
            }
        }
    });
}

function onDeletePartner(pid){
    $.ajax({
        url:URL+'/../Partner/del',
        data:{
            pid:pid,
            mid:selectedPeople
        },
        success:function(res){
            if(res.success && res.success != 0) {
                $('#partnerTable tr[data-id="pid_'+pid+'"]').fadeOut('slow');
            }
        }
    })
}

function getMembers(uid) {
    $.ajax({
        url:URL+'/../Partner/getPartner',
        data:{
            uid:uid
        },
        success:function(data){
            $('#partnerTable tbody').empty();
            var i = 0;
            function getPartnerHtml(item) {
                var html = generateMemHtml(item);
                var tar = $(html);
                tar.fadeIn(100,function(){
                    i++;
                    if(i>=data.length) return;
                    getPartnerHtml(data[i]);
                });
                $('#partnerTable tbody').append(tar);
            }

            if(data != null && data.length>0) {
                var item = data[i];
                getPartnerHtml(item);
            }
        }
    });
}

function generateMemHtml(item) {
    return '<tr data-id="pid_'+item.id+'">'+
        '<td>'+item.name+'</td>'+
        '<td><a class="fn-btn fn-btn-danger" style="width:15px;" title="删除" onclick="onDeletePartner('+item.id+')">'+
        '<i class="icon-trash icon-white"></i>'+
        '</a></td>'+
        '</tr>';
}

