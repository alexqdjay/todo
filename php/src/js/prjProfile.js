/**
 * Created with JetBrains PhpStorm.
 * User: alex
 * Date: 13-7-2
 * Time: 上午9:43
 * To change this template use File | Settings | File Templates.
 */
$(function(){

    $("#timeProgress").knob({});
    $("#timeProgress").val($("#timeProgress").attr('data-value')).trigger('change');
    var data = [];
    $.ajax({
        url:URL+'/../Project/userParticipation/pid/'+PID,
        async:false,
        success:function(res){
            data = res;
        }
    });

    $('#userChart').highcharts({
        chart: {
        },
        title: {
            text: '<b>人员参与度</b>(h)'
        },
        tooltip: {
//            pointFormat: '<b>{this.percentage}%</b>',
            formatter:function(){
                return '<b>'+this.point.name+'</b>:'+(this.percentage).toFixed(1) +' %';
            },
            percentageDecimals: 1
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    color: '#000000',
                    connectorColor: '#000000',
                    formatter: function() {
                        return '<b>'+ this.point.name +'</b>: '+ (this.percentage).toFixed(1) +' %'+'('+this.y+')';
                    }
                }
            }
        },
        series: [{
            type: 'pie',
            name: 'Browser share',
            data: data
        }]
    });
});