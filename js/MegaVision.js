var color = "#000000";
var lastSelect = "#pencil";
var r, g, b, h, s, v;
var is_painting = false
var draw_area_x = 1200;
var draw_area_y = 700;
var thumb_x = 216;
var thumb_y = 126;
var lastx = 0;
var lasty = 0;
var canvas = null
var width_min = 1
var width_max = 9
r = g = b = h = s = 0.0;
v = 0.0;
min = function(x, y) {
	if (x < y) return x;
	else return y;
}
max = function(x, y) {
	if (x > y) return x;
	else return y;
}
rgb2hex = function() {
	hex = ((r << 16) | (g << 8) | b).toString(16);
	if (hex.length < 6) {
		var tem = hex.length
		for (var i = 1; i <= 6 - tem; i++) {
			hex = '0' + hex
		}
	}
	hex = '#' + hex
	return hex;
}
hsv2rgb = function(h, s, v) {
	if (s == 0) {
		r = v * 255;
		g = v * 255;
		b = v * 255;
	} else {
		var tempH = h * 6;
		if (tempH == 6) {
			tempH = 0;
		}
		tempI = Math.floor(tempH);
		temp_1 = v * (1 - s);
		temp_2 = v * (1 - s * (tempH - tempI));
		temp_3 = v * (1 - s * (1 - (tempH - tempI)));
		switch (tempI) {
			case 0:
				r = v;
				g = temp_3;
				b = temp_1;
				break;
			case 1:
				r = temp_2;
				g = v;
				b = temp_1;
				break;
			case 2:
				r = temp_1;
				g = v;
				b = temp_3;
				break;
			case 3:
				r = temp_1;
				g = temp_2;
				b = v;
				break;
			case 4:
				r = temp_3;
				g = temp_1;
				b = v;
				break;
			default:
				r = v;
				g = temp_1;
				b = temp_2;
				break;
		}
		r = r * 255;
		b = b * 255;
		g = g * 255;
	}
	r = Math.ceil(r),
	g = Math.ceil(g),
	b = Math.ceil(b)
}
rgb2hsv = function(r, g ,b) {
 var computedH = 0;
 var computedS = 0;
 var computedV = 0;

 r=r/255; g=g/255; b=b/255;
 var minRGB = Math.min(r,Math.min(g,b));
 var maxRGB = Math.max(r,Math.max(g,b));

 if (minRGB==maxRGB) {
  computedV = minRGB;
  h = 0;
  s = 0;
  v = computedV;
  return;
 }
 
 var d = (r==minRGB) ? g-b : ((b==minRGB) ? r-g : b-r);
 var hh = (r==minRGB) ? 3 : ((b==minRGB) ? 1 : 5);
 computedH = 60*(hh - d/(maxRGB - minRGB));
 computedS = (maxRGB - minRGB)/maxRGB;
 computedV = maxRGB;
 h = computedH/360.0;
 s = computedS;
 v = computedV;
}
showColor = function(colorName) {
	//console.log(colorName)
	$(".colorShow").css("background-color", colorName);
};
setDrawColor = function(colorStr) {
	canvas.strokeStyle = colorStr
	canvas.fillStyle = colorStr
}
setColor = function(_h, _s, _v) {
	h = _h
	s = _s
	v = _v
	hsv2rgb(h, 1.0, 1.0);
	$(".SatValBg").css("background-color", rgb2hex());
	hsv2rgb(h, s, v);
	$("#strH").val(h);
	$("#strS").val(s);
	$("#strV").val(v);
	$("#strR").val(r);
	$("#strG").val(g);
	$("#strB").val(b);
	showColor(rgb2hex())
	setDrawColor(rgb2hex())
}

HSVslide = function(e, o) {
	if (e.button != 0) {
		return false;
	}
	document.onselectstart = function() {
		return false;
	};
	cursor = (9 + (e.pageY - $(".basicHue").offset().top));
	cursor = min(264, cursor)
	cursor = max(9, cursor)
	$("." + o).css("top", cursor + "px")
	setColor((255.0 - cursor + 9.0) / 255.0, s, v);
	document.onmousemove = function(e) {
		cursor = (9 + (e.pageY - $(".basicHue").offset().top));
		cursor = min(264, cursor)
		cursor = max(9, cursor)
		$("." + o).css("top", cursor + "px")
		setColor((255.0 - cursor + 9.0) / 255.0, s, v);
	};
	document.onmouseup = function() {
		document.onmousemove = null;
		document.onmouseup = null;
	};
};

