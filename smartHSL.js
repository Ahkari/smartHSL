var SmartHSL = (function(window,undefined){

function SmartHSL(canvas){
	this.canvas = canvas ;
	this.context = this.canvas.getContext('2d') ;
	this.imageDate = this.context.getImageData( 0, 0, this.canvas.width , this.canvas.height ) ;
	this._imageDate = this.context.createImageData( this.canvas.width , this.canvas.height ) ;
	this.map = {
		1 : 'Hue' ,
		2 : 'Saturation' ,
		3 : 'Lightness' 
	} ;
	this.Hue = 0 ;
	this.Saturation = 0 ;
	this.Lightness = 0 ;
}
SmartHSL.prototype = {
	//API 其一 : 接受HSL三个参数
	HSL : function(){
		for ( var i=0 ; i < arguments.length ; i++ ){
			this[ this.map[ i+1 ] ] = arguments[i] ;
		}
		this.setHSL( this.Hue , this.Saturation , this.Lightness ) ;
	},
	//API 其二 : 接受H, S , L其中的任意一个参数 
	H : function(){
		var h = parseInt( arguments[0] ) ;
		if ( isNaN( h ) ){
			return ;
		}
		this.Hue = h ;
		this.setHSL( this.Hue , this.Saturation , this.Lightness ) ;
	},
	S : function(){
		var s = parseInt( arguments[0] ) ;
		if ( isNaN( s ) ){
			return ;
		}
		this.Saturation = s ;
		this.setHSL( this.Hue , this,Saturation ,this.Lightness ) ;
	},
	L : function(){
		var l = parseInt( arguments[0] );
		if ( isNaN( l ) ){
			return ;
		}
		this.Lightness = l ;
		this.setHSL( this.Hue , this.Saturation , this.Lightness ) ;
	},
	//API 其三 : 重置canvas
	reset : function(){
		this.Hue = 0 ;
		this.Saturation = 0 ;
		this.Lightness = 0 ;
		this.setHSL( this.Hue , this.Saturation , this.Lightness ) ;
	},
	hsl : function(){
		return this.HSL && this.HSL.apply( this , arguments ) ;
	} ,
	h : function(){
		return this.H && this.H.apply( this , arguments ) ;
	},
	s : function(){
		return this.S && this.S.apply( this , arguments ) ;
	} ,
	l : function(){
		return this.L && this.L.apply( this , arguments ) ;
	},
	setHSL : function( H, S, L ){ 
		this.imageOperate( this.imageDate , this._imageDate , H ,S ,L ) ;
		this.context.putImageData( this._imageDate , 0 , 0 ) ;
	},
	imageOperate : function(){
		var source = arguments[0]? arguments[0] : this.imageDate ,
			target = arguments[1]? arguments[1] : this._imageDate ,
			self = this ,
			i = 0 ,
			length = source.data.length ,
			soruceDot ,
			targetDot ;
		for ( ; i < length ; i+=4 ){
			soruceDot = {
				red : source.data[ i ] ,
				green : source.data[ i+1 ] ,
				blue : source.data[ i+2 ] ,
				alpha : source.data[ i+3 ] 
			} ;
			targetDot = {
				red : target.data[ i ] ,
				green : target.data[ i+1 ] ,
				blue : target.data[ i+2 ] ,
				alpha : target.data[ i+3 ] 
			} ;
			targetDot = self.operate( soruceDot ,targetDot , arguments[2] , arguments[3] , arguments[4] ) ;
			target.data[ i ] = targetDot.red ;
			target.data[ i+1 ] = targetDot.green ;
			target.data[ i+2 ] = targetDot.blue ;
			target.data[ i+3 ] = targetDot.alpha ;
		}
	},
	operate: function(){
		var sourceDot = arguments[0] ,
			targetDot = arguments[1] ,
			options = Array.prototype.slice.call( arguments , 2) ;

		sourceDot = this.rgb2hsl( sourceDot ) ; //转为hsl模式
		targetDot = this.hslConvert( sourceDot , options ) ; //仍然为hsl模式
		targetDot = this.hsl2rgb( targetDot ) ; //转回rgb

		return targetDot ;
	},
	rgb2hsl : function( rgba ){ 
		var r = rgba.red / 255 ,
			g = rgba.green / 255 ,
			b = rgba.blue / 255 ;
		var max = Math.max(r,g,b) ,
			min = Math.min(r,g,b) ;
			hsl = {} ;
		if ( max === min ){
			hsl.h = 0 ;
		}else if( max === r && g>=b ){
			hsl.h = 60*( (g-b)/(max-min) ) ;
		}else if( max === r && g<b ){
			hsl.h = 60*( (g-b)/(max-min) ) + 360 ;
		}else if( max === g ){
			hsl.h = 60*( (b-r)/(max-min) ) + 120 ;
		}else if( max === b ){
			hsl.h = 60*( (r-g)/(max-min) ) + 240 ;
		}
		hsl.l = (max+min)/2 ;
		if ( hsl.l===0 || max===min ){
			hsl.s = 0 ;
		}else if( 0<hsl.l && hsl.l<=0.5 ){
			hsl.s = (max-min)/(2*hsl.l) ;
 		}else if( hsl.l>0.5 ){
 			hsl.s = (max-min)/(2-2*hsl.l) ;
 		}
 		rgba.alpha && (hsl.a = rgba.alpha)  
		return hsl ;
	},
	hsl2rgb : function( hsl ){
		var h  = hsl.h , //0-360
			s = hsl.s ,
			l = hsl.l ;
		var rgba = {} ;
		if ( s === 0 ){
			rgba.red = rgba.green = rgba.blue = Math.round( l*255 ) ;
		}else{
			var q ,
				p ,
				hK ,
				tR ,
				tG ,
				tB ;
           	if ( l<0.5 ){
           		q = l * ( 1 + s ) ;
           	}else if( l>=0.5 ){
           		q = l + s - ( l * s ) ;
           	}      
           	p = 2*l-q ;
           	hK = h/360 ;
           	tR = hK + 1/3 ;
           	tG = hK ;
           	tB = hK - 1/3 ;
           	var correctRGB = function(t){
           		if( t<0 ){
           			return t + 1.0 ;
           		}
           		if( t>1 ){
           			return t - 1.0 ;
           		}
           		return t ;
           	} ;
           	var createRGB = function(t){
           		if ( t<(1/6) ){
           			return p+((q-p)*6*t) ;
           		}else if( t>=(1/6) && t<(1/2) ){
           			return q ;
           		}else if( t>=(1/2) && t<(2/3) ){
           			return p+((q-p)*6*((2/3)-t)) ;
           		}
           		return p ;
           	} ;
           	rgba.red = tR = Math.round( createRGB( correctRGB( tR ) )*255 ) ;
           	rgba.green = tG = Math.round( createRGB( correctRGB( tG ) )*255 ) ;
           	rgba.blue = tB = Math.round( createRGB( correctRGB( tB ) )*255 ) ;
		}
		hsl.a && ( rgba.alpha = hsl.a ) ;  
		return rgba ;
	},
	hslConvert : function( hslDate , options ){
		var h = hslDate.h ,
			s = hslDate.s ,
			l = hslDate.l ;
		var hOpe ;
		// hOpe = parseInt(options[0])+180>360?360:parseInt(options[0])+180;
		// hOpe = parseInt(options[0])+180<0?0:parseInt(options[0])+180;
		hOpe = parseInt(options[0])+180 ;
		var sOpe ;
		// sOpe = parseInt(options[1])+100>100?100:(parseInt(options[1])+100)/200;
		// sOpe = parseInt(options[1])+100<0?0:(parseInt(options[1])+100)/200; 
		sOpe = (parseInt(options[1])+100)/200 ;
		var lOpe ;
		// lOpe = parseInt(options[2])+100>100?100:(parseInt(options[2])+100)/200;
		// lOpe = parseInt(options[2])+100<0?0:(parseInt(options[2])+100)/200; 
		lOpe = (parseInt(options[2])+100)/200 ;

		function hAdapt(old,ope){
			return old+ope-180 ;
		} 
		function sAdapt(old,ope){
			var newS ; 
			if ( ope === 0.5 ){
				newS = old ;
			}else if ( ope < 0.5 ){
				newS = old*ope/0.5 ;
 			}else if ( ope > 0.5 ){
 				newS = 2*old + 2*ope - (ope*old/0.5) - 1 ;
 			}
			return newS ;
		} 
		function lAdapt(old,ope){
			var newL ; 
			if ( ope === 0.5 ){
				newL = old ;
			}else if ( ope < 0.5 ){
				newL = old*ope/0.5 ;
 			}else if ( ope > 0.5 ){
 				newL = 2*old + 2*ope - (ope*old/0.5) - 1 ;
 			}
			return newL ;
		} 
		var ret = {
			h : hAdapt( h , hOpe ) ,
			s : sAdapt( s , sOpe ) ,
			l : lAdapt( l , lOpe ) 
		} ;
		hslDate.a && ( ret.a = hslDate.a ) ;
		return ret ;
	}, 
} ;

return SmartHSL ;

})(window)