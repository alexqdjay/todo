/**
 * Created with JetBrains PhpStorm.
 * User: alex
 * Date: 13-5-21
 * Time: 下午10:21
 * To change this template use File | Settings | File Templates.
 */

var ps;
var slide;
var hasChanged = false;
var clickDay;
var currentSchedule;
var currentScheduleEl;
var sourceMap = {};
var sourceMapCount = 0;
//var colors = ['#33cdc7'];

$(function(){
    $.each(colors,function(i,item){
        colorsMap[i] = null;
    });

    $.fn.datepicker.noConflict();
    // init datetime
    $( "#inputFTime" ).datepicker({
        defaultDate:+0,
        changeMonth: true,
        onClose: function( selectedDate ) {
            $( "#inputTTime" ).datepicker( "option", "minDate", selectedDate );
        }
    });
    $( "#inputFTime" ).val($.datepicker.formatDate('mm/dd/yy', new Date()));

    $( "#inputTTime" ).datepicker({
        defaultDate:+0,
        changeMonth: true,
        onClose: function( selectedDate ) {
            $( "#inputFTime" ).datepicker( "option", "maxDate", selectedDate );
        }
    });
    $( "#inputTTime" ).val($.datepicker.formatDate('mm/dd/yy', new Date()));


    //init calendar
    $('#cal').fullCalendar({
        header:{
            right:  '',
            center: 'title',
            left:  'today prev,next'
//            ,right: 'month,basicWeek,agendaDay'
        },
        droppable: true,
        ignoreTimezone:false,
        weekMode:'variable',
        events:{
            url:URL+'/../Schedule/showData'
        },
        theme:true,
        eventClick:function(event,e,v) {
            // init tooltip
            currentSchedule = event;
            currentScheduleEl = this;
        },
        eventAfterRender : function(event, element) {
            var html = generateBriefScheduleHtml(event,event.user_id != UID && event.createby != UID);
            element.popover({
                title:event.subject,
                html:true,
                content:html,
                placement:'top'
            });
        },
        drop: function(date, allDay) {
            var originalEventObject = $(this).data('eventObject');

            var copiedEventObject = $.extend({}, originalEventObject);

            $('#scheduleEditWin').modal('show');
            $('#scheduleEditWin').data('pid',copiedEventObject.pid);
            $('#scheduleEditWin').data('date',date);
        },
        dayClick: function(date, allDay, e, view) {
            currentSchedule = {
                startdate: $.datepicker.formatDate('mm/dd/yy',date),
                enddate: $.datepicker.formatDate('mm/dd/yy',date),
                subject:'新建日程',
                createuser:$('#userBtn span').text(),
                entrytime:new Date().getTime(),
                user_id:UID
            };
            currentScheduleEl = null;
            if(clickDay && clickDay.getDate() == date.getDate()) {
                slide.show();
                $(slide).unbind('beforeshow');
            }
            clickDay = date;
        },
        selectable:true,
        selectHelper:false
    });

    $('#cal').fullCalendar('addEventSource',{
        color:'#33cdc7',
        url:URL+"/../Schedule/getMyCreate"
    });

    // init slide
    ps = $('#projectSlide');
    slide = new Fan.panel.SlidePanel({
        renderTo:ps
    });

    $(slide).bind('afterhide',function(){
        if(hasChanged) {
        }
        currentSchedule = null;
    });

    $(slide).bind('beforeshow',onBeforeShow);

    $(slide).bind('beforehide',function(){
        if(hasChanged) {
        }

        $(slide).bind('beforeshow',onBeforeShow);

        $('#cal').fullCalendar('select',clickDay,clickDay,true);
    });

    // init model
    $('body').append($('#confirmDel'));
    $('#confirmDel').modal({
        show:false
    });

    $('body').append($('#scheduleEditWin'));
    $('#scheduleEditWin').modal({
        show:false
    });
    $('#scheduleEditWin').on('hidden',function(){
        $('#winInputSubject').val('');
        $('#winStartTime').val(0);
        $('#winEndTime').val(2);
    });

    // init select
    $('#userSelect').select2({
        placeholder: "输入查询的人",
        minimumInputLength:1,
        multiple:true,
        ajax: {
            url: URL+"/../User/listAllUserExceptMe",
            quietMillis: 100,
            data:function(term, page){
                return {
                    query:term
                };
            },
            results: function (data, page) {
                return {results: data};
            }
        },
        dropdownCssClass:"bigdrop",
        formatResult:function(data){
            return data.name +'<i>('+data.username+')</i>';
        },
        formatSelection:function(data){
            return data.name;
        }
    });

    $('#userSelect').on("change",function(e){
        var source;
        var pid;
        // add
        if(e.added  != undefined) {
            pid = e.added.id;
            var color = getEventColor(pid);
            source = {
                url:URL+'/../Schedule/getOtherPeopleData?oid='+pid+"&uid="+UID,
                color:color
            };
            addSource(pid,source);
            $('#cal').fullCalendar('addEventSource',source);
            addUserSource(pid,e.added.name,color);
        }
        // remove
        else if(e.removed != undefined) {
            pid = e.removed.id;
            source = getSource(pid);
            if(source != null) {
                $('#cal').fullCalendar('removeEventSource',source);
            }
            removeSource(pid);
            removeUserSource(pid);
        }
    });

    $('#selectOwner').select2({
        placeholder: "输入查询的人",
        minimumInputLength:1,
        ajax: {
            url: URL+"/../Partner/listMyPartnerAndMe",
            quietMillis: 100,
            data:function(term, page){
                return {
                    query:term,
                    uid:UID
                };
            },
            results: function (data, page) {
                return {results: data};
            }
        },
        dropdownCssClass:"bigdrop",
        formatResult:function(data){
            return data.name+"<i>("+data.username+")</i>";
        },
        formatSelection:function(data){
            return data.name;
        },
        initSelection:function(element, fn) {
            var id = $(element).val();
            $.ajax({
                url:URL+'/../User/get',
                data:{
                    uid:id
                }
            }).done(function(data){
                    fn(data);
            });

        }
    });
    $('#selectOwner').on('change',function(e){
        var id = e.val;
        if(id != null && id.toString().length>0) {
            initProjects(id);
        }
    });

    // init subBar project
    initSubProjs();
});


