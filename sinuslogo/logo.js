var Pos = function(x,y) {
	this.x = x;
	this.y = y;
}

var Scroller = function(text, charset, color) {
  if (color && typeof color =='object' && color.length==3) {
    this.color = [color[0], color[1], color[2], 255];
  } else {
    this.color = [0,0,0,255];
  }
  
  this.charset = charset;
	this.text = text.toLowerCase(); // default charset contains only lowercase chars
  
	this.canvasId = null;
	this.canvas = null;
	this.ctx = null;
	this.width = null;
	this.height = null;
	this.frame = 0;
	this.dir = 1;
	this.characterHeightPadding = 2;
	this.characterWidthPadding = 2;
	
	this.init = function(canvasSelector) {
		this.canvasSelector = canvasSelector;
		this.canvas = $(canvasSelector)[0];
		if (this.canvas.getContext) {
			this.ctx = this.canvas.getContext('2d');
			this.width = parseInt(this.canvas.width);
			this.height = parseInt(this.canvas.height);
			this.go();
		} else {
			alert('No canvas found, selector: ' + canvasSelector);
		}
	};

	this.go = function() {
		this.animate();
	};

	this.animate = function() {
		var _ = this;
		
		setTimeout(function() {
			_.updateBuffer();
		}, 5);	
	};
		
	this.updateBuffer = function() {
		var
		  buffer = this.createBuffer(),
	    r = (this.height / 2) - (this.charset.height + this.characterHeightPadding);
		
		for (var x=0; x<this.text.length; x++) {
			var
			  o = this.frame,
			  xpad = x * (this.charset.width + this.characterWidthPadding),
			  rad = ((xpad + o) * Math.PI / 180),
			  y = Math.sin(rad) * r,
			  pos = new Pos(xpad, Math.round(y + r));

      this.drawChar(this.text[x], pos, [0, 0, 0, 255], buffer);
      
		}
		
		this.drawBuffer(buffer);
		this.frame++;
		
		this.animate();
	}
	
	this.createBuffer = function() {
		return this.ctx.createImageData(this.width, this.height);
	}
	
	this.drawBuffer = function(buffer) {
		this.ctx.putImageData(buffer, 0, 0);
	},
	
	this.setPixel = function(buffer, pos, color) { 
		index = (pos.x + pos.y * buffer.width) * 4; // rgba
		
		buffer.data[index]   = color[0]; // r
		buffer.data[index+1] = color[1]; // g
		buffer.data[index+2] = color[2]; // b
		buffer.data[index+3] = color[3]; // alpha
	}		
	
	this.drawChar = function(letter, pos, color, buffer) {
		var charData = this.charset.characters[letter];
		if (!charData) return;
		
		for (var x=0; x<this.charset.width; x++) { // column
			for (var y=0; y<this.charset.height; y++) { // row
				var offset = x+(this.charset.width*y);
				var colorbit = charData[offset];
				
				if (colorbit) {
					var canvasPos = new Pos(pos.x + x, pos.y + y );
					this.setPixel(buffer, canvasPos, this.color);
				}
			}
		}
	};
	
};

