(function(window){

var canvas = document.querySelector('#smartCanvas') ,
	img = document.querySelectorAll('.img')[0] ,
	hue = document.querySelectorAll('.h')[0] ,
	saturation = document.querySelectorAll('.s')[0] ,
	lightness = document.querySelectorAll('.l')[0] ,
	tips = document.querySelector('#state') ,
	start = document.querySelector('#start') ,
	select = document.querySelectorAll('.select')[ 0 ] ;
	

var state = false;
var canvasImg = new Image() ;
canvasImg.onload = function(e){
	var context = canvas.getContext('2d') ;
	state = true ; 
	tips.innerHTML = '图片加载成功' ;
	var zoom = Math.min( canvas.width/this.width , canvas.height/this.height ) ;
	context.clearRect( 0 , 0 , canvas.width , canvas.height ) ;
	context.drawImage( canvasImg , 0, 0 , this.width*zoom , this.height*zoom ) ;
	smartCanvas = undefined ;
} ;
canvasImg.onerror = function(e){
	state = false ;
	tips.innerHTML = '图片加载失败' ;
} ;

img.addEventListener('keyup', loadImg.bind(img) ) ;
img.addEventListener('focus', loadImg.bind(img) ) ;
img.addEventListener('blur', loadImg.bind(img) ) ;
function loadImg(){
	var img = this,
		src = img.value ;

	canvasImg.src = src ;
	state = false ;
	tips.innerHTML = '尚未加载成功' ;
} ;


// hue.addEventListener('keyup', hsl.bind(hue)) ;
// saturation.addEventListener('keyup',hsl.bind(saturation)) ;
// lightness.addEventListener('keyup',hsl.bind(lightness)) ;

// hue.addEventListener('focus', hsl.bind(hue)) ;
// saturation.addEventListener('focus',hsl.bind(saturation)) ;
// lightness.addEventListener('focus',hsl.bind(lightness)) ;

var smartCanvas ; //smarkCanvas
start.addEventListener('click',function(){
	if ( !state ){
		return ;
	}
	var self = this ;
	var h = hue.value , //-180~180
		s = saturation.value , //-100~100
		l = lightness.value ; // -100~100	
	if ( !smartCanvas ){
		smartCanvas = new SmartHSL(canvas) ;
	}
	console.log('h:'+h+',s:'+s+',l:'+l) ;
	smartCanvas.hsl(h,s,l) ;
}) ;

select.addEventListener('change',function(){
	var self = this ;
	var reader = new FileReader() ;
	reader.onload = function(){
		canvasImg.src = this.result ;
	} ;
	reader.readAsDataURL(this.files[0]) ;
	state = false ;
	tips.innerHTML = '尚未加载成功' ;
}) ;
select.addEventListener('click',function(){
	this.value = '' ;
});

window.onload = function () {
    img.focus();
};

})(window)