function onBeforeShow() {
    // init project select
    initProjects(currentSchedule.user_id);
    initEditSchedule(currentSchedule);
}

function initSubProjs() {
    var topSchdule = $('#topSchdule');
    $.ajax({
        url:URL+'/../Project/myCommonUseProj',
        success:function(res){
            $.each(res,function(i,item){
                var li = $('<li class="schdule-event"><span data-id="'+item.id+'" data-toggle="tooltip">'+item.name+'</span></li>');
                topSchdule.append(li);
                var eventObject = {
                    title:'新建日程 ('+ item.name+")",
                    pid:item.id
                };
                li.data('eventObject', eventObject);
                li.draggable({
                    zIndex: 999,
                    revert: true,      // will cause the event to go back to its
                    revertDuration: 0  //  original position after the drag
                });

                li.tooltip({
                    title:"拖动快速添加日程",
                    placement:'left',
                    delay:{
                        show:1000
                    }
                });
            });
        }
    });
}

function onConfirmCreateNew() {
    if(!$('#winInputSubject').validate())return;
    var title = $('#winInputSubject').val();
    var st = $('#winStartTime').val();
    var et = $('#winEndTime').val();
    var date = $('#scheduleEditWin').data("date");
    var start = date.getTime();
    var end = date.getTime();
    start += getTimeInterval(st);
    end += getTimeInterval(et);
    start = start/1000;
    end = end/1000;

    $.ajax({
        url:URL+'/../Schedule/save',
        data:{
            id:null,
            project: $('#scheduleEditWin').data("pid"),
            desc:'',
            start:date.getTime()/1000,
            end:date.getTime()/1000,
            addr:0,
            owner:UID,
            subject:title,
            mode:0,
            startDate: $.datepicker.formatDate('mm/dd/yy',date),
            endDate:$.datepicker.formatDate('mm/dd/yy',date),
            startTime:st,
            endTime:et,
            start:start,
            end:end
        },
        success:function(data){
            if(data.success) {
                $('#cal').fullCalendar('refetchEvents');
                $('#scheduleEditWin').modal('hide');

            }
        }
    });
}

function getSource(id) {
    return sourceMap["s_"+id];
}

function addSource(id,source) {
    sourceMapCount++;
    sourceMap["s_"+id] = source;
}

function removeSource(id) {
    sourceMapCount --;
    if(sourceMapCount <0)sourceMapCount=0;
    sourceMap["s_"+id] = null;
    for(var k in colorsMap){
        alert(k+"="+colorsMap[k]);
        if(colorsMap[k] == id) {
            colorsMap[k] = null;
        }
    }
}

function addUserSource(id,text,color) {
    var html = '<li id="userSource_'+id+'" style="background-color: '+color+';">' +
        text+
        '</li>';
    $(html).hide().appendTo($('#userSourceList')).fadeIn(500);
}

function removeUserSource(id) {
    $('#userSource_'+id).fadeOut(500,function(){
        $(this).remove();
    });
}

var colors = ['#2f7ed8',  '#8bbc21', '#910000', '#1aadce', '#492970',
    '#f28f43', '#77a1e5', '#c42525', '#a6c96a','#0d233a'];
var colorsMap = {};
function getEventColor(pid) {
    var color = '#2f7ed8';
    for(var i=0;i<colors.length;i++) {
        if(colorsMap[i] == null) {
            colorsMap[i] = pid;
            color = colors[i];
            break;
        }
    }
    return color;
//    var r = Math.floor(Math.random()*256);
//    var g = Math.floor(Math.random()*256);
//    var b = Math.floor(Math.random()*256);
//    return "#"+r.toString(16)+g.toString(16)+b.toString(16);
}

function containSource(id) {
    if(getSource(id) != null)return true;
    return false;
}

function editReturn() {
    slide.hide();
}