setPointer = function(e, o) {
	if (e.button != 0) {
		return false;
	}
	document.onselectstart = function() {
		return false;
	};
	cursorX = e.pageX - $("#SatVal").offset().left;
	cursorY = e.pageY - $("#SatVal").offset().top;
	cursorX = min(255, cursorX)
	cursorX = max(0, cursorX)
	cursorY = min(255, cursorY)
	cursorY = max(0, cursorY)
		//alert(cursorY+" "+cursorX)
	$("." + o).css("left", cursorX - 8 + "px")
	$("." + o).css("top", cursorY - 8 + "px")
	setColor(h, (cursorX) / 255.0, (255 - cursorY) / 255.0);
	document.onmousemove = function(e) {
		cursorX = e.pageX - $("#SatVal").offset().left;
		cursorY = e.pageY - $("#SatVal").offset().top;
		cursorX = min(255, cursorX)
		cursorX = max(0, cursorX)
		cursorY = min(255, cursorY)
		cursorY = max(0, cursorY)
		$("." + o).css("left", cursorX - 8 + "px")
		$("." + o).css("top", cursorY - 8 + "px")
		setColor(h, (cursorX) / 255.0, (255 - cursorY) / 255.0);
	};
	document.onmouseup = function() {
		document.onmousemove = null;
		document.onmouseup = null;
	};
};

//back from rgb to slide and pointer
function convertBack(){
	$(".Slide").css("top", 255.0 + 9.0 - h * 255.0 + "px")
	$(".pointer").css("left", s * 255.0 - 8 + "px")
	$(".pointer").css("top", 255.0 - v * 255.0 - 8 + "px")
}

selectButton = function(buttonName) {
	$(lastSelect).removeClass("brushButtonSelected");
	$("#" + buttonName).addClass("brushButtonSelected");
	lastSelect = "#" + buttonName
	$(".canvas-container").css("cursor", "url('/static/MegaVisio/img/" + buttonName + "_cursor.svg'), auto");
};

cursor2width = function(cursor){
	if(width_min == width_max) w = 0;
	else
	{
		w = parseInt( cursor / (172.0 / (width_max - width_min + 1)) ) + 1
	}
	return w;
}
widthSlide = function(e, o){
	if (e.button != 0) {
		return false;
	}
	document.onselectstart = function() {
		return false;
	};
	cursor = (e.pageX - $(".width-slider").offset().left);
	
	cursor = min(173 - 19, cursor)
	cursor = max(0, cursor)
	w = cursor2width(cursor);
	setWidth(w);
	document.onmousemove = function(e) {
		cursor = (e.pageX - $(".width-slider").offset().left);
		//alert(cursor)
		cursor = min(173 - 19, cursor)
		cursor = max(0, cursor)
		w = cursor2width(cursor)
		setWidth(w);
	};
	document.onmouseup = function() {
		document.onmousemove = null;
		document.onmouseup = null;
	};
}
setWidthSlider = function(w){
	$(".width-slider-handle").css("left", (w-1) * (172.0 / (width_max - width_min)) -20 + "px")
};

setWidth = function(width) {
	setWidthSlider(width)
	$("#width-val").val(width)
	canvas.lineWidth = width;
};

//drawing part
/*
speed2width = function(v,w){  
        result=w;  
        if(v<1){  
            result=(result*(Math.cos(v)+1));  
        }else{
            result=(result/v);  
        }  
        return result;  
}  
*/

