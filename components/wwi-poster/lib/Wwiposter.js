const QR = require('./qrcode.js');
export default class Wwiposter {
  constructor(ctx, width,height) {
    this.ctx = ctx;
	this.style = {
      width: width,
      height: height,
    };
  }
	toPx(minus) {
		const res = uni.getSystemInfoSync();
		this.width = res.screenWidth;
		if (minus > 0) {
			return parseFloat(minus * this.width / 750);
		} else {
			return 0;
		}
	}

	background(obj) {
		this.ctx.save();
		const {
			width,
			height,
		} = this.style;
		const bg = obj.background;
		this.ctx.translate(width / 2, height / 2);

		this.doClip(obj.borderRadius, width, height);
		if (!bg) {
			// 如果未设置背景，则默认使用白色
			this.ctx.setFillStyle('#fff');
			this.ctx.fillRect(-(width / 2), -(height / 2), width, height);
		} else if (bg.startsWith('#') || bg.startsWith('rgba') || bg.toLowerCase() === 'transparent') {
			// 背景填充颜色
			this.ctx.setFillStyle(bg);
			this.ctx.fillRect(-(width / 2), -(height / 2), width, height);
		} else if (GD.api.isGradient(bg)) {
			GD.api.doGradient(bg, width, height, this.ctx);
		} else {
			// 背景填充图片
			this.ctx.drawImage(bg, -(width / 2), -(height / 2), width, height);
		}
		this.ctx.restore();
	}

	drawAbsImage(obj) {
		if (!obj.url) {
			return;
		}
		this.ctx.save();
		const {
			width,
			height,
		} = this.preProcess(obj);
		// 获得缩放到图片大小级别的裁减框
		let rWidth = obj.sWidth;
		let rHeight = obj.sHeight;
		let startX = 0;
		let startY = 0;
		// 绘画区域比例
		const cp = width / height;
		// 原图比例
		const op = obj.sWidth / obj.sHeight;
		if (cp >= op) {
			rHeight = rWidth / cp;
			startY = Math.round((obj.sHeight - rHeight) / 2);
		} else {
			rWidth = rHeight * cp;
			startX = Math.round((obj.sWidth - rWidth) / 2);
		}
		if (obj.mode === 'scaleToFill') {
			this.ctx.drawImage(obj.url, -(width / 2), -(height / 2), width, height);
		} else {
			this.ctx.drawImage(obj.url, startX, startY, rWidth, rHeight, -(width / 2), -(height / 2), width, height);
		}
		this.ctx.restore();
		this.doBorder(obj, width, height);
	}

