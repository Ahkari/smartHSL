# smartHSL
canvas库, 根据HSL颜色空间快速调整图片


### 什么是HSL色彩模式?

  Hue意为色相(H) 取值范围(-180~+180) 

  Saturation意为饱和度(S), 取值范围(-100~+100) 

  Lightness意为明度(L), 取值范围(-100~+100)

### 快速使用

  `var smartCanvas = new SmartHSL( canvas ) ; //实例化` 

  `smartCanvas.hsl(h,s,l) ; //配置hsl`

  `smartCanavs.h(h) ; //配置色相`

  `smartCanavs.s(s) ; //配置饱和度`

  `smartCanavs.l(l) ; //配置明度`

  `smartCanvas.reset() ; //重置`