draw = function(x, y, init) {
	//alert(x + ',' +y)
	if (x < draw_area_x && x >= 0) // Left of the drawing area
	{
		if (y > 0 && y < draw_area_y) {
			if (init) {
				canvas.beginPath();
				canvas.moveTo(x, y);
				lastx = x;
				lasty = y;
			}
			//console.log(lastSelect)
			if(lastSelect == "#pen")
			{
				canvas.beginPath();
				canvas.moveTo(lastx, lasty);

				tem = canvas.lineWidth;
				dist = Math.sqrt((x - lastx)*(x - lastx) + (y - lasty)*(y - lasty))

				if(dist <= Math.E)
				{
					width_now = tem * Math.E / (dist+0.5)
				}
				else
				{
					width_now = tem * 2 / Math.log(dist)
				}
				//console.log(width_now)
				canvas.lineWidth = width_now;

				canvas.lineTo(x, y);
				canvas.stroke();
				canvas.lineWidth = tem;
			}
			else if(lastSelect == '#eraser')
			{
				tem = canvas.strokeStyle
				canvas.strokeStyle = "#ffffff";
				canvas.beginPath();
				canvas.moveTo(lastx, lasty);
				canvas.lineTo(x, y);
				canvas.stroke();
				canvas.strokeStyle = tem
			}
			else if(lastSelect == '#square')
			{
				tem = canvas.lineWidth * 2.0
				beginx = parseInt(x / tem) * tem;
				beginy = parseInt(y / tem) * tem;
				canvas.fillRect(beginx, beginy, tem, tem);
			}
			else if(lastSelect == '#sampler')
			{
				imageData=canvas.getImageData(x,y,1,1);
				data=imageData.data;
				r = data[0];
				g = data[1];
				b = data[2];
				rgb2hsv(r,g,b)
				console.log(r+','+g+','+b+','+h+','+s+','+v)
				setColor(h,s,v)
				convertBack()
			}
			else
			{
				canvas.beginPath();
				canvas.moveTo(lastx, lasty);
				canvas.lineTo(x, y);
				canvas.stroke();
			}
			lastx = x;
			lasty = y;
		}
	}
}

function clearThumb(canvas_thumb)
{
	canvas_thumb.clearRect(0, 0, canvas_dom.width, canvas_dom.height);
}

function showThumb(DataURL)
{
	var img = new Image;
	img.src = DataURL;
	img.onload = function(){
		canvas_thumb_dom = document.getElementById("canvas_thumb");
		canvas_thumb = canvas_thumb_dom.getContext('2d');
		clearThumb(canvas_thumb)
		canvas_thumb.drawImage(img,0,0, canvas_thumb_dom.width, canvas_thumb_dom.height)
	}
}


function downloadURI(url, name) {
	var link = document.createElement("a");
	link.download = name;
	link.href = url;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	delete link;
}

/*
$('.canvas-container').mouseleave(function(e){
  is_painting = false;
});
*/