	/**
	 * 参数      类型          说明
	 *  left        Number     绘制文本的左坐标位置
	 *  right       Number     绘制文本的右坐标位置
	 *  top         Number     绘制文本的上坐标位置
	 * bottom       Number     绘制文本的下坐标位置
	 * color        Color      字体的颜色
	 * fontSize     Number     字体的字号
	 * align     String     文字的对齐，可选值 'left'、'center'、'right'
	 * baseline  String     设置文字的水平对齐，可选值 'top'、'bottom'、'middle'、'normal'
	 * text      String     在画布上绘制被填充的文本。
	 * bold      Boolean    是否加粗
	 * type      String     text文字
	 */
	  fillAbsText(obj) {
	  if (!obj.text) {
	    return;
	  }
	  this.ctx.save();
	  const {
	    width,
	    height,
	    extra,
	  } = this.preProcess(obj);
	  this.ctx.setFillStyle(obj.color || 'black');
	  const { lines, lineHeight } = extra;
	  const preLineLength = Math.round(obj.text.length / lines);
	  let start = 0;
	  let alreadyCount = 0;
	  for (let i = 0; i < lines; ++i) {
	    alreadyCount = preLineLength;
	    let text = obj.text.substr(start, alreadyCount);
	    let measuredWith = this.ctx.measureText(text).width;
	    // 如果测量大小小于width一个字符的大小，则进行补齐，如果测量大小超出 width，则进行减除
	    // 如果已经到文本末尾，也不要进行该循环
	    while ((start + alreadyCount <= obj.text.length) && (width - measuredWith > obj.fontSize || measuredWith > width)) {
	      if (measuredWith < width) {
	        text = obj.text.substr(start, ++alreadyCount);
	      } else {
	        if (text.length <= 1) {
	          // 如果只有一个字符时，直接跳出循环
	          break;
	        }
	        text = obj.text.substr(start, --alreadyCount);
	      }
	      measuredWith = this.ctx.measureText(text).width;
	    }
	    start += text.length;
	    // 如果是最后一行了，发现还有未绘制完的内容，则加...
	    if (i === lines - 1 && start < obj.text.length) {
	      while (this.ctx.measureText(`${text}...`).width > width) {
	        if (text.length <= 1) {
	          // 如果只有一个字符时，直接跳出循环
	          break;
	        }
	        text = text.substring(0, text.length - 1);
	      }
	      text += '...';
	      measuredWith = this.ctx.measureText(text).width;
	    }
	    this.ctx.setTextAlign(obj.align ? obj.align : 'left');
	    let x;
	    switch (obj.align) {
	      case 'center':
	        x = 0;
	        break;
	      case 'right':
	        x = (width / 2);
	        break;
	      default:
	        x = -(width / 2);
	        break;
	    }
	    const y = -(height / 2) + (i === 0 ? obj.fontSize : (obj.fontSize + i * lineHeight));
	    if (obj.textStyle === 'stroke') {
	      this.ctx.strokeText(text, x, y, measuredWith);
		  if (obj.bold) {
		  	this.ctx.fillText(text, x, y + 0.5);
		  	this.ctx.fillText(text, x + 0.5, y);
		  }
	    } else {
			if (obj.bold) {
				this.ctx.fillText(text, x, y + 0.5);
				this.ctx.fillText(text, x + 0.5, y);
			}else{
				this.ctx.fillText(text, x, y, measuredWith);
			}
	      
	    }

	    const fontSize = obj.fontSize;
	    if (obj.textDecoration) {
	      this.ctx.beginPath();
	      if (/\bunderline\b/.test(obj.textDecoration)) {
	        this.ctx.moveTo(x, y);
	        this.ctx.lineTo(x + measuredWith, y);
	      }
	      if (/\boverline\b/.test(obj.textDecoration)) {
	        this.ctx.moveTo(x, y - fontSize);
	        this.ctx.lineTo(x + measuredWith, y - fontSize);
	      }
	      if (/\bline-through\b/.test(obj.textDecoration)) {
	        this.ctx.moveTo(x, y - fontSize / 3);
	        this.ctx.lineTo(x + measuredWith, y - fontSize / 3);
	      }
	      this.ctx.closePath();
	      this.ctx.setStrokeStyle(obj.color);
	      this.ctx.stroke();
	    }
	  }
	
	  this.ctx.restore();
	  this.doBorder(obj, width, height);
	}
	/**
	 * 根据 borderRadius 进行裁减
	 */
	doClip(borderRadius, width, height) {
		if (borderRadius && width && height) {
			const r = Math.min(borderRadius, width / 2, height / 2);
			// 防止在某些机型上周边有黑框现象，此处如果直接设置 setFillStyle 为透明，在 Android 机型上会导致被裁减的图片也变为透明， iOS 和 IDE 上不会
			// setGlobalAlpha 在 1.9.90 起支持，低版本下无效，但把 setFillStyle 设为了 white，相对默认的 black 要好点
			this.ctx.setGlobalAlpha(0);
			this.ctx.setFillStyle('white');
			this.ctx.beginPath();
			this.ctx.arc(-width / 2 + r, -height / 2 + r, r, 1 * Math.PI, 1.5 * Math.PI);
			this.ctx.lineTo(width / 2 - r, -height / 2);
			this.ctx.arc(width / 2 - r, -height / 2 + r, r, 1.5 * Math.PI, 2 * Math.PI);
			this.ctx.lineTo(width / 2, height / 2 - r);
			this.ctx.arc(width / 2 - r, height / 2 - r, r, 0, 0.5 * Math.PI);
			this.ctx.lineTo(-width / 2 + r, height / 2);
			this.ctx.arc(-width / 2 + r, height / 2 - r, r, 0.5 * Math.PI, 1 * Math.PI);
			this.ctx.closePath();
			this.ctx.fill();
			// 在 ios 的 6.6.6 版本上 clip 有 bug，禁掉此类型上的 clip，也就意味着，在此版本微信的 ios 设备下无法使用 border 属性
			if (!(uni.getSystemInfoSync() &&
					uni.getSystemInfoSync().version <= '6.6.6' &&
					uni.getSystemInfoSync().platform === 'ios')) {
				this.ctx.clip();
			}
			this.ctx.setGlobalAlpha(1);
		}
	}
	drawQRCode(obj) {
		this.ctx.save();
		const {
			width,
			height,
		} = this.preProcess(obj);
		QR.api.draw(obj.content, this.ctx, -width / 2, -height / 2, width, height, obj.background, obj.color);
		this.ctx.restore();
		this.doBorder(obj, width, height);
	}
	/**
	 * 画边框borderRadius,borderWidth,borderColor
	 */
	doBorder(obj) {
		if (!obj.borderWidth) {
			return;
		}
		this.ctx.save();
		this.preProcess(obj, true);
		let r;
		if (obj.borderRadius) {
			r = Math.min(obj.borderRadius, obj.width / 2, obj.height / 2);
		} else {
			r = 0;
		}
		const width = obj.width;
		const height = obj.height;
		const lineWidth = obj.borderWidth;
		this.ctx.setLineWidth(lineWidth);
		this.ctx.setStrokeStyle(obj.borderColor || 'black');
		this.ctx.beginPath();
		this.ctx.arc(-width / 2 + r, -height / 2 + r, r + lineWidth / 2, 1 * Math.PI, 1.5 * Math.PI);
		this.ctx.lineTo(width / 2 - r, -height / 2 - lineWidth / 2);
		this.ctx.arc(width / 2 - r, -height / 2 + r, r + lineWidth / 2, 1.5 * Math.PI, 2 * Math.PI);
		this.ctx.lineTo(width / 2 + lineWidth / 2, height / 2 - r);
		this.ctx.arc(width / 2 - r, height / 2 - r, r + lineWidth / 2, 0, 0.5 * Math.PI);
		this.ctx.lineTo(-width / 2 + r, height / 2 + lineWidth / 2);
		this.ctx.arc(-width / 2 + r, height / 2 - r, r + lineWidth / 2, 0.5 * Math.PI, 1 * Math.PI);
		this.ctx.closePath();
		this.ctx.stroke();
		this.ctx.restore();
	}
	preProcess(obj, notClip) {
		let width;
		let height;
		let extra;
		switch (obj.type) {
			case 'text':
				{
					const fontWeight = obj.fontWeight === 'bold' ? 'bold' : 'normal';
					obj.fontSize = obj.fontSize ? obj.fontSize : '20px';
					this.ctx.font = `normal ${fontWeight} ${obj.fontSize}px ${obj.fontFamily ? obj.fontFamily : 'sans-serif'}`;
				    //this.ctx.setFontSize(obj.fontSize);
					const textLength = this.ctx.measureText(obj.text).width;
					width = obj.width ? obj.width : textLength;
					// 计算行数
					const calLines = Math.ceil(textLength / width);
					const lines = obj.maxLines < calLines ? obj.maxLines : calLines;
					const lineHeight = obj.lineHeight ? obj.lineHeight : obj.fontSize;
					height = lineHeight * lines;
					extra = {
						lines: lines,
						lineHeight: lineHeight
					};
					break;
				}
			case 'image':
				{
					// image 如果未设置长宽，则使用图片本身的长宽
					const ratio = uni.getSystemInfoSync().pixelRatio ? uni.getSystemInfoSync().pixelRatio : 2;
					width = obj.width ? obj.width : Math.round(obj.sWidth / ratio);
					height = obj.height ? obj.height : Math.round(obj.sHeight / ratio);
					break;
				}
			default:
				{
					if (!(obj.width && obj.height)) {
						console.error('You should set width and height');
						return;
					}
					width = obj.width;
					height = obj.height;
				}
		}
		const x = obj.right ? this.style.width - obj.right : (obj.left ? obj.left : 0);
		const y = obj.bottom ? this.style.height - height - obj.bottom : (obj.top ? obj.top : 0);

		const angle = obj.rotate ? this.getAngle(obj.rotate) : 0;
		// 当设置了 right 时，默认 align 用 right，反之用 left
		const align = obj.align ? obj.align : (obj.right ? 'right' : 'left');
		switch (align) {
			case 'center':
				this.ctx.translate(x, y + height / 2);
				break;
			case 'right':
				this.ctx.translate(x - width / 2, y + height / 2);
				break;
			default:
				this.ctx.translate(x + width / 2, y + height / 2);
				break;
		}
		this.ctx.rotate(angle);
		if (!notClip && obj.borderRadius) {
			this.doClip(obj.borderRadius, width, height);
		}

		return {
			width: width,
			height: height,
			x: x,
			y: y,
			extra: extra,
		};
	}
	getAngle(angle) {
		return Number(angle) * Math.PI / 180;
	}

}
