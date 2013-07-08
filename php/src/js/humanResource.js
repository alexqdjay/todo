/**
 * Created with JetBrains PhpStorm.
 * User: alex
 * Date: 13-6-18
 * Time: 下午10:18
 * To change this template use File | Settings | File Templates.
 */

var rows;
var weekDaytime = {};
var startTime;
var endTime;
var currentInc = 0;

$(function(){

    rows = $('#humanTable tbody tr');

    var uncheckedIds = CP.getCookie('mpc');
    if(uncheckedIds != null && uncheckedIds.length>0) {
        $.each(uncheckedIds.split(","),function(i,item){
            var checkbox = $("#"+item).find('td input[type="checkbox"]');
            if(checkbox != null && checkbox.size()>0){
                checkbox.get(0).checked = false;
                $("#"+item).addClass('hiderow');
            }
        });
    }


    $('th input[type="checkbox"]').on('click',function(){
        var checked = this.checked;
        $('tr td input[type="checkbox"]').each(function(){
            this.checked = checked;
            $(this).trigger('change');
        });
    });

    $('tr td input[type="checkbox"]').on('change',function(){
        var checked = (this.checked);
        var id = $(this).parent().parent().attr('id');
        if(!checked) {
            hideRow($(this).parent().parent());
        }
        else {
            showRow($(this).parent().parent());
        }
    });

    initDayAndGetSchedule();

//    var tbar = $('#topBar');
//    var ttbar = $('#tableBar').parent().parent();
//    $(window).scroll(function(){
////        ss.text(document.documentElement.scrollTop);
//        if($(document).scrollTop()>56) {
//            tbar.css("position","fixed");
//            tbar.css("top","0px");
//            ttbar.css("position","fixed");
//            ttbar.css("top","40px");
//        }
//        else {
//            tbar.css("position","");
//            ttbar.css("position","");
//        }
//    });


});

function showRow(row) {
    row.removeClass('hiderow');

    refreshUncheckedId();
}

function hideRow(row) {
    row.addClass('hiderow');

    refreshUncheckedId();
}

function refreshUncheckedId() {
    var ids = "";
    rows.each(function(){
        var checkbox = $(this).find('td input[type="checkbox"]');
        if(checkbox != null && checkbox.length>0){
            if(!checkbox.get(0).checked) {
                ids += this.id+",";
            }
        }
    });
    if(ids.trim().length>0) {
        ids = ids.substr(0,ids.length-1);
    }
    CP.setCookie({'mpc':ids});
}

function initDaytime(now) {
    var offset = now.getDay();
    if(offset == 0)offset=7;
    var tmpDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(),0,0,0);
    startTime = tmpDate.getTime() - (offset-1)*24*3600*1000;
    endTime = startTime + 7*24*3600*1000;

    for(var i=0;i<7;i++){
        weekDaytime[i] = startTime + i*24*3600*1000;
    }

    $('#timeRegion').text(
        Fan.util.DateFormat(new Date(weekDaytime[0]),"MM/dd")+" - "+
            Fan.util.DateFormat(new Date(weekDaytime[6]),"MM/dd"));
}

function getSchedules(start) {
    $('#humanTable tbody tr td[class*="wk"]').removeClass('active').empty();
    $.ajax({
        url:URL+"/../Schedule/listOneWeek",
        data:{
            start:start/1000
        },
        success:function(res){
            var show_Sat = false;
            var show_Sun = false;
            rows.each(function(){
                var id = $(this).attr('data-id');
                var datas = res[id];
                if(datas != null) {
                    var weekEvents = initEvents(datas);
                    for(var day in weekEvents) {
                        var events = weekEvents[day];
                        var tar = $('#u_'+id+" .wk"+day);
                        for(var i=0;i<events.length;i++) {
                            createEvent(tar,events[i]);
                        }
                    }

                    show_Sat = show_Sat || (weekEvents["6"]!=null && weekEvents["6"].length>0);
                    show_Sun = show_Sun || (weekEvents["7"]!=null && weekEvents["7"].length>0);
                }
            });
            if(!show_Sat) {
                $('.th6').hide();
            }
            else {
                $('.th6').show();
            }
            if(!show_Sun) {
                $('.th7').hide();
            }
            else {
                $('.th7').show();
            }
//            $('#humanTable thead th').each(function(i){
//                var tth = $('#tableBar thead th').get(i);
//                $(tth).width($(this).width());
//            });
        }
    });
}

function initEvents(events) {
    var weekEvents = {};
    if(events == null)return weekEvents;
    for(var i=0;i<events.length;i++) {
        var event = events[i];
        var startTs = parseInt(event.start)*1000;
        startTs = startTs>weekDaytime[0]?startTs:weekDaytime[0];
        var endTs = parseInt(event.end)*1000;
        endTs = endTs<weekDaytime[6]?endTs:weekDaytime[6];

        var tmpDate = new Date();
        tmpDate.setTime(startTs);
        var start = tmpDate.getDay();
        start = start==0?7:start;

        tmpDate.setTime(endTs);
        var end = tmpDate.getDay();
        end = end==0?7:end;
        end = end<start?end+7:end;
        if(event.mode==1 && end==7)end++;

        for(start;(event.mode ==1 && start<end)||(event.mode ==0 && start<=end) && start<=7;start++){
            if(weekEvents[start] == null) {
                weekEvents[start] = [];
            }
            weekEvents[start].push(event);
        }

    }
    return weekEvents;
}

function createEvent(tar,event){
    if(tar && tar.append) {
        tar.append('<div class="event">'+htmlTempl(event)+'</div>');
        tar.addClass("active");
    }
}

function htmlTempl(event) {
    var html = "<span>"+event.subject+"("+event.pname+")"+"</span>";
    if(event.mode==1) {
        html += "<br><i>09:00-17:00</i>";
    }
    else {
        html += "<br><i>"+getTimeString(event.starttime)+"-"+getTimeString(event.endtime)+"</i>";
    }
    return html;
}

function preWeek() {
    currentInc --;
    initDayAndGetSchedule();
}

function nextWeek() {
    currentInc ++;
    initDayAndGetSchedule();
}

function initDayAndGetSchedule() {
    initDaytime(new Date(new Date().getTime() + currentInc*7*24*3600*1000));
    getSchedules(weekDaytime[0]);
}

function getTimeString(v){
    v = parseInt(v);
    switch(v){
        case 0: return '09:00';
        case 1: return '12:00';
        case 2: return '17:00';
        case 3: return '21:00';
    }
}