$(document).ready(function() {
	document.getElementById("canvas_0").width = draw_area_x;
	document.getElementById("canvas_0").height = draw_area_y;
	document.getElementById("canvas_thumb").width = thumb_x;
	document.getElementById("canvas_thumb").height = thumb_y;
	color = "#ff0000"
	lastSelect = "#pencil"
	r = 51;
	g = 157;
	b = 209;
	h = s = v = 0.0;
	is_painting = false
	canvas_dom = document.getElementById("canvas_0");
	canvas = canvas_dom.getContext('2d');
	canvas.lineCap = "round";
	canvas.lineJoin = "round";
	lastx = 0;
	lasty = 0;
	width_min = 1
	width_max = 9
	setWidth(5);
	rgb2hsv(r,g,b)
	setColor(h,s,v);
	convertBack();
	$(".colorShow").click(function(e) {
		$(".HSV").show(100);
		e.stopPropagation();
	});
	$(".colorShow").mousedown(function(e) {
		e.stopPropagation();
	});
	$(".HSV").click(function(e) {
		e.stopPropagation();
	});
	$(".HSV").mousedown(function(e) {
		e.stopPropagation();
	});

	$(document).mousedown(function(e) {
		$(".HSV").hide();
	});

	$(document).mouseup(function(e) {
		if(is_painting == true)
		{
			is_painting = false
			showThumb(canvas_dom.toDataURL())
		}
		is_painting = false
	});

	$(".canvas-container").css("cursor", "url('/static/MegaVision/img/" + lastSelect.substring(1) + "_cursor.svg'), auto");

	//canvas binding events
	$(".canvas-container").mousedown(function(e) {
		if (e.which != 1) return;
		var mouseX = e.pageX - $(this).offset().left;
		var mouseY = e.pageY - $(this).offset().top;
		is_painting = true;

		draw(mouseX, mouseY, init = true);
	});

	$(".canvas-container").mousemove(function(e) {
		if (e.which != 1) return;
		if (is_painting) {
			var mouseX = e.pageX - $(this).offset().left;
			var mouseY = e.pageY - $(this).offset().top;
			draw(mouseX, mouseY, init = false);
		}
	});

	$(".canvas-container").mouseenter(function(e) {
		if (e.which != 1) return;
		var mouseX = e.pageX - $(this).offset().left;
		var mouseY = e.pageY - $(this).offset().top;
		if (is_painting) {
			draw(mouseX, mouseY, init = true);
		}
	});

	Clear = function()
	{
		tem = canvas.fillStyle;
		canvas.fillStyle="#ffffff";
		canvas.fillRect(0, 0, canvas_dom.width, canvas_dom.height);
		canvas.fillStyle=tem;
		canvas_thumb_dom = document.getElementById("canvas_thumb");
		canvas_thumb = canvas_thumb_dom.getContext('2d');
		clearThumb(canvas_thumb)
	}
	Clear()
	function img2canvas(img)
	{
		Clear()
		canvas.drawImage(img,0,0, min(canvas_dom.width,img.width), min(canvas_dom.height,img.height) )
		showThumb(canvas_dom.toDataURL());
	}

	function url2img(url){
	    var img = new Image;
	    img.src = url;
	    img.onload = function(){
	            img2canvas(img);
	    }
	}

	function readFile(){
	    var file = this.files[0];
	    var reader = new FileReader();
	    reader.readAsDataURL(file);
	    reader.onload = function(e){
	        url2img(this.result);
	    }
	}

	Import = function(id)
	{
		var inputObj = document.createElement('input');
	    inputObj.addEventListener('change',readFile,false);
	    inputObj.type = 'file';
	    inputObj.accept = 'image/*';
	    inputObj.click();
	}
	Export = function(id)
	{
		var strDataURI = canvas_dom.toDataURL();
		
		//strDataURI = "data:image/png;base64,H4sIAGzSNlgCA02QYU/bMBCGv/tXeEjt7MRpEydUI50VtRKiEwgmbRISjouObGVu5oymKS2U8tu5 pkzbyZLfu/PdPb7iF9SeA1sxJ0BYUfFiH4Hhtv7Z5GRVV9R1JaUZpK4bZ06pCJ1DgU+kJwVtrY2gy1H7 UrBQs5zYqvE8/i8tAB2jQ9PZ+4QlHLUfYl63Dz6h4oZ3vEM6klxEPHWUKnWcMave+zg/EUBaWMHo//aw avb4DDSxRqlkkEVhSilo0AGlkQmw5yAAbQlOiaWZxhGfYiJErm6XVZ5CcPAVVn9WJwn3ZIDfFR4gQizF +55y0ooY8ZABkfHw9AOzGsw03OREhvzvipKWC1fLrF/5iCEN4Z32RvzUIh1l22UDjS3onp2Su9VMG3U0 mp5qvZ58qVdXr/Pl6KZcLJ5PRzkBvZvrSXmuL2d3sB2f6dGPyf24LDbX38tdTi7O9Mv667ebe9d7gvVj kc375Wxbv67//L7t5GTRi1zz8pHZRzl4eN4sg6MhzvNdPxoMd5wMd+QNBkbPphICAAA="
		//alert(strDataURI)
		downloadURI(strDataURI,"your_picture.png")
	}
	//alert('本网页须在适合缩放比例下使用，过大或过小均会造成使用的不便，请您调整显示器缩放比例，直至窗口包含绘图画布和缩略图，参考缩放比例: "100%-110%"')
	alert('please adjust the size of the explore until the paint board and thumbnail are both included in the window.')
	/*
		$(".width-slider").slider({
			range: 'min',
			value: 5,
			min: 1,
			max: 10,
			slide: function(e,o){
				setWidth(o.value)
				$("width-val").val(o.value);
			}
		})
	*/
});