function generateBriefScheduleHtml(schedule,readOnly){
    try{
    var startDate = $.datepicker.parseDate('mm/dd/yy',schedule.startdate);
    var endDate = $.datepicker.parseDate('mm/dd/yy',schedule.enddate);
    var html = '<p>'+schedule.name+'</p>';
    html += '<p>'+$.datepicker.formatDate('mm/dd',startDate)+"("+Fan.util.getWeekName(startDate.getDay())+")";
    if(schedule.mode != 1) {
        html += ','+ getTimeString(schedule.starttime);
    }
    html += ' - ' + $.datepicker.formatDate('mm/dd',endDate)+"("+Fan.util.getWeekName(endDate.getDay())+")";
    if(schedule.mode != 1) {
        html += ','+ getTimeString(schedule.endtime);
    }
    +'</p>';
    if(!readOnly && !schedule.readOnly) {
        html += "<hr style='margin: 5px 0px;'>";
        html += "<p><a class='fn-btn pull-left fn-btn-danger' style='margin-bottom: 5px' " +
            "onclick='onDelSchedule();'>删除</a>" +
            "<a class='fn-btn pull-right fn-btn-primary' onclick='onEditSchedule()'>编辑</a></p>";
    }
    }catch(ee){
    }
    return html;
}

function initProjects(uid) {
    $('#selectProject').empty();
    $.ajax({
        url:URL+"/../Project/listHisProject",
        data:{
            uid:uid
        },
        success:function(datas){
            $.each(datas,function(i,a){
                var name = a.name;
                var id = a.id;
                $('#selectProject').append('<option value="'+id+'" class="fn-select-option">'+name+'</option>');
            });
        }
    });
}

function onEditSchedule() {
    slide.show();
    if(currentScheduleEl) {
        $(currentScheduleEl).popover('hide');
    }
}

function onConfirmDel() {
    if(currentSchedule == null)return;
    $.ajax({
        url:URL+'/../Schedule/delete',
        data:{
            sid:currentSchedule.id
        },
        success:function(re){
            if(re.success && re.success != 0) {
                $('#confirmDel').modal('hide');
                if(currentScheduleEl) {
                    $(currentScheduleEl).popover('hide');
                    $('#cal').fullCalendar('refetchEvents');
                }
            }
        }
    });
}

function onDelSchedule() {
    $('#confirmDel').modal('show');
}

function initEditSchedule(schedule) {
    if(schedule == null) {
        schedule = {
            subject:'新建日程'
        };
    }
    var date = new Date();
    date.setTime(schedule.entrytime);
    $('#signature p').text(schedule.createuser);
    $('#signature small').text($.datepicker.formatDate('mm/dd/yy',date));
    $('#selectOwner').select2('val',schedule.user_id);
    $('form input[name="id"]').val(schedule.id);
    $('form input[name="subject"]').val(schedule.subject);
    $('form select[name="addr"]').val(schedule.addr);
    $('textarea').val(schedule.desc);
    $('select[name="project"]').val(schedule.project_id);
    $('input[name="mode"]').get(0).checked = schedule.mode==1?true:false;
    $( "#inputFTime" ).val(schedule.startdate);
    $( "#inputTTime" ).val(schedule.enddate);
    if(schedule.mode == 0) {
        $('#startTime').val(schedule.starttime);
        $('#endTime').val(schedule.endtime);
    }
    onTimeModeChange();
}

function onTimeModeChange() {
    var mode = $('input[name="mode"]').get(0).checked;
    if(mode == true) {
        $('#datetime').children('.time').hide();
//        $('#datetime').children('.date').removeClass('span2');
//        $('#datetime').children('.date').addClass('span4');
    }
    else {
        $('#datetime').children('.time').show();
//        $('#datetime').children('.date').removeClass('span4');
//        $('#datetime').children('.date').addClass('span2');
    }
}

function editSave() {
    var res = {};
    var b = true;
    $('.form-horizontal :input').each(function(){
        if(this.name == "mode") {
            res[this.name] = this.checked?1:0;
        }
        else {
            res[this.name] = $(this).val();
        }
        b = b && $(this).validate();
    });

    b = b && $('#inputFTime').validate();
    b = b && $('#inputTTime').validate();

    if(!b)return;

    var startDate = $('#inputFTime').datepicker('getDate');
    var endDate = $('#inputTTime').datepicker('getDate');
    var start = startDate.getTime();
    var end = endDate.getTime();

    if(res.mode == 0) {
        start += getTimeInterval($('#startTime').val());
        end += getTimeInterval($('#endTime').val());
    }
    else if(res.mode == 1){
        end += 24*3600*1000;
    }
    res.start = start/1000;
    res.end = end/1000;
    $.ajax({
        url:URL+'/save',
        type:'POST',
        data:res,
        success:function(data){
            if(data.success) {
                slide.hide();
                $('#cal').fullCalendar('refetchEvents');
            }
        }
    });
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

function getTimeInterval(v) {
    v = parseInt(v);
    switch(v) {
        case 0: return 9*3600*1000;
        case 1: return 12*3600*1000;
        case 2: return 17*3600*1000;
        case 3: return 21*3600*1000;
    }
}