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
var ec;

$(function(){

    rows = $('#humanTable tbody tr');

    ec = $('#eventContainer');

    initDaytime(new Date());

    getSchedules();

    initEvents($('#u_1 td.wk2'),2);
});

function initDaytime(now) {
    var offset = now.getDay();
    if(offset == 0)offset=7;
    var tmpDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(),0,0,0);
    startTime = tmpDate.getTime() - (offset-1)*24*3600*1000;
    endTime = startTime + 7*24*3600*1000;

    for(var i=0;i<7;i++){
        weekDaytime[i] = startTime + i*24*3600*1000;
    }
}

function getSchedules() {
    $.ajax({
        url:URL+"/../Schedule/listOneWeek",
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
            if(!show_Sun) {
                $('.th7').hide();
            }
        }
    });
}

function initEvents(events) {
    var weekEvents = {};
    if(events == null)return weekEvents;
    for(var i=0;i<events.length;i++) {
        var event = events[i];
        var tmpDate = new Date();
        tmpDate.setTime(parseInt(event.start)*1000);
        var start = tmpDate.getDay();
        start = start==0?7:start;
        tmpDate.setTime(parseInt(event.end)*1000);
        var end = tmpDate.getDay();
        end = end==0?7:end;
        end = end<start?end+7:end;
        for(start;start<=end && start<=7;start++){
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
        tar.append('<div class="event">'+event.subject+'</div>');
        tar.addClass("active");
    }
}
