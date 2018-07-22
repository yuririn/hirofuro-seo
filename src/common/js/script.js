$(function(){
  
  $('a[href^="#"]').on("click",function(){
		var speed = 400; // ミリ秒
		var href= $(this).attr("href");
		var target = $(href == "#" || href == "" ? 'html' : href);
		var position = target.offset().top;
		$('body,html').animate({scrollTop:position}, speed, 'swing');
		return false;
	});
  
  
  $(".menu_open").on("click", function(){
    $(".gnav").fadeIn();
  })
  
  $(".close, .gnav a").on("click", function(){
    $(".gnav").fadeOut();
  })
  
})