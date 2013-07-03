/**
 * Created with JetBrains PhpStorm.
 * User: alex
 * Date: 13-7-3
 * Time: 下午8:58
 * To change this template use File | Settings | File Templates.
 */
$(function(){

    $('#dateList ul li').siblings().hide();

    $('#dateList ul li').siblings().slideToggle(1000);

    $('ul h2 a').click(function(){
        $(this).parent().siblings().slideToggle();
    });

    $("#expBtn").click(function(){
        if($(this).children().hasClass('icon-chevron-down')) {
            $(this).children().removeClass('icon-chevron-down');
            $(this).children().addClass('icon-chevron-up');
            $('#dateList ul li').slideDown();
        }
        else {
            $(this).children().addClass('icon-chevron-down');
            $(this).children().removeClass('icon-chevron-up');
            $('#dateList ul li').slideUp();
        }
    });
});
