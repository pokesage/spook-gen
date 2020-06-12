~ function() {
	
	'use strict';

		var spans = [],
				screen = document.getElementById("screen"),
				text = "";

		document.currentScript.text.split(/[\s,.=><\&\-!'/\]\+;()\\["]+/, 169).forEach(function(w) {
				if (w.length > 1) text += w + "ss ";
		});
		var CObj = function(elem) {
				this.elem = elem;
				this.x = elem.offsetLeft;
				this.y = elem.offsetTop;
				this.zooming = false;
				this.scale = 1;
		}

		CObj.prototype.init = function() {
				this.elem.obj = this;
				this.elem.className = 'word';
				this.elem.style.left = this.x + "px";
				this.elem.style.top = this.y + "px";
				this.glow = document.createElement("span");
				this.glow.innerHTML = this.elem.innerHTML;
				this.glow.className = "wordZoom";
				screen.appendChild(this.glow);
				this.glow.style.left = this.x + "px";
				this.glow.style.top = this.y + "px";
		}

		CObj.prototype.start = function() {
				if (!this.zooming) {
						this.elem.className = "word over";
						this.zooming = true;
						this.glow.style.visibility = "visible";
				}
		}

		CObj.prototype.zoom = function() {
				if (this.zooming) {
						this.scale *= 1.05;
						if (this.scale < 20) {
								var c = 512 - this.scale * 20;
								this.glow.style.transform = this.glow.style.webkitTransform = "scale(" + this.scale + ")";
								this.glow.style.color = "rgb(" + Math.round(c * .5) + "," + Math.round(c * .5) + "," + Math.round(c) + ")";
						} else {
								this.zooming = false;
								this.scale = 1;
								this.glow.style.transform = this.glow.style.webkitTransform = "scale(1)";
								this.glow.style.visibility = "hidden";
								this.elem.className = "word";
						}
				}
		}

		text += " ... ";
		var comp = "",
				word = "",
				tag = false;

		for (var i = 0; i < text.length; i++) {
				var c = text.charAt(i);
				if (c == "<") {
						var j = text.indexOf(">", i);
						word += text.substring(i, j + 1);
						i = j;
						tag = true;
				} else {
						if (c == " ") {
								if (tag) {
										comp += word + "&nbsp; ";
										tag = false;
								} else {
										comp += "<span>" + word + "</span>&nbsp; ";
								}
								word = "";
						} else word += c;
				}
		}
		screen.innerHTML = comp;

		var n = screen.getElementsByTagName("*");
		for (var i = 0; i < n.length; i++) {
				var word = n[i];
				spans[i] = new CObj(word);
		}

		for (var i = 0; i < spans.length; i++) {
				spans[i].init();
		}

		screen.onmouseover = function(e) {
				e.preventDefault();
				if (e.target.obj) e.target.obj.start();
		};

		var run = function() {
				requestAnimationFrame(run);
				for (var i = 0; i < spans.length; i++) {
						spans[i].zoom();
				}
		};

		run();

}();