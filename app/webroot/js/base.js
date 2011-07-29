
var M={
	assets:{},
	options:{},
	mainIntId:0,
	mainBusy:false,
	controlsVisible:false,
	currentAlbum:0,
	lastInput:0,
	gallery:true,
	controlHideInt:0,
	covered:true,
	playing:false,
	playIntId:0,
	flipped:false,
	onStage:[],
	currentVideo:false,
	videoPlaying:false,
	videoSeeking:false,
	coverProgress:0,
	loadN:4,
	dead:function(e){
		e.preventDefault();
	},
	devices:{
		'iPad':{
			apple:true,
			typeClass:'large',
			nativeVideo:false,
			thumbSize:73,
			albumSize:[203,91]
		},
		'iPhone':{
			apple:true,
			typeClass:'small',
			nativeVideo:true,
			four:false,
			thumbSize:56,
			albumSize:[154,70]
		},
		'Android':{
			apple:false,
			typeClass:'small',
			nativeVideo:true,
			thumbSize:56,
			albumSize:[154,70]
		}
	},
	spinner:function(elem,clear){
		clear=clear||false;
		var outer=document.createElement('div');
		var inner=document.createElement('div');
		if(clear){
			outer.className='spinnerTransparent';
		}else{
			outer.className='spinner';
		}

		inner.className='spinnerWrap';
		for(i=0;i<12;i++){
			var _b=document.createElement('div');
			_b.style.webkitTransform='rotate('+(i*30)+'deg) translate(0, -18px)';
			var o=i/12;
			o=Math.max(o,0.15);
			_b.style.opacity=o;
			inner.appendChild(_b);
		}

		outer.appendChild(inner);
		elem.appendChild(outer);
		return outer;
	},
	e:function(element,style,klass){
		if(typeof element=='string'){
			element=document.createElement(element);
		}

		for(var i in style){
			element.style[i]=style[i];
		}

		if(klass){
			element.className=klass;
		}

		return element;
	},
	setScreen:function(){
		this.scroll();
		var screenDims=[window.innerWidth,window.innerHeight];
		if(this.portrait&&!this.device.portrait){
			this.device.portrait=screenDims;
		}else if(!this.portrait&&!this.device.landscape){
			this.device.landscape=screenDims;
		}

		var dims=this.device[this.portrait?'portrait':'landscape'];
		this.options.width=dims[0];
		this.options.height=dims[1];
		var halfW=this.options.width/2;
		var halfH=this.options.height/2;
		this.videoBttnTarget={
			min:{
				x:halfW-42,
				y:halfH-42
			},
			max:{
				x:halfW+42,
				y:halfH+42
			}
		};

	},
	monitorControls:function(){
		if(this.controlsVisible&&(+new Date-this.lastInput)>5000){
			this.toggleControls();
		}

	},
	setControlsOffScreen:function(){
		this.e(this.nextBttn,{
			webkitTransition:'',
			webkitTransform:'translate3d(2000px,0,0)'
		});
		this.e(this.thumbDrawer.container,{
			webkitTransition:'',
			webkitTransform:'translate3d(0,2000px,0)'
		});
		if(!this.flipped){
			this.e(this.infoBttn,{
				webkitTransition:'',
				webkitTransform:'translate3d(2000px,0,0)'
			});
		}

	},
	toggleControls:function(keepInfo){
		if(this.flipped){
			return;
		}

		keepInfo=keepInfo||false;
		window.clearTimeout(this.controlHideInt);
		var controls=[this.nextBttn,this.prevBttn,this.playBttn,this.thumbDrawer.container,this.infoBttn];
		if(this.gallery){
			controls.push(this.albumDrawer.container);
		}

		var self=this;
		if(this.controlsVisible){
			this.e(this.nextBttn,{
				webkitTransition:'-webkit-transform 400ms ease-in-out',
				webkitTransform:'translate3d(0px,0,0)'
			});
			this.e(this.prevBttn,{
				webkitTransition:'-webkit-transform 400ms ease-in-out',
				webkitTransform:'translate3d(0px,0,0)'
			});
			this.e(this.playBttn,{
				webkitTransform:'translate3d(0px,0,0)'
			});
			if(!keepInfo){
				this.e(this.infoBttn,{
					webkitTransform:'translate3d(0px,0,0)'
				});
			}

			this.e(this.thumbDrawer.container,{
				webkitTransform:'translate3d(0,0px,0)'
			});
			window.setTimeout(function(){
				M.e(M.playBttn,{
					zIndex:14000
				});
				M.e(M.infoBttn,{
					zIndex:15000
				});
			},500);
			if(this.gallery){
				this.e(this.albumDrawer.container,{
					webkitTransform:'translate3d(0,0px,0)'
				});
				this.albumDrawer.visible=false;
			}

			this.thumbDrawer.visible=false;
			this.controlHideInt=window.setTimeout(function(){
				self.setControlsOffScreen();
			},1000);
		}else{
			this.e(this.nextBttn,{
				webkitTransition:'',
				webkitTransform:'translate3d(0px,0,0)'
			});
			if(!keepInfo){
				this.e(this.infoBttn,{
					webkitTransition:'',
					webkitTransform:'translate3d(0px,0,0)'
				});
			}

			this.e(this.thumbDrawer.container,{
				webkitTransition:'',
				webkitTransform:'translate3d(0,0px,0)'
			});
			var o=[74,70];
			if(this.agent=='iPad'){
				o=[97,91];
			}

			window.setTimeout(function(){
				self.e(self.nextBttn,{
					webkitTransition:'-webkit-transform 400ms ease-in-out',
					webkitTransform:'translate3d(-'+o[0]+'px,0,0)'
				});
				self.e(self.prevBttn,{
					webkitTransition:'-webkit-transform 400ms ease-in-out',
					webkitTransform:'translate3d('+o[0]+'px,0,0)'
				});
				self.e(self.playBttn,{
					webkitTransition:'-webkit-transform 400ms ease-in-out',
					webkitTransform:'translate3d('+o[1]+'px,0,0)'
				});
				self.e(self.infoBttn,{
					webkitTransition:'-webkit-transform 400ms ease-in-out',
					webkitTransform:'translate3d(-'+o[1]+'px,0,0)'
				});
				self.e(self.thumbDrawer.container,{
					webkitTransition:'-webkit-transform 400ms ease-in-out',
					webkitTransform:'translate3d(0,-'+(self.thumbDrawer.tabHeight-1)+'px,0)'
				});
				if(self.gallery){
					self.e(self.albumDrawer.container,{
						webkitTransition:'-webkit-transform 400ms ease-in-out',
						webkitTransform:'translate3d(0,'+(self.albumDrawer.tabHeight-1)+'px,0)'
					});
				}

			},0);
			this.up();
		}

		this.controlsVisible=!this.controlsVisible;
	},
	resetControls:function(){
		var offset=50;
		if(this.agent=='iPad'){
			offset=75;
		}

		this.e(this.nextBttn,{
			top:(this.options.height/2)-offset+'px'
		});
		this.e(this.prevBttn,{
			top:(this.options.height/2)-offset+'px'
		});
		if(this.gallery&&this.albumDrawer){
			this.albumDrawer.reset();
		}

		this.thumbDrawer.reset();
	},
	scroll:function(){
		if(navigator.standalone){
			return;
		}

		if(this.device.apple){
			window.scrollTo(0,0);
		}else{
			window.scrollTo(0,1);
		}

	},
	toggleDisplayMode:function(){
		this.up();
		window.clearTimeout(this.playIntId);
		if(this.playing){
			this.e(this.playBttnContain,{
				webkitTransition:'-webkit-transform 500ms ease-in-out',
				webkitTransform:'rotateY(0deg)'
			});
		}else{
			this.e(this.playBttnContain,{
				webkitTransition:'-webkit-transform 500ms ease-in-out',
				webkitTransform:'rotateY(180deg)'
			});
		}

		this.playing=!this.playing;
		if(this.playing){
			var self=this;
			if(this.currentPosition==this.count){
				this.currentPosition--;
				var me=this.assets[this.album][0];
				var replaceTgt=this.currentPosition-1;
				this.mainPosition(me,this.currentPosition);
				this.unloadImage(this.assets[this.album][replaceTgt]);
				this.pushContainer.appendChild(me.container);
				window.setTimeout(function(){
					self.transition(600,1);
					self.toggleControls();
				},500);
			}else{
				window.setTimeout(function(){
					self.currentPosition++;
					self.transition();
					self.toggleControls();
				},500);
			}

		}

	},
	load:function(dataPath){
		this.body=document.getElementsByTagName('body')[0];
		var agent=navigator.userAgent;
		if(agent.indexOf('iPad')!==-1){
			this.agent='iPad';
		}else if(agent.indexOf('iPhone')!==-1){
			this.agent='iPhone';
		}else{
			this.agent='Android';
		}

		this.device=this.devices[this.agent];
		if(this.device.apple&&agent.indexOf('Safari')===-1){
			this.webview=true;
			this.portrait=true;
			if(this.options.width>this.options.height){
				this.portrait=false;
			}
		}else{
			this.webview=false;
			this.portrait=true;
			if(Math.abs(window.orientation)==90){
				this.portrait=false;
			}

		}
		this.device.max=window.screen.height;
		if(this.agent=='iPhone'){
			var d=this.e('div',{},'deviceTest');
			this.body.appendChild(d);
			var w=window.getComputedStyle(d,null).getPropertyValue("width");
			if(w=='2px'){
				this.device.four=true;
				this.device.max*=2;
			}

			this.body.removeChild(d);
		}

		this.cover=document.getElementById('cover');
		this.setScreen();
		this.e(this.cover,{
			width:this.options.width+'px',
			height:this.options.height+'px'
		});
		this.spinner(this.cover);
		this.video=document.getElementById('video');
		var parts=location.search.substring(1).split('=');
		var contentType=parts[0];
		var contentId=parts[1];
		if(contentType=='album'){
			this.gallery=false;
		}

		var self=this;
		if(this.webview){
			window.setInterval(function(){
				if(self.options.width!=window.innerWidth){
					self.options.width=window.innerWidth;
					self.portrait=!self.portrait;
					self.redraw();
				}
			},100);
		}else{
			window.addEventListener('orientationchange',function(){
				self.portrait=!self.portrait;
				self.redraw();
			},true);
		}

		var tmp=document.createDocumentFragment();
		this.pushContainer=this.e('div',{
			height:'100%',
			position:'absolute',
			width:this.options.width*this.loadN+'px',
			top:'0px',
			left:'0px',
			zIndex:1,
			webkitTransformStyle:'preserve-3d'
		},'ssp-push-parent');
		tmp.appendChild(this.pushContainer);
		this.touchContain=this.e('div',{
			height:this.options.height+'px',
			width:'100%',
			position:'absolute',
			top:'0px',
			left:'0px',
			zIndex:11000
		});
		this.swipeTarget=this.e('div',{
			height:'100%',
			width:'100%',
			position:'absolute',
			top:'0px',
			left:'0px',
			zIndex:11001
		});
		this.nextBttn=this.e('div',{
			width:'100px',
			height:'100px',
			right:'-74px',
			position:'absolute',
			zIndex:11002,
			webkitTransform:'translate3d(2000px,0,0)',
			webkitTransition:'-webkit-transform 400ms ease-in-out',
			webkitTransformStyle:'preserve-3d'
		});
		if(this.agent=='iPad'){
			this.e(this.nextBttn,{
				width:'130px',
				height:'130px',
				right:'-97px'
			});
		}

		this.nextBttnBg=this.e('div',{
			width:'100%',
			height:'100%',
			backgroundImage:this.graphics.nextBttn,
			webkitBackgroundSize:'46% 46%',
			backgroundPosition:'center center',
			backgroundRepeat:'no-repeat'
		});
		this.nextBttn.appendChild(this.nextBttnBg);
		this.prevBttn=this.e('div',{
			width:'100px',
			height:'100px',
			left:'-73px',
			position:'absolute',
			opacity:0.6,
			zIndex:11003,
			webkitTransition:'-webkit-transform 400ms ease-in-out',
			webkitTransformStyle:'preserve-3d'
		});
		if(this.agent=='iPad'){
			this.e(this.prevBttn,{
				width:'130px',
				height:'130px',
				left:'-97px'
			});
		}

		this.prevBttnBg=this.e('div',{
			width:'100%',
			height:'100%',
			backgroundImage:this.graphics.prevBttn,
			webkitBackgroundSize:'37% 37%',
			backgroundPosition:'center center',
			backgroundRepeat:'no-repeat'
		});
		this.prevBttn.appendChild(this.prevBttnBg);
		this.playBttn=this.e('div',{
			width:'100px',
			height:'100px',
			left:'-70px',
			top:'0px',
			position:'absolute',
			zIndex:14000,
			webkitTransition:'-webkit-transform 400ms ease-in-out',
			webkitPerspective:200
		});
		if(this.agent=='iPad'){
			this.e(this.playBttn,{
				width:'130px',
				height:'130px',
				left:'-91px'
			});
		}

		this.playBttnContain=this.e('div',{
			position:'absolute',
			width:'100%',
			height:'100%',
			webkitTransformStyle:'preserve-3d'
		});
		var playBttnFront=this.e('div',{
			position:'absolute',
			width:'100%',
			height:'100%',
			backgroundImage:this.graphics.playBttn,
			backgroundPosition:'center 30%',
			backgroundRepeat:'no-repeat',
			webkitBackgroundSize:'37%',
			webkitBackfaceVisibility:'hidden'
		});
		var playBttnBack=this.e('div',{
			position:'absolute',
			width:'100%',
			height:'100%',
			backgroundImage:this.graphics.pauseBttn,
			backgroundPosition:'center 30%',
			webkitBackgroundSize:'37%',
			backgroundRepeat:'no-repeat',
			webkitTransform:'rotateY(180deg)',
			webkitBackfaceVisibility:'hidden'
		});
		this.playBttnContain.appendChild(playBttnFront);
		this.playBttnContain.appendChild(playBttnBack);
		this.playBttn.appendChild(this.playBttnContain);
		this.infoBttn=this.e('div',{
			width:'100px',
			height:'100px',
			right:'-70px',
			top:'0px',
			position:'absolute',
			zIndex:15000,
			webkitTransform:'translate3d(2000px,0,0)',
			webkitTransition:'-webkit-transform 400ms ease-in-out',
			webkitPerspective:200
		});
		if(this.agent=='iPad'){
			this.e(this.infoBttn,{
				width:'130px',
				height:'130px',
				right:'-91px'
			});
		}

		this.infoBttnContain=this.e('div',{
			position:'absolute',
			width:'100%',
			height:'100%',
			webkitTransformStyle:'preserve-3d'
		});
		var infoBttnFront=this.e('div',{
			position:'absolute',
			width:'100%',
			height:'100%',
			backgroundImage:this.graphics.infoBttn,
			backgroundPosition:'center 30%',
			webkitBackgroundSize:'37%',
			backgroundRepeat:'no-repeat',
			webkitBackfaceVisibility:'hidden'
		});
		var infoBttnBack=this.e('div',{
			position:'absolute',
			width:'100%',
			height:'100%',
			backgroundImage:this.graphics.closeBttn,
			backgroundPosition:'center 30%',
			webkitBackgroundSize:'37%',
			backgroundRepeat:'no-repeat',
			webkitTransform:'rotateY(180deg)',
			webkitBackfaceVisibility:'hidden'
		});
		this.infoBttnContain.appendChild(infoBttnFront);
		this.infoBttnContain.appendChild(infoBttnBack);
		this.infoBttn.appendChild(this.infoBttnContain);
		this.prevBttn.ontouchstart=function(e){
			e.preventDefault();
			self.up();
			if(self.currentPosition>1){
				self.currentPosition--;
				self.transition();
			}

		};

		this.nextBttn.ontouchstart=function(e){
			e.preventDefault();
			self.up();
			if(self.currentPosition<self.count){
				self.currentPosition++;
				self.transition();
			}

		};

		this.playBttn.ontouchstart=function(e){
			self.toggleDisplayMode();
		};

		this.infoBttn.ontouchstart=function(e){
			self.flip();
		};

		this.prevBttn.ontouchmove=this.dead;
		this.nextBttn.ontouchmove=this.dead;
		this.playBttn.ontouchmove=this.dead;
		this.infoBttn.ontouchmove=this.dead;
		this.touchContain.appendChild(this.swipeTarget);
		this.touchContain.appendChild(this.nextBttn);
		this.touchContain.appendChild(this.prevBttn);
		this.touchContain.appendChild(this.playBttn);
		this.touchContain.appendChild(this.infoBttn);
		tmp.appendChild(this.touchContain);
		this.thumbDrawer=new Drawer({
			tab:this.graphics.thumbTab,
			height:this.device.thumbSize+10,
			top:false,
			zIndex:12000
		});
		this.resetControls();
		var touchcoords={
			start:{
				x:0,
				y:0
			},
			end:{
				x:0,
				y:0
			},
			move:false
		};

		this.swipeTarget.ontouchstart=function(e){
			if(e.targetTouches.length==1){
				e.preventDefault();
				if(self.flipped){
					return;
				}

				touchcoords.currentLeft=-((self.currentPosition-1)*self.options.width);
				touchcoords.start.x=e.targetTouches[0].pageX;
				touchcoords.start.y=e.targetTouches[0].pageY;
				touchcoords.start.time=+new Date;
				touchcoords.move=false;
			}
		};

		this.swipeTarget.ontouchmove=function(e){
			if(e.targetTouches.length==1){
				e.preventDefault();
				if(self.flipped){
					return;
				}

				touchcoords.move=true;
				touchcoords.end.x=e.targetTouches[0].pageX;
				touchcoords.end.y=e.targetTouches[0].pageY;
				self.e(self.pushContainer,{
					webkitTransition:'',
					webkitTransform:'translate3d( '+(touchcoords.currentLeft-(touchcoords.start.x-touchcoords.end.x))+'px,0,0)'
				});
			}
		};

		this.swipeTarget.ontouchend=function(e){
			if(self.flipped){
				return;
			}

			if(touchcoords.move){
				var diff=touchcoords.start.x-touchcoords.end.x;
				var dir=1;
				if(diff<0){
					dir=-1;
				}

				diff=Math.abs(diff);
				var end=+new Date;
				var total=end-touchcoords.start.time;
				var rate=total/diff;
				var remaining=self.options.width-diff;
				var threshold=false;
				if(diff>(self.options.width*0.25)||(diff>(self.options.width*0.07)&&rate<1)){
					threshold=true;
				}

				if(threshold&&self.currentPosition+dir>=1&&self.currentPosition+dir<=self.count){
					self.currentPosition+=dir;
					self.transition(remaining*rate);
				}else{
					var l=function(){
						self.e(self.pushContainer,{
							webkitTransition:'-webkit-transform 100ms ease-out',
							webkitTransform:'translate3d('+touchcoords.currentLeft+'px,0,0)'
						});
						self.pushContainer.removeEventListener('webkitTransitionEnd',l);
					};

					self.pushContainer.addEventListener('webkitTransitionEnd',l);
					self.e(self.pushContainer,{
						webkitTransition:'-webkit-transform 100ms',
						webkitTransform:'translate3d('+(touchcoords.currentLeft+(dir*10))+'px,0,0)'
					});
				}

			}else{
				var current=self.assets[self.album][self.currentPosition-1];
				if(current.data.is_video=='1'){
					if(self.videoBttnTarget.min.x<touchcoords.start.x&&touchcoords.start.x<self.videoBttnTarget.max.x&&self.videoBttnTarget.min.y<touchcoords.start.y&&touchcoords.start.y<self.videoBttnTarget.max.y){
						self.playVideo();
						return;
					}

				}

				self.scroll();
				self.toggleControls();
			}

		};

		this.body.appendChild(tmp);
		if(!this.device.nativeVideo){
			this.videoContainer=this.e('div',{
				backgroundColor:'#000',
				position:'absolute',
				top:'0px',
				left:'0px',
				zIndex:1000000,
				opacity:0,
				webkitTransition:'opacity 500ms'
			});
			this.body.appendChild(this.videoContainer);
			this.videoClose=this.e('div',{
				position:'absolute',
				width:'130px',
				height:'130px',
				top:'0px',
				right:'0px',
				backgroundImage:this.graphics.videoClose,
				backgroundPosition:'center 30%',
				backgroundRepeat:'no-repeat',
				zIndex:1000000,
				opacity:0.3,
				webkitBackgroundSize:'30%'
			});
			this.videoContainer.addEventListener('webkitTransitionEnd',function(){
				if(!self.videoPlaying){
					self.e(self.videoContainer,{
						width:'0px',
						height:'0px'
					});
					self.videoContainer.innerHTML='';
					self.videoControlsDuration.innerHTML='';
					self.e(self.videoControls,{
						webkitTransform:'translate3d(0,0px,0)'
					});
				}

			});
			this.videoClose.ontouchstart=function(e){
				self.exitVideo();
			};

			this.videoClose.ontouchmove=this.dead;
			this.videoClose.ontouchend=this.dead;
			this.videoControls=this.e('div',{
				width:'100%',
				height:'40px',
				background:'-webkit-gradient(linear, left top, left bottom, from(#2d2f32), to(#030304))',
				position:'absolute',
				bottom:'-40px',
				webkitTransition:'-webkit-transform 500ms'
			});
			this.videoControlsPlayBttn=this.e('div',{
				position:'absolute',
				width:'80px',
				height:'40px',
				top:'0px',
				left:'0px'
			});
			this.videoControls.appendChild(this.videoControlsPlayBttn);
			this.videoControlsDuration=this.videoControlsPlayBttn.cloneNode(false);
			this.e(this.videoControlsPlayBttn,{
				backgroundImage:this.graphics.videoControlsPlay,
				backgroundRepeat:'no-repeat',
				backgroundPosition:'center center'
			});
			this.videoControlsPlayBttn.ontouchstart=function(e){
				if(self.videoPlaying){
					self.currentVideo.pause();
					self.e(self.videoControlsPlayBttn,{
						backgroundImage:self.graphics.videoControlsPlay
					});
				}else{
					self.currentVideo.play();
					self.e(self.videoControlsPlayBttn,{
						backgroundImage:self.graphics.videoControlsPause
					});
				}

				self.videoPlaying=!self.videoPlaying;
			};

			this.videoControlsPlayBttn.ontouchmove=this.dead;
			this.videoControlsPlayBttn.ontouchend=this.dead;
			this.e(this.videoControlsDuration,{
				left:'',
				right:'0px',
				width:'120px',
				paddingTop:'14px',
				fontSize:'12px',
				textAlign:'center',
				color:'#c9cbcd',
				fontFamily:'Helvetica Neue'
			});
			this.videoControlsScrubber=this.e('div',{
				position:'absolute',
				width:(this.options.width-200)+'px',
				height:'40px',
				top:'0px',
				left:'80px'
			});
			this.videoControlsTrack=this.e('div',{
				position:'absolute',
				width:'100%',
				height:'6px',
				top:'16px',
				left:'0px',
				backgroundColor:'#151517',
				borderTop:'1px solid #000',
				borderBottom:'1px solid #323436'
			});
			this.videoControlsBuffer=this.e('div',{
				position:'absolute',
				width:'0%',
				height:'100%',
				top:'0px',
				left:'0px',
				background:'-webkit-gradient(linear, left top, left bottom, from(#111213), to(#030304))'
			});
			this.videoControlsElapsed=this.videoControlsBuffer.cloneNode(false);
			this.e(this.videoControlsElapsed,{
				width:'0%',
				background:'-webkit-gradient(linear, left top, left bottom, from(#5e5f60), to(#69696a))'
			});
			this.videoControlsHandle=this.e('div',{
				position:'absolute',
				top:'12px',
				width:'20px',
				height:'14px',
				left:'70px',
				webkitBoxShadow:'#000 0 2px 1px',
				webkitBorderRadius:'2px',
				background:'-webkit-gradient(linear, left top, left bottom, from(#c0c2c4), to(#d5d7da))',
				borderTop:'1px solid #e4e4e5',
				borderBottom:'1px solid #edeeef'
			});
			this.videoControlsHandle.ontouchmove=function(e){
				self.videoSeeking=true;
				self.currentVideo.pause();
				var l=e.targetTouches[0].pageX-10;
				var p=((l-70)/(self.options.width-200))*100;
				if(p<0){
					p=0;
					l=70;
				}else if(p>100){
					p=100;
					l=70+(self.options.width-200);
				}

				self.e(self.videoControlsHandle,{
					left:l+'px'
				});
				self.e(self.videoControlsElapsed,{
					width:p+'%'
				});
				var t=self.currentVideo.duration*(p/100);
				self.videoControlsDuration.innerHTML=self.videoString(t)+' / '+self.videoString(self.currentVideo.duration);
			};

			this.videoControlsHandle.ontouchend=function(e){
				self.videoSeeking=false;
				var l=(parseInt(self.videoControlsHandle.style.left,10)-70)/(self.options.width-200);
				var seekTo=self.currentVideo.duration*l;
				self.currentVideo.play();
				self.currentVideo.pause();
				self.currentVideo.currentTime=seekTo;
				self.currentVideo.play();
				self.e(self.videoControlsPlayBttn,{
					backgroundImage:self.graphics.videoControlsPause
				});
				self.videoPlaying=true;
			};

			this.videoControlsScrubber.appendChild(this.videoControlsTrack);
			this.videoControlsTrack.appendChild(this.videoControlsBuffer);
			this.videoControlsTrack.appendChild(this.videoControlsElapsed);
			this.videoControls.appendChild(this.videoControlsPlayBttn);
			this.videoControls.appendChild(this.videoControlsDuration);
			this.videoControls.appendChild(this.videoControlsScrubber);
			this.videoControls.appendChild(this.videoControlsHandle);
		}

		this.body.ontouchstart=this.dead;
		this.body.ontouchmove=this.dead;
		this.body.ontouchend=this.dead;
		this.spin=this.spinner(this.touchContain,true);
		this.spinOn=true;
		this.toggleSpin();
		DirectorJS.Format.add({
			name:'main',
			width:this.device.max,
			height:this.device.max,
			quality:90
		});
		var w=this.device.thumbSize;
		if(this.device.four){
			w*=2;
		}

		DirectorJS.Format.add({
			name:'thumb',
			width:w,
			height:w,
			quality:85,
			square:1
		});
		var w=this.device.albumSize[0];
		var h=this.device.albumSize[1];
		if(this.device.four){
			w*=2;
			h*=2;
		}

		DirectorJS.Format.preview({
			width:w,
			height:h,
			quality:85,
			square:1
		});
		if(this.gallery){
			DirectorJS.Gallery.get(contentId,function(data){
				if(data.albums.length==1){
					self.gallery=false;
				}else{
					self.loadAlbums(data.albums);
				}

				self.loadAlbum(data.albums[0]);
			},{
				include_metadata:false
			});
		}else{
			DirectorJS.Album.get(contentId,function(data){
				self.loadAlbum(data);
			},{
				include_metadata:false
			});
		}

		this.up();
		window.setInterval(function(){
			self.monitorControls();
		},100);
	},
	up:function(){
		this.lastInput=+new Date;
	},
	getSizeInfo:function(_img){
		if(!_img.main){
			return['100% 55%',this.options.width,this.options.height*.55];
		}

		var dims=this.device[this.portrait?'portrait':'landscape'];
		var toAspect=dims[0]/dims[1];
		var fromAspect=_img.main.width/_img.main.height;
		var w,h;
		var bgSize='auto 100%';
		if(fromAspect>=toAspect){
			w=dims[0];
			h=(dims[0]*_img.main.height)/_img.main.width;
			bgSize='100% auto';
		}else{
			w=(dims[1]*_img.main.width)/_img.main.height;
			h=dims[1];
		}

		return[bgSize,w,h];
	},
	loadAlbum:function(a){
		if(this.gallery){
			this.highlightCurrentAlbum(true);
		}

		if(a.contents.length==1){
			this.e(this.prevBttn,{
				display:'none'
			});
			this.e(this.nextBttn,{
				display:'none'
			});
			this.e(this.playBttn,{
				display:'none'
			});
			this.e(this.thumbDrawer.container,{
				display:'none'
			});
		}else{
			this.e(this.prevBttn,{
				display:'block'
			});
			this.e(this.nextBttn,{
				display:'block'
			});
			this.e(this.playBttn,{
				display:'block'
			});
			this.e(this.thumbDrawer.container,{
				display:'block'
			});
		}

		this.album=a.id;
		if(this.playing){
			this.toggleDisplayMode();
		}

		if(this.gallery){
			this.highlightCurrentAlbum();
		}

		this.currentAlbum=this.album;
		var assets=a.contents;
		this.count=assets.length;
		this.loadPosition=0;
		this.thumbLoadPosition=0;
		this.currentPosition=1;
		this.e(this.prevBttn,{
			webkitTransition:'opacity 400ms',
			opacity:0.6
		});
		this.e(this.prevBttnBg,{
			webkitBackgroundSize:'37% 37%'
		});
		if(a.contents.length==1){
			this.e(this.nextBttn,{
				webkitTransition:'opacity 400ms',
				opacity:0.6
			});
			this.e(this.nextBttnBg,{
				webkitBackgroundSize:'37% 37%'
			});
		}else{
			this.e(this.nextBttn,{
				webkitTransition:'opacity 400ms',
				opacity:1
			});
			this.e(this.nextBttnBg,{
				webkitBackgroundSize:'46% 46%'
			});
		}

		this.e(this.pushContainer,{
			webkitTransition:'',
			webkitTransform:'translate3d(0px,0,0)'
		});
		if(!this.assets[this.album]){
			this.assets[this.album]=[];
			var self=this;
			for(var i=0;i<this.count;i++){
				var _img=assets[i];
				if(_img.main&&_img.main.watermarked_url){
					_img.main.url=_img.main.watermarked_url;
				}

				var sizeInfo=this.getSizeInfo(_img);
				var bgSize=sizeInfo[0];
				var css={
					width:this.options.width+'px',
					height:this.options.height+'px',
					position:'absolute',
					left:(i*this.options.width)+'px',
					overflow:'hidden'
				};

				var contain=this.e('div',css,'ssp-image-container');
				var innerContain=this.e('div',{
					width:'100%',
					height:'100%',
					position:'relative',
					webkitTransformStyle:'preserve-3d'
				});
				var front=innerContain.cloneNode(false);
				this.e(front,{
					position:'absolute',
					left:'0px',
					top:'0px',
					width:'100%',
					height:'100%',
					webkitBackfaceVisibility:'hidden',
					webkitBackgroundSize:bgSize,
					backgroundRepeat:'no-repeat',
					backgroundPosition:'center center'
				});
				var back=front.cloneNode(false);
				this.e(back,{
					webkitTransform:'rotateY(180deg)',
					backgroundImage:''
				});
				var backBg=this.e('div',{
					webkitTransform:'scaleX(-1)',
					width:'100%',
					height:'100%',
					opacity:0.1,
					backgroundRepeat:'no-repeat',
					backgroundPosition:'center center'
				});
				var backContent=this.e('div',{
					position:'absolute',
					marginRight:'20px',
					overflow:'hidden'
				},'back');
				backContent.innerHTML='<h2>'+(i+1)+' / '+this.count+'</h2>'+'<h1>'+(_img.title!=''?_img.title:_img.src)+'</h1><p>'+_img.caption+'</p>';
				var play,video;
				if(_img.is_video=='1'){
					play=this.e('div',{
						width:'100%',
						height:'100%',
						backgroundImage:this.graphics.playBttn,
						webkitBackgroundSize:'85px',
						backgroundPosition:'center center',
						backgroundRepeat:'no-repeat'
					});
					if(this.agent=='iPad'){
						this.e(play,{
							webkitBackgroundSize:'110px'
						});
					}

					front.appendChild(play);
					video=this.e('video',{});
					if(this.device.nativeVideo){
						this.e(video,{
							display:'none',
							opacity:0.001
						});
					}

					video.ontouchstart=this.dead;
					video.ontouchmove=this.dead;
					video.ontouchend=this.dead;
					video.src=_img.original.url;
					if(this.device.nativeVideo){
						video.addEventListener('pause',function(){
							self.exitVideo();
						});
						this.body.appendChild(video);
					}
				}else{
					play=false;
					video=false;
				}

				back.appendChild(backBg);
				back.appendChild(backContent);
				innerContain.appendChild(front);
				innerContain.appendChild(back);
				contain.appendChild(innerContain);
				var tnContain=this.e('div',{
					position:'absolute',
					top:'5px',
					left:(i*(this.device.thumbSize+5))+5+'px',
					webkitBoxShadow:'#000 0px 1px 1px',
					width:this.device.thumbSize+'px',
					height:this.device.thumbSize+'px',
					overflow:'hidden'
				});
				var tnInside=this.e('div',{
					width:'100%',
					height:'100%',
					webkitBackgroundSize:'100%',
					position:'absolute'
				});
				var tnBgImg='none';
				if(_img.thumb){
					tnBgImg=_img.thumb.url;
				}

				var tnBg=this.e('div',{
					width:this.device.thumbSize-4+'px',
					height:this.device.thumbSize-4+'px',
					border:'2px solid #646a70',
					webkitTransform:'scale(1.2)',
					position:'absolute'
				});
				tnBg.pos=i+1;
				tnBg.react=function(){
					if(this.pos==self.currentPosition){
						return;
					}

					if(this.pos==self.currentPosition+1||this.pos==self.currentPosition-1){
						self.currentPosition=this.pos;
						self.transition();
					}else{
						var me=self.assets[self.album][this.pos-1];
						if(this.pos>self.currentPosition){
							self.currentPosition++;
						}else{
							self.currentPosition--;
						}

						var replaceTgt=self.currentPosition-1;
						self.mainPosition(me,self.currentPosition);
						self.unloadImage(self.assets[self.album][replaceTgt]);
						self.pushContainer.appendChild(me.container);
						self.transition(null,this.pos);
					}

				};

				tnContain.appendChild(tnInside);
				tnContain.appendChild(tnBg);
				var w=500,h=500;
				if(_img.main){
					w=_img.main.width;
					h=_img.main.height;
				}

				var obj={
					data:assets[i],
					container:contain,
					innerContain:innerContain,
					tnContainer:tnContain,
					tnBg:tnBg,
					tnBgImg:tnBgImg,
					tnInside:tnInside,
					front:front,
					back:backBg,
					backContent:backContent,
					width:w,
					height:h,
					loaded:false,
					videoPlay:play,
					video:video,
					portrait:this.portrait
				};

				this.assets[this.album].push(obj);
			}

		}

		this.tnPos=0;
		this.resetMain(true);
		this.resetThumbs();
		this.highlightCurrentImage();
	},
	toggleCover:function(quick){
		quick=quick||false;
		if(quick){
			this.e(this.cover,{
				webkitTransition:''
			});
		}else{
			this.e(this.cover,{
				webkitTransition:'-webkit-transform 500ms'
			});
		}

		if(this.covered){
			this.e(this.cover,{
				webkitTransform:'translate3d(0,-'+this.options.height+'px,0)'
			});
		}else{
			this.e(this.cover,{
				webkitTransform:'translate3d(0,0px,0)'
			});
		}

		this.covered=!this.covered;
	},
	redraw2:function(current){
		this.setScreen();
		this.resetControls();
		if(this.gallery){
			this.albumDrawer.setupSwipe();
		}

		this.thumbDrawer.setupSwipe();
		this.e(this.pushContainer,{
			width:this.options.width*this.loadN+'px',
			height:this.options.height+'px',
			webkitTransformStyle:'preserve-3d',
			webkitTransition:'',
			webkitTransform:'translate3d('+-(this.options.width*(this.currentPosition-1))+'px,0,0)'
		});
		this.e(this.touchContain,{
			height:this.options.height+'px'
		});
		if(this.currentVideo){
			if(this.device.nativeVideo){
				this.e(this.currentVideo,{
					top:'0px',
					left:'0px',
					width:this.options.width+'px',
					height:this.options.height+'px'
				});
			}else{
				this.e(this.videoContainer,{
					width:this.options.width+'px',
					height:this.options.height+'px'
				});
			}

		}

		if(this.videoContainer){
			this.e(this.videoControlsScrubber,{
				width:(this.options.width-200)+'px'
			});
		}

		this.resetMain();
		if(this.flipped){
			this.flipPosition(current);
		}

		var self=this;
		window.setTimeout(function(){
			self.scroll();
		},50);
		this.e(this.cover,{
			webkitTransition:'',
			webkitTransform:'translate3d(0,-'+this.options.height+'px,0)',
			width:this.options.width+'px',
			height:this.options.height+'px'
		});
	},
	redraw:function(){
		var current=this.assets[this.album][this.currentPosition-1];
		for(i in this.onStage){
			if(this.onStage[i]!=current){
				this.unloadImage(this.onStage[i]);
			}

		}

		var self=this;
		window.setTimeout(function(){
			self.redraw2(current);
		},1)
	},
	unloadImage:function(asset){
		asset.front.style.backgroundImage='none';
		if(asset.loaded){
			asset.loaded=false;
			this.pushContainer.removeChild(asset.container);
		}

	},
	resetThumbs:function(){
		var tnCss={
			width:((this.device.thumbSize+5)*this.count)+5+'px',
			webkitTransform:'translate3d(0px,0,0)'
		};

		this.e(this.thumbDrawer.content,tnCss);
		var assets=this.assets[this.album];
		var frag=document.createDocumentFragment();
		for(var i in assets){
			frag.appendChild(assets[i].tnContainer);
		}

		this.thumbDrawer.content.innerHTML='';
		this.thumbDrawer.content.appendChild(frag);
		this.thumbDrawer.setupSwipe();
		this.tnLoaderStart();
	},
	mainPosition:function(asset,index){
		index=index||this.currentPosition-1;
		var css={
			left:(index-1)*this.options.width+'px',
			zIndex:1000-index
		};

		var info=this.getSizeInfo(asset.data);
		var bg=info[0];
		if(asset.portrait!=this.portrait){
			css.width=this.options.width+'px';
			css.height=this.options.height+'px';
			asset.portrait=this.portrait;
			this.e(asset.front,{
				webkitBackgroundSize:bg
			});
		}

		var append=false;
		if(asset.loaded){
			this.mainLoaded();
			if(this.spinOn){
				this.toggleSpin();
			}

		}else if(asset.data.main){
			append=true;
			var img=new Image();
			var self=this;
			img.onload=function(){
				self.mainLoaded();
				asset.loaded=true;
				self.e(asset.front,{
					backgroundImage:'url('+asset.data.main.url+')'
				});
				img.src='';
				if(self.spinOn){
					self.toggleSpin();
				}

				if(self.covered){
					self.toggleCover();
				}

				delete(img);
			};

			img.src=asset.data.main.url;
		}else{
			if(!asset.loaded){
				append=true;
				this.e(asset.front,{
					backgroundImage:'-webkit-gradient(linear, left top, left bottom, from(#111), to(#111))'
				});
			}

			asset.loaded=true;
			this.mainLoaded();
		}

		this.e(asset.container,css);
		return append;
	},
	tnLoaderStart:function(){
		this.tnLoaderStop();
		var self=this;
		this.tnInterval=window.setInterval(function(){
			if(self.tnPos==self.count){
				self.tnLoaderStop();
				return;
			}
			if(!self.mainLoading){
				var loadMe=self.assets[self.album][self.tnPos];
				self.e(loadMe.tnInside,{
					backgroundImage:'url('+loadMe.tnBgImg+')'
				});
				self.tnPos++;
			}

		},500);
	},
	tnLoaderStop:function(){
		window.clearInterval(this.tnInterval);
	},
	previewLoaderStart:function(){
		var self=this;
		this.previewInterval=window.setInterval(function(){
			if(self.previewsToLoad.length){
				if(!self.mainLoading){
					var id=self.previewsToLoad.shift();
					var a=self.albums[id];
					if(a.preview){
						self.e(a.element,{
							backgroundImage:'url('+a.preview.url+')'
						});
					}

				}

			}else{
				window.clearInterval(self.previewInterval);
			}

		},500);
	},
	mainLoaded:function(){
		this.mainLoadedCount++;
		if(this.mainLoadedCount==this.mainLoadedDone){
			this.mainLoading=false;
		}

	},
	resetMain:function(){
		var noobs=[];
		var appendMe=document.createDocumentFragment();
		var assets=this.assets[this.album];
		var start=this.currentPosition-1;
		if(start<=2){
			start=1;
		}else if(start==(this.count-1)){
			start-=1;
		}

		var max=start+this.loadN;
		if(max>(this.count)){
			max=(this.count+1);
		}

		this.mainLoadedCount=0;
		this.mainLoading=true;
		this.mainLoadedDone=max-start;
		for(var i=start;i<max;i++){
			var c=assets[i-1];
			var append=this.mainPosition(c,i);
			if(append){
				appendMe.appendChild(c.container);
			}

			noobs.push(c);
		}

		if(appendMe.childNodes.length){
			for(var i in this.onStage){
				var leave=false;
				var c=this.onStage[i];
				if(c.loaded){
					for(var j in noobs){
						if(c==noobs[j]){
							leave=true;
							break;
						}

					}

					if(!leave){
						this.unloadImage(c);
					}

				}

			}

			this.pushContainer.appendChild(appendMe);
			this.onStage=noobs;
		}
		var left=-((this.currentPosition-1)*this.options.width);
		this.e(this.pushContainer,{
			webkitTransition:'',
			webkitTransform:'translate3d('+left+'px,0,0)'
		});
	},
	highlightCurrentImage:function(){
		var css={
			webkitTransformStyle:'preserve-3d'
		};

		if(this.thumbDrawer.visible){
			css.webkitTransition='-webkit-transform 400ms';
		}else{
			css.webkitTransition='';
		}

		if(this.currentImage){
			css.webkitTransform='scale(1.2)';
			this.e(this.currentImage.tnBg,css);
		}

		var me=this.assets[this.album][this.currentPosition-1];
		css.webkitTransform='scale(1)';
		this.e(me.tnBg,css);
		this.currentImage=me;
	},
	highlightCurrentAlbum:function(undo){
		if(!this.album){
			return;
		}

		undo=undo||false;
		var c='#646a70';
		if(undo){
			c='#1c1e1f';
		}

		var a=document.getElementById(this.album);
		this.e(a,{
			backgroundColor:c
		})
	},
	flipPosition:function(me){
		var size=this.getSizeInfo(me.data);
		var bg;
		if(me.data.main){
			bg='url('+me.data.main.url+')';
		}else{
			bg='-webkit-gradient(linear, left top, left bottom, from(#000), to(#000))'
		}

		this.e(me.back,{
			backgroundImage:bg,
			webkitBackgroundSize:size[0]
		});
		var top=((this.options.height)/2)-((size[2])/2)+30;
		if(top<60){
			top=60;
		}

		this.e(me.backContent,{
			top:top+'px',
			left:((this.options.width)/2)-((size[1])/2)+10+'px',
			width:size[1]-40+'px'
		});
	},
	flip:function(){
		if(this.playing){
			window.clearTimeout(this.playIntId);
		}

		this.toggleControls(true);
		this.flipped=!this.flipped;
		this.toggleControls(true);
		if(this.flipped){
			this.e(this.infoBttnContain,{
				webkitTransition:'-webkit-transform 500ms ease-in-out',
				webkitTransform:'rotateY(180deg)'
			});
		}else{
			this.e(this.infoBttnContain,{
				webkitTransition:'-webkit-transform 500ms ease-in-out',
				webkitTransform:'rotateY(0deg)'
			});
		}

		var me=this.assets[this.album][this.currentPosition-1];
		this.e(me.container,{
			webkitPerspective:this.options.width*2
		});
		this.flipPosition(me);
		var self=this;
		var d='0';
		if(!this.flipped){
			var cb=function(){
				self.e(me.back,{
					backgroundImage:'none'
				});
				me.innerContain.removeEventListener('webkitTransitionEnd',cb);
				if(self.playing){
					self.playIntId=window.setTimeout(function(){
						self.currentPosition++;
						self.transition();
						self.toggleControls();
					},1000);
				}

			};

			me.innerContain.addEventListener('webkitTransitionEnd',cb);
		}else{
			d='180';
		}

		self.e(me.innerContain,{
			webkitTransition:'-webkit-transform 500ms ease-in-out',
			webkitTransform:'rotateY('+d+'deg)'
		});
	},
	exitVideo:function(){
		if(this.device.nativeVideo){
			this.toggleCover(true);
			this.e(this.currentVideo,{
				display:'none'
			});
			this.scroll();
		}else{
			this.currentVideo.pause();
			this.e(this.videoContainer,{
				opacity:0
			});
		}

		this.currentVideo=false;
		this.videoPlaying=false;
	},
	playVideo:function(){
		if(this.playing){
			this.toggleDisplayMode();
		}

		var me=this.assets[this.album][this.currentPosition-1];
		var mime=me.data.mime_type;
		var test=document.createElement('video').canPlayType(mime);
		if(test!='probably'&&mime!=''){
			alert('This video cannot be played on this device.');
			return;
		}

		if(this.device.nativeVideo){
			this.toggleCover();
			this.e(me.video,{
				display:'block',
				width:this.options.width+'px',
				height:this.options.height+'px'
			});
			me.video.load();
			me.video.play();
			this.currentVideo=me.video;
		}else{
			var self=this;
			this.e(this.videoContainer,{
				width:this.options.width+'px',
				height:this.options.height+'px',
				opacity:1
			});
			var clone=me.video.cloneNode(true);
			this.e(clone,{
				width:'100%',
				height:'100%'
			});
			this.videoContainer.appendChild(clone);
			this.videoContainer.appendChild(this.videoClose);
			this.videoContainer.appendChild(this.videoControls);
			clone.addEventListener('ended',function(){
				self.exitVideo();
			});
			clone.addEventListener('error',function(){
				alert('error');
			});
			clone.play();
			this.currentVideo=clone;
			clone.addEventListener('timeupdate',function(e){
				self.monitorVideo(e.target.currentTime);
			});
			this.videoPlaying=true;
			this.e(this.videoControlsPlayBttn,{
				backgroundImage:this.graphics.videoControlsPause
			});
		}

	},
	videoString:function(t){
		var m=Math.floor(t/60);
		var s=Math.floor(t%60);
		if(s<10){
			s='0'+s;
		}

		return m+':'+s;
	},
	monitorVideo:function(t){
		if(!isNaN(this.currentVideo.duration)){
			var d=this.currentVideo.duration;
			if(this.videoControlsDuration.innerHTML==''){
				this.e(this.videoControls,{
					webkitTransform:'translate3d(0,-40px,0)'
				});
			}

			this.videoControlsDuration.innerHTML=this.videoString(t)+' / '+this.videoString(d);
			var bufferedPercent=parseInt(((this.currentVideo.buffered.end(0)/d)*100),10);
			this.e(this.videoControlsBuffer,{
				width:bufferedPercent+'%'
			});
			var ct=t/d;
			var left=((this.options.width-200)*ct)+70;
			this.e(this.videoControlsElapsed,{
				width:ct*100+'%'
			});
			this.e(this.videoControlsHandle,{
				left:left+'px'
			});
		}

	},
	loadAlbums:function(albums){
		this.albumDrawer=new Drawer({
			tab:this.graphics.albumTab,
			height:this.device.albumSize[1]+40,
			top:true,
			zIndex:13000
		});
		this.resetControls();
		var w=this.device.albumSize[0];
		this.albums={};

		this.previewsToLoad=[];
		this.e(this.albumDrawer.content,{
			width:(albums.length*(w+5))+5+'px'
		});
		var frag=document.createDocumentFragment();
		for(var i in albums){
			var a=albums[i];
			this.albums[a.id]=a;
			this.previewsToLoad.push(a.id);
			var l=(i*(w+5))+5;
			var div=this.e('div',{
				position:'absolute',
				top:'5px',
				left:l+'px',
				webkitBoxShadow:'#000 0px 1px 1px',
				backgroundColor:'#1c1e1f',
				backgroundRepeat:'no-repeat',
				webkitBackgroundSize:'100% auto',
				width:(w-10)+'px',
				height:'22px',
				fontSize:'10px',
				padding:(this.device.albumSize[1]+3)+'px 5px 6px',
				textAlign:'left',
				color:'#fff',
				fontFamily:'Helvetica Neue',
				fontWeight:'bold'
			});
			div.innerHTML=a.name;
			div.id=a.id;
			var self=this;
			div.react=function(){
				if(self.currentAlbum!=this.id){
					self.toggleSpin();
					var _a=self.albums[this.id];
					self.loadAlbum(_a);
					window.setTimeout(function(){
						self.toggleControls();
					},400);
				}
			};

			this.albums[a.id].left=l;
			this.albums[a.id].element=div;
			frag.appendChild(div);
		}

		this.albumDrawer.content.appendChild(frag);
		this.previewLoaderStart();
		this.albumDrawer.setupSwipe();
	},
	toggleSpin:function(){
		var css;
		if(this.spinOn){
			css={
				top:'-50%'
			};

		}else{
			css={
				top:'50%'
			};

		}

		this.e(this.spin,css);
		this.spinOn=!this.spinOn;
	},
	transition:function(dur,skip){
		if(isNaN(skip)){
			skip=false;
		}

		var c=this.pushContainer.style.webkitTransform.match(/(-?\d+)px/)[1];
		window.clearTimeout(this.playIntId);
		dur=dur||500;
		var candidate=this.assets[this.album][this.currentPosition-1];
		var left=-((this.currentPosition-1)*this.options.width);
		var self=this;
		var diff=Math.abs(c-left);
		var bounce=false;
		if(skip){
			this.currentPosition=skip;
		}

		if(!candidate.loaded||skip){
			this.toggleSpin();
		}

		var finalCallback=function(){
			self.resetMain();
			if(self.playing){
				if(self.currentPosition==self.count){
					self.toggleDisplayMode();
				}else{
					self.playIntId=window.setTimeout(function(){
						self.currentPosition++;
						self.transition();
					},4000);
				}

			}

			self.pushContainer.removeEventListener('webkitTransitionEnd');
			if(self.currentPosition==1){
				self.e(self.prevBttn,{
					webkitTransition:'opacity 400ms',
					opacity:0.6
				});
				self.e(self.prevBttnBg,{
					webkitBackgroundSize:'37% 37%'
				});
				self.e(self.nextBttn,{
					webkitTransition:'opacity 400ms',
					opacity:1
				});
				self.e(self.nextBttnBg,{
					webkitBackgroundSize:'46% 46%'
				});
			}else if(self.currentPosition==self.count){
				self.e(self.nextBttn,{
					webkitTransition:'opacity 400ms',
					opacity:0.6
				});
				self.e(self.nextBttnBg,{
					webkitBackgroundSize:'37% 37%'
				});
				self.e(self.prevBttn,{
					webkitTransition:'opacity 400ms',
					opacity:1
				});
				self.e(self.prevBttnBg,{
					webkitBackgroundSize:'46% 46%'
				});
			}else{
				self.e(self.nextBttn,{
					webkitTransition:'opacity 400ms',
					opacity:1
				});
				self.e(self.nextBttnBg,{
					webkitBackgroundSize:'46% 46%'
				});
				self.e(self.prevBttn,{
					webkitTransition:'opacity 400ms',
					opacity:1
				});
				self.e(self.prevBttnBg,{
					webkitBackgroundSize:'46% 46%'
				});
			}

		};

		var l=function(){
			if(bounce){
				self.pushContainer.addEventListener('webkitTransitionEnd',finalCallback);
				self.e(self.pushContainer,{
					webkitTransition:'-webkit-transform '+Math.round(dur*0.3)+'ms',
					webkitTransform:'translate3d('+left+'px,0,0)'
				});
			}else{
				finalCallback.call(this);
			}

			self.pushContainer.removeEventListener('webkitTransitionEnd',l);
		};

		this.pushContainer.addEventListener('webkitTransitionEnd',l);
		var left2,dur2;
		if(bounce){
			dur2=Math.round(dur*0.7);
			left2=left;
			if(c>left2){
				left2-=5;
			}else{
				left2+=5;
			}

		}else{
			dur2=dur;
			left2=left;
		}

		self.e(self.pushContainer,{
			webkitTransition:'-webkit-transform '+Math.round(dur2)+'ms',
			webkitTransform:'translate3d('+left2+'px,0,0)'
		});
		self.highlightCurrentImage();
	}
};

var Drawer=function(opts){
	this.opts=opts;
	this.visible=false;
	this.lastSwipe=+new Date;
	this.tabHeight=60;
	this.tabWidth=100;
	if(M.agent=='iPad'){
		this.tabHeight=78;
		this.tabWidth=130;
	}

	this.totalHeight=this.tabHeight+this.opts.height;
	this.draw();
};

Drawer.prototype.draw=function(){
	var css={
		width:'100%',
		height:this.totalHeight+'px',
		position:'absolute',
		left:'0px',
		zIndex:this.opts.zIndex,
		background:'transparent',
		webkitTransformStyle:'preserve-3d'
	}

	if(!this.opts.top){
		css.webkitTransform='translate3d(0,2000px,0)';
	}

	css.webkitTransition='-webkit-transform 400ms ease-in-out';
	this.container=M.e('div',css);
	this.container.ontouchstart=M.dead;
	this.container.ontouchmove=M.dead;
	this.container.ontouchend=M.dead;
	var css={
		width:this.tabWidth+'px',
		height:this.tabHeight+'px',
		backgroundImage:this.opts.tab,
		backgroundRepeat:'no-repeat',
		position:'absolute',
		left:(M.options.width/2)-(this.tabWidth/2)+'px',
		zIndex:this.opts.zIndex+1
	};

	if(M.agent=='iPad'){
		css.webkitBackgroundSize='100% auto';
	}

	if(this.opts.top){
		css.top=this.opts.height+'px';
		css.backgroundPosition='top center';
	}else{
		css.top='0px';
		css.backgroundPosition='bottom center';
	}

	this.tab=M.e('div',css);
	var css={
		width:'100%',
		height:this.opts.height+'px',
		position:'absolute',
		left:'0px',
		background:'-webkit-gradient(linear, left top, left bottom, from(#030304), to(#42464a))'
	};

	if(this.opts.top){
		css.top='0px';
		css.borderBottom='1px solid #585b5e';
	}else{
		css.bottom='0px';
		css.borderTop='1px solid #585b5e';
	}

	this.bg=M.e('div',css);
	this.bg.ontouchstart=M.dead;
	this.bg.ontouchmove=M.dead;
	this.bg.ontouchend=M.dead;
	var css={
		height:this.opts.height+'px',
		position:'absolute',
		left:'0px',
		webkitTransformStyle:'preserve-3d'
	};

	if(this.opts.top){
		css.top='0px';
	}else{
		css.bottom='0px';
	}

	this.content=M.e('div',css);
	this.container.appendChild(this.bg);
	this.container.appendChild(this.content);
	this.container.appendChild(this.tab);
	M.touchContain.appendChild(this.container);
	var tabcoords={
		start:{
			x:0,
			y:0
		},
		end:{
			x:0,
			y:0
		},
		move:false,
		n:0
	};

	var self=this;
	this.tab.ontouchstart=function(e){
		if(self.opts.top){
			M.e(M.playBttn,{
				zIndex:0
			});
			M.e(M.infoBttn,{
				zIndex:0
			});
		}

		tabcoords.move=false;
		tabcoords.start.x=e.targetTouches[0].pageX;
		tabcoords.start.y=e.targetTouches[0].pageY;
		tabcoords.start.time=+new Date;
		if(self.opts.top){
			tabcoords.closed=self.tabHeight-1;
			tabcoords.open=self.totalHeight;
		}else{
			tabcoords.closed=-(self.tabHeight-1);
			tabcoords.open=-self.totalHeight;
		}

		M.e(self.container,{
			webkitTransition:''
		});
	};

	this.tab.ontouchmove=function(e){
		e.preventDefault();
		M.up();
		tabcoords.move=true;
		tabcoords.end.x=e.targetTouches[0].pageX;
		tabcoords.end.y=e.targetTouches[0].pageY;
		var base=tabcoords.closed;
		if(self.visible){
			base=tabcoords.open;
		}

		var diff=tabcoords.start.y-tabcoords.end.y;
		tabcoords.n=Math.abs(diff);
		if(self.opts.top){
			diff=base-diff;
		}else{
			base=-base;
			diff=base+diff;
		}

		if(diff>self.totalHeight){
			diff=self.totalHeight;
		}else if(diff<(self.tabHeight-1)){
			diff=self.tabHeight-1;
		}

		if(!self.opts.top){
			diff='-'+diff;
		}

		M.e(self.container,{
			webkitTransform:'translate3d(0,'+diff+'px,0)'
		});
	};

	this.tab.ontouchend=function(e){
		e.preventDefault();
		M.up();
		var f=0.3;
		if(self.visible){
			f=0.3;
		}

		var style;
		if(tabcoords.move){
			if(tabcoords.n>self.opts.height*f){
				style=self.visible?tabcoords.closed:tabcoords.open;
				self.visible=!self.visible;
			}else{
				style=self.visible?tabcoords.open:tabcoords.closed;
			}

			M.e(self.container,{
				webkitTransition:'-webkit-transform 200ms ease-in-out'
			});
		}else{
			style=self.visible?tabcoords.closed:tabcoords.open;
			self.visible=!self.visible;
			M.e(self.container,{
				webkitTransition:'-webkit-transform 400ms ease-in-out'
			});
		}

		M.e(self.container,{
			webkitTransform:'translate3d(0,'+style+'px,0)'
		});
		if(!self.visible){
			window.setTimeout(function(){
				M.e(M.playBttn,{
					zIndex:14000
				});
				M.e(M.infoBttn,{
					zIndex:15000
				});
			},500);
		}

	};

};

Drawer.prototype.reset=function(){
	var reset;
	if(this.opts.top){
		reset=-this.totalHeight;
	}else{
		reset=M.options.height;
	}

	M.e(this.container,{
		top:reset+'px'
	});
	M.e(this.tab,{
		left:(M.options.width/2)-(this.tabWidth/2)+'px'
	});
};

Drawer.prototype.setupSwipe=function(){
	var w=parseInt(this.content.style.width,10);
	if(this.content.style.webkitTransform){
		var c=this.content.style.webkitTransform.match(/(-?\d+)px/)[1];
		var max=-(w-M.options.width);
		if(c<max){
			this.content.style.webkitTransform='translate3d('+max+'px,0,0)';
		}

	}

	if(w<M.options.width){
		var dead=function(e){
			e.preventDefault();
		};

		this.content.ontouchstart=dead;
		this.content.ontouchmove=dead;
		this.content.ontouchend=function(e){
			if(e.target&&e.target.react){
				e.target.react();
			}

			M.up();
		};

		M.e(this.content,{
			left:(M.options.width/2)-w/2+'px',
			webkitTransform:'translate3d(0px,0,0)'
		});
	}else{
		M.e(this.content,{
			left:'0px'
		});
		var coords={
			start:{
				x:0,
				y:0
			},
			end:{
				x:0,
				y:0
			},
			move:false,
			base:0,
			blockEnd:false,
			intId:0
		};

		var self=this;
		var check=function(){
			return(+new Date-self.lastSwipe)>750;
		};

		this.content.ontouchstart=function(e){
			e.preventDefault();
			if(check()){
				coords.move=false;
				coords.blockEnd=false;
				coords.start.x=e.targetTouches[0].pageX;
				coords.start.y=e.targetTouches[0].pageY;
				coords.start.time=+new Date;
				coords.max=-(w-M.options.width);
			}

			M.e(self.content,{
				webkitTransition:''
			})
		};

		this.content.ontouchmove=function(e){
			e.preventDefault();
			if(check()){
				window.clearTimeout(coords.intId);
				M.up();
				coords.move=true;
				coords.end.x=e.targetTouches[0].pageX;
				coords.end.y=e.targetTouches[0].pageY;
				var n=coords.base-(coords.start.x-coords.end.x);
				if(n>50){
					n=50;
				}else if(n<(coords.max-50)){
					n=coords.max-50;
				}

				M.e(self.content,{
					webkitTransform:'translate3d('+n+'px,0,0)'
				});
				var _self=this;
				coords.intId=window.setTimeout(function(){
					if(coords.move){
						_self.ontouchend();
					}

				},100);
			}

		};

		this.content.ontouchend=function(e){
			if(e){
				e.preventDefault();
			}else{
				coords.blockEnd=true;
			}

			if(coords.move&&check()){
				coords.move=false;
				self.lastSwipe=+new Date;
				coords.base-=coords.start.x-coords.end.x;
				if(coords.base>0){
					var n='0';
				}else if(coords.base<coords.max){
					var n=coords.max;
				}else{
					var diff=coords.start.x-coords.end.x;
					var right=true;
					if(diff<0){
						right=false;
					}

					diff=Math.abs(diff);
					var end=+new Date;
					var total=end-coords.start.time;
					var r1=diff/total;
					var r2=total/diff;
					var go=r1*(M.options.width*0.7);
					if(right){
						coords.base-=go;
					}else{
						coords.base+=go;
					}

					if(coords.base>0){
						coords.base=0;
					}else if(coords.base<coords.max){
						coords.base=coords.max;
					}

					var dur=go*(r2*3);
					M.e(self.content,{
						webkitTransition:'-webkit-transform '+dur+'ms cubic-bezier(0,0,.2,1)',
						webkitTransform:'translate3d('+coords.base+'px,0,0)'
					});
				}

				if(n){
					if(n==0){
						_n=-9;
					}else{
						_n=n+9;
					}

					var l=function(){
						M.e(self.content,{
							webkitTransition:'-webkit-transform 100ms ease-out',
							webkitTransform:'translate3d('+n+'px,0,0)'
						});
						self.content.removeEventListener('webkitTransitionEnd',l);
					};

					self.content.addEventListener('webkitTransitionEnd',l);
					M.e(self.content,{
						webkitTransition:'-webkit-transform 100ms ease-out',
						webkitTransform:'translate3d('+_n+'px,0,0)'
					});
					coords.base=n;
				}
			}else if(!coords.blockEnd){
				M.up();
				if(e&&e.target&&e.target.react){
					e.target.react();
				}

			}

		};

	}

};

DirectorJS={
	req:[],
	userScope:{},
	formats:{},
	selfHosted:true,
	initReq:function(salt){
		var key=salt+Math.floor(Math.random()*1000);
		this.req[key]=new Object;
		this.req[key].params=[];
		return this.req[key];
	},
	conn:function(req){
		if(req){
			var handler=req.apiMethod+Math.floor(Math.random()*10000);
			req.params.push('callback='+handler);
			for(var i in this.formats){
				var f=this.formats[i];
				req.params.push('size['+i+']='+f);
			}

			if(this.previewFormat){
				req.params.push('preview='+this.previewFormat);
			}

			req.params=req.params.join('&');
			var qs='?'+req.params;
			var host=location.href.split('/m/')[0];
			if(this.selfHosted){
				host+='/index.php?';
			}

			var url=host+'/api/'+req.apiMethod+qs;
			var head=document.getElementsByTagName('head')[0];
			window[handler]=function(response){
				req.callback.apply(this,[response.data]);
				window[handler]=null;
				head.removeChild(script);
			};

			var script=document.createElement('script');
			script.src=url;
			head.appendChild(script);
		}

	},
	Format:{
		add:function(options){
			var defaults={
				square:0,
				quality:85,
				sharpening:1
			};

			for(var i in options){
				defaults[i]=options[i];
			}

			DirectorJS.formats[options.name]=[defaults.name,defaults.width,defaults.height,defaults.square,defaults.quality,defaults.sharpening].join(',');
		},
		preview:function(options){
			var defaults={
				square:0,
				quality:85,
				sharpening:1
			};

			for(var i in options){
				defaults[i]=options[i];
			}

			DirectorJS.previewFormat=[defaults.width,defaults.height,defaults.square,defaults.quality,defaults.sharpening].join(',');
		}
	},
	Album:{
		get:function(id,callback,options){
			var req=DirectorJS.initReq('album.get.');
			var defaults={
				only_active:1
			};

			DirectorJS.prepAndSendObjs(defaults,options,req);
			req.apiMethod='get_album';
			req.callback=callback;
			req.params.push("album_id="+id);
			DirectorJS.conn(req);
		}
	},
	Gallery:{
		get:function(id,callback,options){
			var req=DirectorJS.initReq('gallery.get.');
			var defaults={
				limit:null,
				order:'display',
				with_content:true
			};

			DirectorJS.prepAndSendObjs(defaults,options,req);
			req.apiMethod='get_gallery';
			req.callback=callback;
			req.params.push("gallery_id="+id);
			DirectorJS.conn(req);
		},
	},
	prepAndSendObjs:function(obj1,obj2,req){
		if(typeof obj2=='object'){
			if(typeof obj2.tags=='object'){
				var tmp={};

				var tags=obj2.tags[0];
				var all;
				if(obj2.tags[1]=='all'){
					all=1;
				}else{
					all=0;
				}

				obj2.tags=tags;
				obj2.tags_exclusive=all;
			}

			if(typeof obj2.scope=='object'){
				var tmp={};

				var scope=obj2.scope[0];
				var scope_id=obj2.scope[1];
				obj2.scope=scope;
				obj2.scope_id=scope_id;
			}

			for(var i in obj2){
				obj1[i]=obj2[i];
			}

		}

		for(var i in obj1){
			if(i=='sort_on'&&obj1[i]=='random'){
				req.params.push('buster='+String(Math.round(Math.random()*10)));
			}

			if(String(obj1[i])=='true'||String(obj1[i])=='false'){
				obj1[i]=Number(obj1[i]);
			}

			req.params.push(i+'='+obj1[i]);
		}

	}
};

M.graphics={
	videoControlsPlay:'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAAQCAYAAADNo/U5AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RjM5RTJCMjg2ODMwMTFERjhDRUJEQzJBMjRGNjk4MjUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RjM5RTJCMjk2ODMwMTFERjhDRUJEQzJBMjRGNjk4MjUiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo2NEMwQjVDRDY4MzAxMURGOENFQkRDMkEyNEY2OTgyNSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo2NEMwQjVDRTY4MzAxMURGOENFQkRDMkEyNEY2OTgyNSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PoXEy+QAAAExSURBVHjaYmBgYDgMxKuBWIWBWDBz1pz/be2d/2Vl5b4DuS1AzENQ08nTZ/+D8KEjx/5nZGb95+bmfgQUDsenhxGkAVngxYsXDFMmTWTYvXvXQSA3F4gvY2g6debcf2ymnTt3lqGnq/PfnTt3pgG5NUD8Ea7p9Nnz/3E549+/fwxrVq9imDF92vvPnz9XAIVmgTWdOXfhPyF/f/r4kWHK5EkM69atvQDkpjCeu3DpP7EhffPmDYbWlub3jOcvXiZaEwj8/v37IwsjIyPRGv7//3+XjY0tkyhNQMVfgepagLhPX1f7FwsTExMhPcuAuFhXW/MFTACfTaCQStfR0jiFLoGhCeiU90CxUm1N9bm4TEPW9BeIpwD59Voaah/xuZcFiK+BkhwonQEVXyMmFAECDADeJXX49/9vFgAAAABJRU5ErkJggg==)',
	videoControlsPause:'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAAQCAYAAADNo/U5AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpEREIzM0FFQ0NGMjA2ODExOTNDOUUzQjk5MkExMTUwQyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo1RURCQTQ2RjY4M0IxMURGOENFQkRDMkEyNEY2OTgyNSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo1RURCQTQ2RTY4M0IxMURGOENFQkRDMkEyNEY2OTgyNSIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1IE1hY2ludG9zaCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkREQjMzQUVDQ0YyMDY4MTE5M0M5RTNCOTkyQTExNTBDIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkREQjMzQUVDQ0YyMDY4MTE5M0M5RTNCOTkyQTExNTBDIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+dvSlDwAAAEpJREFUeNpi/P//PwOpgAVEMDIyIutkRFMDlwNawAjXdOLUGbgKCzMTFB3Icug24XQKNrlhq4mJiQmnJmxyQ8GmwauJkZysARBgAFShEOc7tFpgAAAAAElFTkSuQmCC)',
	videoClose:'url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxNS4wLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAgLS0+DQo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiIFsNCgk8IUVOVElUWSBuc19mbG93cyAiaHR0cDovL25zLmFkb2JlLmNvbS9GbG93cy8xLjAvIj4NCl0+DQo8c3ZnIHZlcnNpb249IjEuMSINCgkgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeG1sbnM6YT0iaHR0cDovL25zLmFkb2JlLmNvbS9BZG9iZVNWR1ZpZXdlckV4dGVuc2lvbnMvMy4wLyINCgkgeD0iMHB4IiB5PSIwcHgiIHdpZHRoPSI0N3B4IiBoZWlnaHQ9IjQ3cHgiIHZpZXdCb3g9Ii0wLjE4NjUyMzQgLTAuNjA5ODYzMyA0NyA0NyINCgkgb3ZlcmZsb3c9InZpc2libGUiIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgLTAuMTg2NTIzNCAtMC42MDk4NjMzIDQ3IDQ3IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxkZWZzPg0KPC9kZWZzPg0KPHBhdGggZmlsbD0iI0ZGRkZGRiIgZD0iTTIzLDBDMTAuMjk3ODUxNiwwLDAsMTAuMjk3MzYzMywwLDIzczEwLjI5Nzg1MTYsMjIuOTk5NTExNywyMywyMi45OTk1MTE3UzQ2LDM1LjcwMjYzNjcsNDYsMjMNCglTMzUuNzAyMTQ4NCwwLDIzLDB6IE0zNy40ODUzNTE2LDMxLjAxNTEzNjdsLTYuMzM2OTE0MSw2LjMzNzg5MDZsLTguMDMzNjkxNC04LjAzNTE1NjJsLTguMDMyNzE0OCw4LjAzNTE1NjJsLTYuMzM3NDAyMy02LjMzNzg5MDYNCglsOC4wMzMyMDMxLTguMDMzMjAzMWwtOC4wMzM2OTE0LTguMDM0MTc5N2w2LjMzNzQwMjMtNi4zMzc0MDIzbDguMDMzMjAzMSw4LjAzMzY5MTRsOC4wMzM2OTE0LTguMDMzNjkxNGw2LjMzNzg5MDYsNi4zMzc0MDIzDQoJbC04LjAzNDE3OTcsOC4wMzQxNzk3TDM3LjQ4NTM1MTYsMzEuMDE1MTM2N3oiLz4NCjwvc3ZnPg0K)',
	infoBttn:'url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxNS4wLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAgLS0+DQo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiIFsNCgk8IUVOVElUWSBuc19mbG93cyAiaHR0cDovL25zLmFkb2JlLmNvbS9GbG93cy8xLjAvIj4NCl0+DQo8c3ZnIHZlcnNpb249IjEuMSINCgkgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeG1sbnM6YT0iaHR0cDovL25zLmFkb2JlLmNvbS9BZG9iZVNWR1ZpZXdlckV4dGVuc2lvbnMvMy4wLyINCgkgeD0iMHB4IiB5PSIwcHgiIHdpZHRoPSIzOHB4IiBoZWlnaHQ9IjM4cHgiIHZpZXdCb3g9Ii0wLjQ5NTExNzIgLTAuNSAzOCAzOCINCgkgb3ZlcmZsb3c9InZpc2libGUiIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgLTAuNDk1MTE3MiAtMC41IDM4IDM4IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxkZWZzPg0KPC9kZWZzPg0KPGNpcmNsZSBvcGFjaXR5PSIwLjIiIGN4PSIxOC41IiBjeT0iMTguNSIgcj0iMTguNSIvPg0KPGc+DQoJDQoJCTxsaW5lYXJHcmFkaWVudCBpZD0iU1ZHSURfMV8iIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiB4MT0iLTcyLjM4NjcxODgiIHkxPSItODEuNDk5MDIzNCIgeDI9Ii0zOC42MDQ5ODA1IiB5Mj0iLTgxLjQ5OTAyMzQiIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMCAxIC0xIDAgLTYyLjk5NTExNzIgNzMuOTk1NjA1NSkiPg0KCQk8c3RvcCAgb2Zmc2V0PSIwIiBzdHlsZT0ic3RvcC1jb2xvcjojNDU0OTREIi8+DQoJCTxzdG9wICBvZmZzZXQ9IjEiIHN0eWxlPSJzdG9wLWNvbG9yOiMwMDAwMDAiLz4NCgk8L2xpbmVhckdyYWRpZW50Pg0KCTxjaXJjbGUgZmlsbD0idXJsKCNTVkdJRF8xXykiIGN4PSIxOC41MDM5MDYyIiBjeT0iMTguNDk5NzU1OSIgcj0iMTYuODkwODY5MSIvPg0KCQ0KCQk8bGluZWFyR3JhZGllbnQgaWQ9IlNWR0lEXzJfIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDE9Ii03Mi4zODY3MTg4IiB5MT0iLTgxLjQ5OTAyMzQiIHgyPSItMzguNjA0OTgwNSIgeTI9Ii04MS40OTkwMjM0IiBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDAgMSAtMSAwIC02Mi45OTUxMTcyIDczLjk5NTYwNTUpIj4NCgkJPHN0b3AgIG9mZnNldD0iMCIgc3R5bGU9InN0b3AtY29sb3I6IzMxMzUzOSIvPg0KCQk8c3RvcCAgb2Zmc2V0PSIxIiBzdHlsZT0ic3RvcC1jb2xvcjojMDAwMDAwIi8+DQoJPC9saW5lYXJHcmFkaWVudD4NCgk8Y2lyY2xlIGZpbGw9InVybCgjU1ZHSURfMl8pIiBjeD0iMTguNTAzOTA2MiIgY3k9IjE4LjQ5OTc1NTkiIHI9IjE2Ljg5MDg2OTEiLz4NCjwvZz4NCjxnPg0KCQ0KCQk8bGluZWFyR3JhZGllbnQgaWQ9IlNWR0lEXzNfIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDE9Ii03MS45ODQ4NjMzIiB5MT0iLTgxLjQ5OTAyMzQiIHgyPSItMzkuMDA2MzQ3NyIgeTI9Ii04MS40OTkwMjM0IiBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDAgMSAtMSAwIC02Mi45OTUxMTcyIDczLjk5NTYwNTUpIj4NCgkJPHN0b3AgIG9mZnNldD0iMCIgc3R5bGU9InN0b3AtY29sb3I6IzQ1NDk0RCIvPg0KCQk8c3RvcCAgb2Zmc2V0PSIxIiBzdHlsZT0ic3RvcC1jb2xvcjojMDAwMDAwIi8+DQoJPC9saW5lYXJHcmFkaWVudD4NCgk8Y2lyY2xlIGZpbGw9InVybCgjU1ZHSURfM18pIiBjeD0iMTguNTAzOTA2MiIgY3k9IjE4LjUiIHI9IjE2LjQ4OTI1NzgiLz4NCjwvZz4NCjxwYXRoIG9wYWNpdHk9IjAuMTIiIGZpbGw9IiNGRkZGRkYiIGQ9Ik0xOC41MDM5MDYyLDM0Ljk4OTI1NzhjLTkuMDkyMjg1MiwwLTE2LjQ4OTI1NzgtNy4zOTc0NjA5LTE2LjQ4OTI1NzgtMTYuNDg5MjU3OA0KCWMwLTkuMDkyMjg1Miw3LjM5Njk3MjctMTYuNDg5MjU3OCwxNi40ODkyNTc4LTE2LjQ4OTI1NzhjOS4wOTI3NzM0LDAsMTYuNDg5MjU3OCw3LjM5Njk3MjcsMTYuNDg5MjU3OCwxNi40ODkyNTc4DQoJQzM0Ljk5MzE2NDEsMjcuNTkxNzk2OSwyNy41OTY2Nzk3LDM0Ljk4OTI1NzgsMTguNTAzOTA2MiwzNC45ODkyNTc4eiBNMTguNTAzOTA2MiwyLjgzNTQ0OTINCglDOS44NjY2OTkyLDIuODM1NDQ5MiwyLjgzOTM1NTUsOS44NjI3OTMsMi44MzkzNTU1LDE4LjVjMCw4LjYzNjcxODgsNy4wMjczNDM4LDE1LjY2NDA2MjUsMTUuNjY0NTUwOCwxNS42NjQwNjI1DQoJYzguNjM3Njk1MywwLDE1LjY2NTAzOTEtNy4wMjczNDM4LDE1LjY2NTAzOTEtMTUuNjY0MDYyNUMzNC4xNjg5NDUzLDkuODYyNzkzLDI3LjE0MTYwMTYsMi44MzU0NDkyLDE4LjUwMzkwNjIsMi44MzU0NDkyeiIvPg0KPGc+DQoJPGcgb3BhY2l0eT0iMC41Ij4NCgkJPHBhdGggZD0iTTE5LjMyOTEwMTYsMTEuOTY4NzVjMC4wMTI2OTUzLDAsMC4wMjUzOTA2LDAsMC4wMzcxMDk0LDBjMS40MzU1NDY5LTAuMDA0ODgyOCwyLjQ2NDg0MzgtMS4yMjk5ODA1LDIuNDY0ODQzOC0yLjUyNTM5MDYNCgkJCWMwLTAuNS0wLjE0NDUzMTItMC45ODY4MTY0LTAuNDU4MDA3OC0xLjM1NjQ0NTNjLTAuMzEzNDc2Ni0wLjM3MDYwNTUtMC43OTk4MDQ3LTAuNjA3OTEwMi0xLjQxMzA4NTktMC42MDU0Njg4DQoJCQljLTEuNjIyNTU4NiwwLjAwNjgzNTktMi40NjUzMzIsMS4zODgxODM2LTIuNDY2Nzk2OSwyLjQzNjAzNTJDMTcuNTAwNDg4MywxMS4xMzMzMDA4LDE4LjIwMzYxMzMsMTEuOTY4NzUsMTkuMzI5MTAxNiwxMS45Njg3NXoiDQoJCQkvPg0KCQk8cGF0aCBkPSJNMjEuODM2OTE0MSwyNC40MjU3ODEybC0wLjY0MDYyNS0xLjQwNjI1bC0wLjE4MzU5MzgsMC4xNjYwMTU2DQoJCQljLTAuNzc1MzkwNiwwLjcxNDg0MzgtMS45NzQ2MDk0LDEuNTM3MTA5NC0yLjE1NTc2MTcsMS41NTg1OTM4Yy0wLjAwODMwMDgtMC4wMjUzOTA2LTAuMDIwMDE5NS0wLjA4MjAzMTItMC4wMTkwNDMtMC4xNjg5NDUzDQoJCQljMC0wLjE1MjM0MzgsMC4wMzE3MzgzLTAuMzkzNTU0NywwLjExMjc5My0wLjcyMzYzMjhsMS42ODg5NjQ4LTYuODc2NDY0OA0KCQkJYzAuMTQ4NDM3NS0wLjY0MDYyNSwwLjIyNjU2MjUtMS42Mjg0MTgsMC4yMjY1NjI1LTIuMTAxNTYyNWMwLTAuNDM0NTcwMy0wLjA2NDQ1MzEtMC43OTU0MTAyLTAuMjI4NTE1Ni0xLjA3MzI0MjINCgkJCWMtMC4xNTkxNzk3LTAuMjgxMjUtMC40NTYwNTQ3LTAuNDU1NTY2NC0wLjc5Njg3NS0wLjQ1MDE5NTNjLTEuMTk0ODI0MiwwLjAxNDY0ODQtMy43OTkzMTY0LDEuNjIwNjA1NS01Ljk2NTgyMDMsMy42MjUNCgkJCWwtMC4xMTc2NzU4LDAuMTA4ODg2N2wwLjYwMDA5NzcsMS42Mjg0MThsMC4yMDQxMDE2LTAuMTUzMzIwM2MwLjU3ODEyNS0wLjQ0OTcwNywxLjc0OTAyMzQtMS4zMDcxMjg5LDIuMDE1NjI1LTEuNDAyODMyDQoJCQljLTAuMDAyNDQxNCwwLjEzMzc4OTEtMC4wNDM0NTcsMC4zOTM1NTQ3LTAuMTE3Njc1OCwwLjc2MzY3MTlsLTEuNTQwNTI3Myw2LjYzMjgxMjUNCgkJCWMtMC4xNzQzMTY0LDAuNzI4NTE1Ni0wLjI1MTQ2NDgsMS43MzYzMjgxLTAuMjUxNDY0OCwyLjIwMzEyNWMwLDAuNjA5Mzc1LDAuMTMzMzAwOCwxLjAzNzEwOTQsMC4zOTA2MjUsMS4zMTY0MDYyDQoJCQljMC4yNTY4MzU5LDAuMjc5Mjk2OSwwLjYxMDM1MTYsMC4zNjkxNDA2LDAuOTUxNjYwMiwwLjM2OTE0MDZjMC4wMDE5NTMxLDAsMC4wMDM0MTgsMCwwLjAwNTg1OTQsMA0KCQkJYzEuMDA3MzI0Mi0wLjAxMTcxODgsMy42NTUyNzM0LTEuNDExMTMyOCw1LjgwMTc1NzgtMy43NTU4NTk0TDIxLjkyNzczNDQsMjQuNTYyNUwyMS44MzY5MTQxLDI0LjQyNTc4MTJ6Ii8+DQoJPC9nPg0KCTxnPg0KCQk8Zz4NCgkJCTxwYXRoIGZpbGw9IiNGRkZGRkYiIGQ9Ik0xOS44MjkxMDE2LDEyLjQ2ODc1YzAuMDEyNjk1MywwLDAuMDI1MzkwNiwwLDAuMDM3MTA5NCwwDQoJCQkJYzEuNDM1NTQ2OS0wLjAwNDg4MjgsMi40NjQ4NDM4LTEuMjI5OTgwNSwyLjQ2NDg0MzgtMi41MjUzOTA2YzAtMC41LTAuMTQ0NTMxMi0wLjk4NjgxNjQtMC40NTgwMDc4LTEuMzU2NDQ1Mw0KCQkJCWMtMC4zMTM0NzY2LTAuMzcwNjA1NS0wLjc5OTgwNDctMC42MDc5MTAyLTEuNDEzMDg1OS0wLjYwNTQ2ODhjLTEuNjIyNTU4NiwwLjAwNjgzNTktMi40NjUzMzIsMS4zODgxODM2LTIuNDY2Nzk2OSwyLjQzNjAzNTINCgkJCQlDMTguMDAwNDg4MywxMS42MzMzMDA4LDE4LjcwMzYxMzMsMTIuNDY4NzUsMTkuODI5MTAxNiwxMi40Njg3NXoiLz4NCgkJCTxwYXRoIGZpbGw9IiNGRkZGRkYiIGQ9Ik0yMi4zMzY5MTQxLDI0LjkyNTc4MTJsLTAuNjQwNjI1LTEuNDA2MjVsLTAuMTgzNTkzOCwwLjE2NjAxNTYNCgkJCQljLTAuNzc1MzkwNiwwLjcxNDg0MzgtMS45NzQ2MDk0LDEuNTM3MTA5NC0yLjE1NTc2MTcsMS41NTg1OTM4Yy0wLjAwODMwMDgtMC4wMjUzOTA2LTAuMDIwMDE5NS0wLjA4MjAzMTItMC4wMTkwNDMtMC4xNjg5NDUzDQoJCQkJYzAtMC4xNTIzNDM4LDAuMDMxNzM4My0wLjM5MzU1NDcsMC4xMTI3OTMtMC43MjM2MzI4bDEuNjg4OTY0OC02Ljg3NjQ2NDgNCgkJCQljMC4xNDg0Mzc1LTAuNjQwNjI1LDAuMjI2NTYyNS0xLjYyODQxOCwwLjIyNjU2MjUtMi4xMDE1NjI1YzAtMC40MzQ1NzAzLTAuMDY0NDUzMS0wLjc5NTQxMDItMC4yMjg1MTU2LTEuMDczMjQyMg0KCQkJCWMtMC4xNTkxNzk3LTAuMjgxMjUtMC40NTYwNTQ3LTAuNDU1NTY2NC0wLjc5Njg3NS0wLjQ1MDE5NTNjLTEuMTk0ODI0MiwwLjAxNDY0ODQtMy43OTkzMTY0LDEuNjIwNjA1NS01Ljk2NTgyMDMsMy42MjUNCgkJCQlsLTAuMTE3Njc1OCwwLjEwODg4NjdsMC42MDAwOTc3LDEuNjI4NDE4bDAuMjA0MTAxNi0wLjE1MzMyMDNjMC41NzgxMjUtMC40NDk3MDcsMS43NDkwMjM0LTEuMzA3MTI4OSwyLjAxNTYyNS0xLjQwMjgzMg0KCQkJCWMtMC4wMDI0NDE0LDAuMTMzNzg5MS0wLjA0MzQ1NywwLjM5MzU1NDctMC4xMTc2NzU4LDAuNzYzNjcxOWwtMS41NDA1MjczLDYuNjMyODEyNQ0KCQkJCWMtMC4xNzQzMTY0LDAuNzI4NTE1Ni0wLjI1MTQ2NDgsMS43MzYzMjgxLTAuMjUxNDY0OCwyLjIwMzEyNWMwLDAuNjA5Mzc1LDAuMTMzMzAwOCwxLjAzNzEwOTQsMC4zOTA2MjUsMS4zMTY0MDYyDQoJCQkJYzAuMjU2ODM1OSwwLjI3OTI5NjksMC42MTAzNTE2LDAuMzY5MTQwNiwwLjk1MTY2MDIsMC4zNjkxNDA2YzAuMDAxOTUzMSwwLDAuMDAzNDE4LDAsMC4wMDU4NTk0LDANCgkJCQljMS4wMDczMjQyLTAuMDExNzE4OCwzLjY1NTI3MzQtMS40MTExMzI4LDUuODAxNzU3OC0zLjc1NTg1OTRMMjIuNDI3NzM0NCwyNS4wNjI1TDIyLjMzNjkxNDEsMjQuOTI1NzgxMnoiLz4NCgkJPC9nPg0KCTwvZz4NCjwvZz4NCjwvc3ZnPg0K)',
	closeBttn:'url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxNS4wLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAgLS0+DQo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiIFsNCgk8IUVOVElUWSBuc19mbG93cyAiaHR0cDovL25zLmFkb2JlLmNvbS9GbG93cy8xLjAvIj4NCl0+DQo8c3ZnIHZlcnNpb249IjEuMSINCgkgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeG1sbnM6YT0iaHR0cDovL25zLmFkb2JlLmNvbS9BZG9iZVNWR1ZpZXdlckV4dGVuc2lvbnMvMy4wLyINCgkgeD0iMHB4IiB5PSIwcHgiIHdpZHRoPSIzOHB4IiBoZWlnaHQ9IjM4cHgiIHZpZXdCb3g9Ii0wLjQ5NTExNzIgLTAuNSAzOCAzOCINCgkgb3ZlcmZsb3c9InZpc2libGUiIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgLTAuNDk1MTE3MiAtMC41IDM4IDM4IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxkZWZzPg0KPC9kZWZzPg0KPGNpcmNsZSBvcGFjaXR5PSIwLjIiIGN4PSIxOC41IiBjeT0iMTguNSIgcj0iMTguNSIvPg0KPGc+DQoJDQoJCTxsaW5lYXJHcmFkaWVudCBpZD0iU1ZHSURfMV8iIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiB4MT0iLTcyLjM4NjcxODgiIHkxPSItODEuNDk5MDIzNCIgeDI9Ii0zOC42MDQ5ODA1IiB5Mj0iLTgxLjQ5OTAyMzQiIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMCAxIC0xIDAgLTYyLjk5NTExNzIgNzMuOTk1NjA1NSkiPg0KCQk8c3RvcCAgb2Zmc2V0PSIwIiBzdHlsZT0ic3RvcC1jb2xvcjojNDU0OTREIi8+DQoJCTxzdG9wICBvZmZzZXQ9IjEiIHN0eWxlPSJzdG9wLWNvbG9yOiMwMDAwMDAiLz4NCgk8L2xpbmVhckdyYWRpZW50Pg0KCTxjaXJjbGUgZmlsbD0idXJsKCNTVkdJRF8xXykiIGN4PSIxOC41MDM5MDYyIiBjeT0iMTguNDk5NzU1OSIgcj0iMTYuODkwODY5MSIvPg0KCQ0KCQk8bGluZWFyR3JhZGllbnQgaWQ9IlNWR0lEXzJfIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDE9Ii03Mi4zODY3MTg4IiB5MT0iLTgxLjQ5OTAyMzQiIHgyPSItMzguNjA0OTgwNSIgeTI9Ii04MS40OTkwMjM0IiBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDAgMSAtMSAwIC02Mi45OTUxMTcyIDczLjk5NTYwNTUpIj4NCgkJPHN0b3AgIG9mZnNldD0iMCIgc3R5bGU9InN0b3AtY29sb3I6IzMxMzUzOSIvPg0KCQk8c3RvcCAgb2Zmc2V0PSIxIiBzdHlsZT0ic3RvcC1jb2xvcjojMDAwMDAwIi8+DQoJPC9saW5lYXJHcmFkaWVudD4NCgk8Y2lyY2xlIGZpbGw9InVybCgjU1ZHSURfMl8pIiBjeD0iMTguNTAzOTA2MiIgY3k9IjE4LjQ5OTc1NTkiIHI9IjE2Ljg5MDg2OTEiLz4NCjwvZz4NCjxnPg0KCQ0KCQk8bGluZWFyR3JhZGllbnQgaWQ9IlNWR0lEXzNfIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDE9Ii03MS45ODQ4NjMzIiB5MT0iLTgxLjQ5OTAyMzQiIHgyPSItMzkuMDA2MzQ3NyIgeTI9Ii04MS40OTkwMjM0IiBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDAgMSAtMSAwIC02Mi45OTUxMTcyIDczLjk5NTYwNTUpIj4NCgkJPHN0b3AgIG9mZnNldD0iMCIgc3R5bGU9InN0b3AtY29sb3I6IzQ1NDk0RCIvPg0KCQk8c3RvcCAgb2Zmc2V0PSIxIiBzdHlsZT0ic3RvcC1jb2xvcjojMDAwMDAwIi8+DQoJPC9saW5lYXJHcmFkaWVudD4NCgk8Y2lyY2xlIGZpbGw9InVybCgjU1ZHSURfM18pIiBjeD0iMTguNTAzOTA2MiIgY3k9IjE4LjUiIHI9IjE2LjQ4OTI1NzgiLz4NCjwvZz4NCjxwYXRoIG9wYWNpdHk9IjAuMTIiIGZpbGw9IiNGRkZGRkYiIGQ9Ik0xOC41MDM5MDYyLDM0Ljk4OTI1NzhjLTkuMDkyMjg1MiwwLTE2LjQ4OTI1NzgtNy4zOTc0NjA5LTE2LjQ4OTI1NzgtMTYuNDg5MjU3OA0KCWMwLTkuMDkyMjg1Miw3LjM5Njk3MjctMTYuNDg5MjU3OCwxNi40ODkyNTc4LTE2LjQ4OTI1NzhjOS4wOTI3NzM0LDAsMTYuNDg5MjU3OCw3LjM5Njk3MjcsMTYuNDg5MjU3OCwxNi40ODkyNTc4DQoJQzM0Ljk5MzE2NDEsMjcuNTkxNzk2OSwyNy41OTY2Nzk3LDM0Ljk4OTI1NzgsMTguNTAzOTA2MiwzNC45ODkyNTc4eiBNMTguNTAzOTA2MiwyLjgzNTQ0OTINCglDOS44NjY2OTkyLDIuODM1NDQ5MiwyLjgzOTM1NTUsOS44NjI3OTMsMi44MzkzNTU1LDE4LjVjMCw4LjYzNjcxODgsNy4wMjczNDM4LDE1LjY2NDA2MjUsMTUuNjY0NTUwOCwxNS42NjQwNjI1DQoJYzguNjM3Njk1MywwLDE1LjY2NTAzOTEtNy4wMjczNDM4LDE1LjY2NTAzOTEtMTUuNjY0MDYyNUMzNC4xNjg5NDUzLDkuODYyNzkzLDI3LjE0MTYwMTYsMi44MzU0NDkyLDE4LjUwMzkwNjIsMi44MzU0NDkyeiIvPg0KPGc+DQoJPGcgb3BhY2l0eT0iMC41Ij4NCgkJPHBvbHlnb24gcG9pbnRzPSIyNi4wMDI5Mjk3LDEzLjUyODgwODYgMjIuNDc1NTg1OSwxMC4wMDA5NzY2IDE4LjAwMjkyOTcsMTQuNDcyNjU2MiAxMy41MjkyOTY5LDEwLjAwMDk3NjYgDQoJCQkxMC4wMDI5Mjk3LDEzLjUyODgwODYgMTQuNDc0MTIxMSwxOC4wMDA5NzY2IDEwLjAwMjkyOTcsMjIuNDcyNjU2MiAxMy41MjkyOTY5LDI2LjAwMDk3NjYgMTguMDAyOTI5NywyMS41MjkyOTY5IA0KCQkJMjIuNDczNjMyOCwyNi4wMDA5NzY2IDI2LjAwMjkyOTcsMjIuNDcyNjU2MiAyMS41MzAyNzM0LDE4LjAwMDk3NjYgCQkiLz4NCgk8L2c+DQoJPGc+DQoJCTxwb2x5Z29uIGZpbGw9IiNGRkZGRkYiIHBvaW50cz0iMjYuNTAyOTI5NywxNC4wMjg4MDg2IDIyLjk3NTU4NTksMTAuNTAwOTc2NiAxOC41MDI5Mjk3LDE0Ljk3MjY1NjIgMTQuMDI5Mjk2OSwxMC41MDA5NzY2IA0KCQkJMTAuNTAyOTI5NywxNC4wMjg4MDg2IDE0Ljk3NDEyMTEsMTguNTAwOTc2NiAxMC41MDI5Mjk3LDIyLjk3MjY1NjIgMTQuMDI5Mjk2OSwyNi41MDA5NzY2IDE4LjUwMjkyOTcsMjIuMDI5Mjk2OSANCgkJCTIyLjk3MzYzMjgsMjYuNTAwOTc2NiAyNi41MDI5Mjk3LDIyLjk3MjY1NjIgMjIuMDMwMjczNCwxOC41MDA5NzY2IAkJIi8+DQoJPC9nPg0KPC9nPg0KPC9zdmc+DQo=)',
	playBttn:'url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxNS4wLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAgLS0+DQo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiIFsNCgk8IUVOVElUWSBuc19mbG93cyAiaHR0cDovL25zLmFkb2JlLmNvbS9GbG93cy8xLjAvIj4NCl0+DQo8c3ZnIHZlcnNpb249IjEuMSINCgkgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeG1sbnM6YT0iaHR0cDovL25zLmFkb2JlLmNvbS9BZG9iZVNWR1ZpZXdlckV4dGVuc2lvbnMvMy4wLyINCgkgeD0iMHB4IiB5PSIwcHgiIHdpZHRoPSIzOHB4IiBoZWlnaHQ9IjM4cHgiIHZpZXdCb3g9Ii0wLjQ5NTExNzIgLTAuNSAzOCAzOCINCgkgb3ZlcmZsb3c9InZpc2libGUiIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgLTAuNDk1MTE3MiAtMC41IDM4IDM4IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxkZWZzPg0KPC9kZWZzPg0KPGNpcmNsZSBvcGFjaXR5PSIwLjIiIGN4PSIxOC41IiBjeT0iMTguNSIgcj0iMTguNSIvPg0KPGc+DQoJDQoJCTxsaW5lYXJHcmFkaWVudCBpZD0iU1ZHSURfMV8iIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiB4MT0iLTcyLjM4NjcxODgiIHkxPSItODEuNDk5MDIzNCIgeDI9Ii0zOC42MDQ5ODA1IiB5Mj0iLTgxLjQ5OTAyMzQiIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMCAxIC0xIDAgLTYyLjk5NTExNzIgNzMuOTk1NjA1NSkiPg0KCQk8c3RvcCAgb2Zmc2V0PSIwIiBzdHlsZT0ic3RvcC1jb2xvcjojNDU0OTREIi8+DQoJCTxzdG9wICBvZmZzZXQ9IjEiIHN0eWxlPSJzdG9wLWNvbG9yOiMwMDAwMDAiLz4NCgk8L2xpbmVhckdyYWRpZW50Pg0KCTxjaXJjbGUgZmlsbD0idXJsKCNTVkdJRF8xXykiIGN4PSIxOC41MDM5MDYyIiBjeT0iMTguNDk5NzU1OSIgcj0iMTYuODkwODY5MSIvPg0KCQ0KCQk8bGluZWFyR3JhZGllbnQgaWQ9IlNWR0lEXzJfIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDE9Ii03Mi4zODY3MTg4IiB5MT0iLTgxLjQ5OTAyMzQiIHgyPSItMzguNjA0OTgwNSIgeTI9Ii04MS40OTkwMjM0IiBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDAgMSAtMSAwIC02Mi45OTUxMTcyIDczLjk5NTYwNTUpIj4NCgkJPHN0b3AgIG9mZnNldD0iMCIgc3R5bGU9InN0b3AtY29sb3I6IzMxMzUzOSIvPg0KCQk8c3RvcCAgb2Zmc2V0PSIxIiBzdHlsZT0ic3RvcC1jb2xvcjojMDAwMDAwIi8+DQoJPC9saW5lYXJHcmFkaWVudD4NCgk8Y2lyY2xlIGZpbGw9InVybCgjU1ZHSURfMl8pIiBjeD0iMTguNTAzOTA2MiIgY3k9IjE4LjQ5OTc1NTkiIHI9IjE2Ljg5MDg2OTEiLz4NCjwvZz4NCjxnPg0KCQ0KCQk8bGluZWFyR3JhZGllbnQgaWQ9IlNWR0lEXzNfIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDE9Ii03MS45ODQ4NjMzIiB5MT0iLTgxLjQ5OTAyMzQiIHgyPSItMzkuMDA2MzQ3NyIgeTI9Ii04MS40OTkwMjM0IiBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDAgMSAtMSAwIC02Mi45OTUxMTcyIDczLjk5NTYwNTUpIj4NCgkJPHN0b3AgIG9mZnNldD0iMCIgc3R5bGU9InN0b3AtY29sb3I6IzQ1NDk0RCIvPg0KCQk8c3RvcCAgb2Zmc2V0PSIxIiBzdHlsZT0ic3RvcC1jb2xvcjojMDAwMDAwIi8+DQoJPC9saW5lYXJHcmFkaWVudD4NCgk8Y2lyY2xlIGZpbGw9InVybCgjU1ZHSURfM18pIiBjeD0iMTguNTAzOTA2MiIgY3k9IjE4LjUiIHI9IjE2LjQ4OTI1NzgiLz4NCjwvZz4NCjxwYXRoIG9wYWNpdHk9IjAuMTIiIGZpbGw9IiNGRkZGRkYiIGQ9Ik0xOC41MDM5MDYyLDM0Ljk4OTI1NzhjLTkuMDkyMjg1MiwwLTE2LjQ4OTI1NzgtNy4zOTc0NjA5LTE2LjQ4OTI1NzgtMTYuNDg5MjU3OA0KCWMwLTkuMDkyMjg1Miw3LjM5Njk3MjctMTYuNDg5MjU3OCwxNi40ODkyNTc4LTE2LjQ4OTI1NzhjOS4wOTI3NzM0LDAsMTYuNDg5MjU3OCw3LjM5Njk3MjcsMTYuNDg5MjU3OCwxNi40ODkyNTc4DQoJQzM0Ljk5MzE2NDEsMjcuNTkxNzk2OSwyNy41OTY2Nzk3LDM0Ljk4OTI1NzgsMTguNTAzOTA2MiwzNC45ODkyNTc4eiBNMTguNTAzOTA2MiwyLjgzNTQ0OTINCglDOS44NjY2OTkyLDIuODM1NDQ5MiwyLjgzOTM1NTUsOS44NjI3OTMsMi44MzkzNTU1LDE4LjVjMCw4LjYzNjcxODgsNy4wMjczNDM4LDE1LjY2NDA2MjUsMTUuNjY0NTUwOCwxNS42NjQwNjI1DQoJYzguNjM3Njk1MywwLDE1LjY2NTAzOTEtNy4wMjczNDM4LDE1LjY2NTAzOTEtMTUuNjY0MDYyNUMzNC4xNjg5NDUzLDkuODYyNzkzLDI3LjE0MTYwMTYsMi44MzU0NDkyLDE4LjUwMzkwNjIsMi44MzU0NDkyeiIvPg0KPGc+DQoJPGcgb3BhY2l0eT0iMC41Ij4NCgkJPHBvbHlnb24gcG9pbnRzPSIxMy4zNzQ1MTE3LDExLjUxOTUzMTIgMTMuMzc0NTExNywyNC41MTk1MzEyIDI2LjM3NDAyMzQsMTguMDI5Nzg1MiAJCSIvPg0KCTwvZz4NCgk8Zz4NCgkJPHBvbHlnb24gZmlsbD0iI0ZGRkZGRiIgcG9pbnRzPSIxMy44NzQ1MTE3LDEyLjAxOTUzMTIgMTMuODc0NTExNywyNS4wMTk1MzEyIDI2Ljg3NDAyMzQsMTguNTI5Nzg1MiAJCSIvPg0KCTwvZz4NCjwvZz4NCjwvc3ZnPg0K)',
	pauseBttn:'url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxNS4wLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAgLS0+DQo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiIFsNCgk8IUVOVElUWSBuc19mbG93cyAiaHR0cDovL25zLmFkb2JlLmNvbS9GbG93cy8xLjAvIj4NCl0+DQo8c3ZnIHZlcnNpb249IjEuMSINCgkgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeG1sbnM6YT0iaHR0cDovL25zLmFkb2JlLmNvbS9BZG9iZVNWR1ZpZXdlckV4dGVuc2lvbnMvMy4wLyINCgkgeD0iMHB4IiB5PSIwcHgiIHdpZHRoPSIzOHB4IiBoZWlnaHQ9IjM4cHgiIHZpZXdCb3g9Ii0wLjQ5NTExNzIgLTAuNSAzOCAzOCINCgkgb3ZlcmZsb3c9InZpc2libGUiIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgLTAuNDk1MTE3MiAtMC41IDM4IDM4IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxkZWZzPg0KPC9kZWZzPg0KPGNpcmNsZSBvcGFjaXR5PSIwLjIiIGN4PSIxOC41IiBjeT0iMTguNSIgcj0iMTguNSIvPg0KPGc+DQoJDQoJCTxsaW5lYXJHcmFkaWVudCBpZD0iU1ZHSURfMV8iIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiB4MT0iLTcyLjM4NjcxODgiIHkxPSItODEuNDk5MDIzNCIgeDI9Ii0zOC42MDQ5ODA1IiB5Mj0iLTgxLjQ5OTAyMzQiIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMCAxIC0xIDAgLTYyLjk5NTExNzIgNzMuOTk1NjA1NSkiPg0KCQk8c3RvcCAgb2Zmc2V0PSIwIiBzdHlsZT0ic3RvcC1jb2xvcjojNDU0OTREIi8+DQoJCTxzdG9wICBvZmZzZXQ9IjEiIHN0eWxlPSJzdG9wLWNvbG9yOiMwMDAwMDAiLz4NCgk8L2xpbmVhckdyYWRpZW50Pg0KCTxjaXJjbGUgZmlsbD0idXJsKCNTVkdJRF8xXykiIGN4PSIxOC41MDM5MDYyIiBjeT0iMTguNDk5NzU1OSIgcj0iMTYuODkwODY5MSIvPg0KCQ0KCQk8bGluZWFyR3JhZGllbnQgaWQ9IlNWR0lEXzJfIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDE9Ii03Mi4zODY3MTg4IiB5MT0iLTgxLjQ5OTAyMzQiIHgyPSItMzguNjA0OTgwNSIgeTI9Ii04MS40OTkwMjM0IiBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDAgMSAtMSAwIC02Mi45OTUxMTcyIDczLjk5NTYwNTUpIj4NCgkJPHN0b3AgIG9mZnNldD0iMCIgc3R5bGU9InN0b3AtY29sb3I6IzMxMzUzOSIvPg0KCQk8c3RvcCAgb2Zmc2V0PSIxIiBzdHlsZT0ic3RvcC1jb2xvcjojMDAwMDAwIi8+DQoJPC9saW5lYXJHcmFkaWVudD4NCgk8Y2lyY2xlIGZpbGw9InVybCgjU1ZHSURfMl8pIiBjeD0iMTguNTAzOTA2MiIgY3k9IjE4LjQ5OTc1NTkiIHI9IjE2Ljg5MDg2OTEiLz4NCjwvZz4NCjxnPg0KCQ0KCQk8bGluZWFyR3JhZGllbnQgaWQ9IlNWR0lEXzNfIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDE9Ii03MS45ODQ4NjMzIiB5MT0iLTgxLjQ5OTAyMzQiIHgyPSItMzkuMDA2MzQ3NyIgeTI9Ii04MS40OTkwMjM0IiBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDAgMSAtMSAwIC02Mi45OTUxMTcyIDczLjk5NTYwNTUpIj4NCgkJPHN0b3AgIG9mZnNldD0iMCIgc3R5bGU9InN0b3AtY29sb3I6IzQ1NDk0RCIvPg0KCQk8c3RvcCAgb2Zmc2V0PSIxIiBzdHlsZT0ic3RvcC1jb2xvcjojMDAwMDAwIi8+DQoJPC9saW5lYXJHcmFkaWVudD4NCgk8Y2lyY2xlIGZpbGw9InVybCgjU1ZHSURfM18pIiBjeD0iMTguNTAzOTA2MiIgY3k9IjE4LjUiIHI9IjE2LjQ4OTI1NzgiLz4NCjwvZz4NCjxwYXRoIG9wYWNpdHk9IjAuMTIiIGZpbGw9IiNGRkZGRkYiIGQ9Ik0xOC41MDM5MDYyLDM0Ljk4OTI1NzhjLTkuMDkyMjg1MiwwLTE2LjQ4OTI1NzgtNy4zOTc0NjA5LTE2LjQ4OTI1NzgtMTYuNDg5MjU3OA0KCWMwLTkuMDkyMjg1Miw3LjM5Njk3MjctMTYuNDg5MjU3OCwxNi40ODkyNTc4LTE2LjQ4OTI1NzhjOS4wOTI3NzM0LDAsMTYuNDg5MjU3OCw3LjM5Njk3MjcsMTYuNDg5MjU3OCwxNi40ODkyNTc4DQoJQzM0Ljk5MzE2NDEsMjcuNTkxNzk2OSwyNy41OTY2Nzk3LDM0Ljk4OTI1NzgsMTguNTAzOTA2MiwzNC45ODkyNTc4eiBNMTguNTAzOTA2MiwyLjgzNTQ0OTINCglDOS44NjY2OTkyLDIuODM1NDQ5MiwyLjgzOTM1NTUsOS44NjI3OTMsMi44MzkzNTU1LDE4LjVjMCw4LjYzNjcxODgsNy4wMjczNDM4LDE1LjY2NDA2MjUsMTUuNjY0NTUwOCwxNS42NjQwNjI1DQoJYzguNjM3Njk1MywwLDE1LjY2NTAzOTEtNy4wMjczNDM4LDE1LjY2NTAzOTEtMTUuNjY0MDYyNUMzNC4xNjg5NDUzLDkuODYyNzkzLDI3LjE0MTYwMTYsMi44MzU0NDkyLDE4LjUwMzkwNjIsMi44MzU0NDkyeiIvPg0KPGc+DQoJPGcgb3BhY2l0eT0iMC41Ij4NCgkJPHJlY3QgeD0iMTEuNjI2OTUzMSIgeT0iMTAuNjY1MDM5MSIgd2lkdGg9IjQuODUwNTg1OSIgaGVpZ2h0PSIxNC40Nzc1MzkxIi8+DQoJCTxyZWN0IHg9IjE5LjcwODAwNzgiIHk9IjEwLjY2NTAzOTEiIHdpZHRoPSI0Ljg0OTYwOTQiIGhlaWdodD0iMTQuNDc3NTM5MSIvPg0KCTwvZz4NCgk8Zz4NCgkJPGc+DQoJCQk8cmVjdCB4PSIxMi4xMjY5NTMxIiB5PSIxMS4xNjUwMzkxIiBmaWxsPSIjRkZGRkZGIiB3aWR0aD0iNC44NTA1ODU5IiBoZWlnaHQ9IjE0LjQ3NzUzOTEiLz4NCgkJCTxyZWN0IHg9IjIwLjIwODAwNzgiIHk9IjExLjE2NTAzOTEiIGZpbGw9IiNGRkZGRkYiIHdpZHRoPSI0Ljg0OTYwOTQiIGhlaWdodD0iMTQuNDc3NTM5MSIvPg0KCQk8L2c+DQoJPC9nPg0KPC9nPg0KPC9zdmc+DQo=)',
	nextBttn:'url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxNS4wLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAgLS0+DQo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiIFsNCgk8IUVOVElUWSBuc19mbG93cyAiaHR0cDovL25zLmFkb2JlLmNvbS9GbG93cy8xLjAvIj4NCl0+DQo8c3ZnIHZlcnNpb249IjEuMSINCgkgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeG1sbnM6YT0iaHR0cDovL25zLmFkb2JlLmNvbS9BZG9iZVNWR1ZpZXdlckV4dGVuc2lvbnMvMy4wLyINCgkgeD0iMHB4IiB5PSIwcHgiIHdpZHRoPSI0NnB4IiBoZWlnaHQ9IjQ2cHgiIHZpZXdCb3g9IjAgMCA0NiA0NiIgb3ZlcmZsb3c9InZpc2libGUiIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDQ2IDQ2Ig0KCSB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxkZWZzPg0KPC9kZWZzPg0KPGNpcmNsZSBvcGFjaXR5PSIwLjIiIGN4PSIyMyIgY3k9IjIzIiByPSIyMyIvPg0KPGc+DQoJDQoJCTxsaW5lYXJHcmFkaWVudCBpZD0iU1ZHSURfMV8iIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiB4MT0iLTcyLjAwMDQ4ODMiIHkxPSItNzcuMDA0ODgyOCIgeDI9Ii0zMC4wMDA0ODgzIiB5Mj0iLTc3LjAwNDg4MjgiIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMCAxIC0xIDAgLTU0IDc0LjAwMDQ4ODMpIj4NCgkJPHN0b3AgIG9mZnNldD0iMCIgc3R5bGU9InN0b3AtY29sb3I6IzQ1NDk0RCIvPg0KCQk8c3RvcCAgb2Zmc2V0PSIxIiBzdHlsZT0ic3RvcC1jb2xvcjojMDAwMDAwIi8+DQoJPC9saW5lYXJHcmFkaWVudD4NCgk8Y2lyY2xlIGZpbGw9InVybCgjU1ZHSURfMV8pIiBjeD0iMjMuMDA0ODgyOCIgY3k9IjIzIiByPSIyMSIvPg0KCQ0KCQk8bGluZWFyR3JhZGllbnQgaWQ9IlNWR0lEXzJfIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDE9Ii03Mi4wMDA0ODgzIiB5MT0iLTc3LjAwNDg4MjgiIHgyPSItMzAuMDAwNDg4MyIgeTI9Ii03Ny4wMDQ4ODI4IiBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDAgMSAtMSAwIC01NCA3NC4wMDA0ODgzKSI+DQoJCTxzdG9wICBvZmZzZXQ9IjAiIHN0eWxlPSJzdG9wLWNvbG9yOiMzMTM1MzkiLz4NCgkJPHN0b3AgIG9mZnNldD0iMSIgc3R5bGU9InN0b3AtY29sb3I6IzAwMDAwMCIvPg0KCTwvbGluZWFyR3JhZGllbnQ+DQoJPGNpcmNsZSBmaWxsPSJ1cmwoI1NWR0lEXzJfKSIgY3g9IjIzLjAwNDg4MjgiIGN5PSIyMyIgcj0iMjEiLz4NCjwvZz4NCjxnPg0KCQ0KCQk8bGluZWFyR3JhZGllbnQgaWQ9IlNWR0lEXzNfIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDE9Ii03MS41MDA0ODgzIiB5MT0iLTc3LjAwNDg4MjgiIHgyPSItMzAuNTAwNDg4MyIgeTI9Ii03Ny4wMDQ4ODI4IiBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDAgMSAtMSAwIC01NCA3NC4wMDA0ODgzKSI+DQoJCTxzdG9wICBvZmZzZXQ9IjAiIHN0eWxlPSJzdG9wLWNvbG9yOiM0NTQ5NEQiLz4NCgkJPHN0b3AgIG9mZnNldD0iMSIgc3R5bGU9InN0b3AtY29sb3I6IzAwMDAwMCIvPg0KCTwvbGluZWFyR3JhZGllbnQ+DQoJPGNpcmNsZSBmaWxsPSJ1cmwoI1NWR0lEXzNfKSIgY3g9IjIzLjAwNDg4MjgiIGN5PSIyMyIgcj0iMjAuNSIvPg0KPC9nPg0KPGc+DQoJPGcgb3BhY2l0eT0iMC41Ij4NCgkJPHBvbHlnb24gcG9pbnRzPSIyNy44OTM1NTQ3LDE4LjI3NzgzMiAyNy44NzMwNDY5LDE4LjI5Nzg1MTYgMTkuODUxMDc0MiwxMC43MjE2Nzk3IDE1LjYwODM5ODQsMTQuNzI4NTE1NiAyMy42Mjk4ODI4LDIyLjMwNTE3NTggDQoJCQkxNS43MTU4MjAzLDI5Ljc3OTI5NjkgMTkuOTU4NDk2MSwzMy43ODcxMDk0IDMyLjEzNjcxODgsMjIuMjg0NjY4IAkJIi8+DQoJPC9nPg0KCTxnPg0KCQk8cG9seWdvbiBmaWxsPSIjRkZGRkZGIiBwb2ludHM9IjI4LjM5MzU1NDcsMTguNzc3ODMyIDI4LjM3MzA0NjksMTguNzk3ODUxNiAyMC4zNTEwNzQyLDExLjIyMTY3OTcgMTYuMTA4Mzk4NCwxNS4yMjg1MTU2IA0KCQkJMjQuMTI5ODgyOCwyMi44MDUxNzU4IDE2LjIxNTgyMDMsMzAuMjc5Mjk2OSAyMC40NTg0OTYxLDM0LjI4NzEwOTQgMzIuNjM2NzE4OCwyMi43ODQ2NjggCQkiLz4NCgk8L2c+DQo8L2c+DQo8cGF0aCBvcGFjaXR5PSIwLjEyIiBmaWxsPSIjRkZGRkZGIiBkPSJNMjMuMDA0ODgyOCw0My41Yy0xMS4zMDM3MTA5LDAtMjAuNS05LjE5NjI4OTEtMjAuNS0yMC41czkuMTk2Mjg5MS0yMC41LDIwLjUtMjAuNQ0KCXMyMC41LDkuMTk2Mjg5MSwyMC41LDIwLjVTMzQuMzA4NTkzOCw0My41LDIzLjAwNDg4MjgsNDMuNXogTTIzLjAwNDg4MjgsMy41MjQ5MDIzDQoJQzEyLjI2NjYwMTYsMy41MjQ5MDIzLDMuNTI5Nzg1MiwxMi4yNjE3MTg4LDMuNTI5Nzg1MiwyM3M4LjczNjgxNjQsMTkuNDc0NjA5NCwxOS40NzUwOTc3LDE5LjQ3NDYwOTQNCglTNDIuNDc5NDkyMiwzMy43MzgyODEyLDQyLjQ3OTQ5MjIsMjNTMzMuNzQzMTY0MSwzLjUyNDkwMjMsMjMuMDA0ODgyOCwzLjUyNDkwMjN6Ii8+DQo8L3N2Zz4NCg==)',
	prevBttn:'url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxNS4wLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAgLS0+DQo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiIFsNCgk8IUVOVElUWSBuc19mbG93cyAiaHR0cDovL25zLmFkb2JlLmNvbS9GbG93cy8xLjAvIj4NCl0+DQo8c3ZnIHZlcnNpb249IjEuMSINCgkgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeG1sbnM6YT0iaHR0cDovL25zLmFkb2JlLmNvbS9BZG9iZVNWR1ZpZXdlckV4dGVuc2lvbnMvMy4wLyINCgkgeD0iMHB4IiB5PSIwcHgiIHdpZHRoPSI0NnB4IiBoZWlnaHQ9IjQ2cHgiIHZpZXdCb3g9IjAgMCA0NiA0NiIgb3ZlcmZsb3c9InZpc2libGUiIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDQ2IDQ2Ig0KCSB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxkZWZzPg0KPC9kZWZzPg0KPGNpcmNsZSBvcGFjaXR5PSIwLjIiIGN4PSIyMyIgY3k9IjIzIiByPSIyMyIvPg0KPGc+DQoJDQoJCTxsaW5lYXJHcmFkaWVudCBpZD0iU1ZHSURfMV8iIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiB4MT0iLTcyLjAwMDQ4ODMiIHkxPSItNzcuMDA0ODgyOCIgeDI9Ii0zMC4wMDA0ODgzIiB5Mj0iLTc3LjAwNDg4MjgiIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMCAxIC0xIDAgLTU0IDc0LjAwMDQ4ODMpIj4NCgkJPHN0b3AgIG9mZnNldD0iMCIgc3R5bGU9InN0b3AtY29sb3I6IzQ1NDk0RCIvPg0KCQk8c3RvcCAgb2Zmc2V0PSIxIiBzdHlsZT0ic3RvcC1jb2xvcjojMDAwMDAwIi8+DQoJPC9saW5lYXJHcmFkaWVudD4NCgk8Y2lyY2xlIGZpbGw9InVybCgjU1ZHSURfMV8pIiBjeD0iMjMuMDA0ODgyOCIgY3k9IjIzIiByPSIyMSIvPg0KCQ0KCQk8bGluZWFyR3JhZGllbnQgaWQ9IlNWR0lEXzJfIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDE9Ii03Mi4wMDA0ODgzIiB5MT0iLTc3LjAwNDg4MjgiIHgyPSItMzAuMDAwNDg4MyIgeTI9Ii03Ny4wMDQ4ODI4IiBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDAgMSAtMSAwIC01NCA3NC4wMDA0ODgzKSI+DQoJCTxzdG9wICBvZmZzZXQ9IjAiIHN0eWxlPSJzdG9wLWNvbG9yOiMzMTM1MzkiLz4NCgkJPHN0b3AgIG9mZnNldD0iMSIgc3R5bGU9InN0b3AtY29sb3I6IzAwMDAwMCIvPg0KCTwvbGluZWFyR3JhZGllbnQ+DQoJPGNpcmNsZSBmaWxsPSJ1cmwoI1NWR0lEXzJfKSIgY3g9IjIzLjAwNDg4MjgiIGN5PSIyMyIgcj0iMjEiLz4NCjwvZz4NCjxnPg0KCQ0KCQk8bGluZWFyR3JhZGllbnQgaWQ9IlNWR0lEXzNfIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDE9Ii03MS41MDA0ODgzIiB5MT0iLTc3LjAwNDg4MjgiIHgyPSItMzAuNTAwNDg4MyIgeTI9Ii03Ny4wMDQ4ODI4IiBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDAgMSAtMSAwIC01NCA3NC4wMDA0ODgzKSI+DQoJCTxzdG9wICBvZmZzZXQ9IjAiIHN0eWxlPSJzdG9wLWNvbG9yOiM0NTQ5NEQiLz4NCgkJPHN0b3AgIG9mZnNldD0iMSIgc3R5bGU9InN0b3AtY29sb3I6IzAwMDAwMCIvPg0KCTwvbGluZWFyR3JhZGllbnQ+DQoJPGNpcmNsZSBmaWxsPSJ1cmwoI1NWR0lEXzNfKSIgY3g9IjIzLjAwNDg4MjgiIGN5PSIyMyIgcj0iMjAuNSIvPg0KPC9nPg0KPGc+DQoJPGcgb3BhY2l0eT0iMC41Ij4NCgkJPHBvbHlnb24gcG9pbnRzPSIxNi44NTE1NjI1LDE4LjI3NzgzMiAxNi44NzIwNzAzLDE4LjI5Nzg1MTYgMjQuODkzNTU0NywxMC43MjE2Nzk3IDI5LjEzNjcxODgsMTQuNzI4NTE1NiAyMS4xMTUyMzQ0LDIyLjMwNTE3NTggDQoJCQkyOS4wMjkyOTY5LDI5Ljc3OTI5NjkgMjQuNzg2MTMyOCwzMy43ODcxMDk0IDEyLjYwODM5ODQsMjIuMjg0NjY4IAkJIi8+DQoJPC9nPg0KCTxnPg0KCQk8cG9seWdvbiBmaWxsPSIjRkZGRkZGIiBwb2ludHM9IjE3LjM1MTU2MjUsMTguNzc3ODMyIDE3LjM3MjA3MDMsMTguNzk3ODUxNiAyNS4zOTM1NTQ3LDExLjIyMTY3OTcgMjkuNjM2NzE4OCwxNS4yMjg1MTU2IA0KCQkJMjEuNjE1MjM0NCwyMi44MDUxNzU4IDI5LjUyOTI5NjksMzAuMjc5Mjk2OSAyNS4yODYxMzI4LDM0LjI4NzEwOTQgMTMuMTA4Mzk4NCwyMi43ODQ2NjggCQkiLz4NCgk8L2c+DQo8L2c+DQo8cGF0aCBvcGFjaXR5PSIwLjEyIiBmaWxsPSIjRkZGRkZGIiBkPSJNMjMuMDA0ODgyOCw0My41Yy0xMS4zMDM3MTA5LDAtMjAuNS05LjE5NjI4OTEtMjAuNS0yMC41czkuMTk2Mjg5MS0yMC41LDIwLjUtMjAuNQ0KCXMyMC41LDkuMTk2Mjg5MSwyMC41LDIwLjVTMzQuMzA4NTkzOCw0My41LDIzLjAwNDg4MjgsNDMuNXogTTIzLjAwNDg4MjgsMy41MjQ5MDIzDQoJQzEyLjI2NjYwMTYsMy41MjQ5MDIzLDMuNTI5Nzg1MiwxMi4yNjE3MTg4LDMuNTI5Nzg1MiwyM3M4LjczNjgxNjQsMTkuNDc0NjA5NCwxOS40NzUwOTc3LDE5LjQ3NDYwOTQNCglTNDIuNDc5NDkyMiwzMy43MzgyODEyLDQyLjQ3OTQ5MjIsMjNTMzMuNzQzMTY0MSwzLjUyNDkwMjMsMjMuMDA0ODgyOCwzLjUyNDkwMjN6Ii8+DQo8L3N2Zz4NCg==)',
	albumTab:'url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxNS4wLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAgLS0+DQo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiIFsNCgk8IUVOVElUWSBuc19mbG93cyAiaHR0cDovL25zLmFkb2JlLmNvbS9GbG93cy8xLjAvIj4NCl0+DQo8c3ZnIHZlcnNpb249IjEuMSINCgkgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeG1sbnM6YT0iaHR0cDovL25zLmFkb2JlLmNvbS9BZG9iZVNWR1ZpZXdlckV4dGVuc2lvbnMvMy4wLyINCgkgeD0iMHB4IiB5PSIwcHgiIHdpZHRoPSI4N3B4IiBoZWlnaHQ9IjM3cHgiIHZpZXdCb3g9IjEwIDAgODcgMzciIG92ZXJmbG93PSJ2aXNpYmxlIiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDEwIDAgODcgMzciDQoJIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPGRlZnM+DQo8L2RlZnM+DQo8cGF0aCBmaWxsPSJub25lIiBkPSJNOTcsMHYzMWMwLDMuMzEzNDc2Ni0yLjY4NjUyMzQsNi02LDZIMTZjLTMuMzEzNDc2NiwwLTYtMi42ODY1MjM0LTYtNlYwSDB2NDFoMTE5VjBIOTd6Ii8+DQo8cGF0aCBvcGFjaXR5PSIwLjIiIGQ9Ik0xNiwzN2g3NWMzLjMxMzQ3NjYsMCw2LTIuNjg2NTIzNCw2LTZWMGgtMnYzMWMwLDEuOTk5MDIzNC0xLjQ3NzUzOTEsMy42NDQ1MzEyLTMuMzk0NTMxMiwzLjkzODQ3NjYNCglDOTEuNDEwMTU2MiwzNC45Nzg1MTU2LDkxLjIwNzAzMTIsMzUsOTEsMzVIMTZjLTAuMjA3NTE5NSwwLTAuNDA5NjY4LTAuMDIxNDg0NC0wLjYwNTQ2ODgtMC4wNjE1MjM0DQoJQzEzLjQ3NzUzOTEsMzQuNjQ0NTMxMiwxMiwzMi45OTkwMjM0LDEyLDMxVjBoLTJ2MzFDMTAsMzQuMzEzNDc2NiwxMi42ODY1MjM0LDM3LDE2LDM3eiIvPg0KPHBhdGggb3BhY2l0eT0iMC4yIiBkPSJNMTUuMzk0NTMxMiwzNC45Mzg0NzY2QzE0LjAyODMyMDMsMzQuNjU4MjAzMSwxMywzMy40NDkyMTg4LDEzLDMydi0xVjBoLTF2MzENCglDMTIsMzIuOTk5MDIzNCwxMy40Nzc1MzkxLDM0LjY0NDUzMTIsMTUuMzk0NTMxMiwzNC45Mzg0NzY2eiIvPg0KPGxpbmVhckdyYWRpZW50IGlkPSJTVkdJRF8xXyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIHgxPSIxMy42OTcyNjU2IiB5MT0iLTE3LjAwMDQ4ODMiIHgyPSIxMy42OTcyNjM3IiB5Mj0iMzUuMDAwMjIxMyI+DQoJPHN0b3AgIG9mZnNldD0iMCIgc3R5bGU9InN0b3AtY29sb3I6IzMxMzUzOSIvPg0KCTxzdG9wICBvZmZzZXQ9IjEiIHN0eWxlPSJzdG9wLWNvbG9yOiMwMDAwMDAiLz4NCjwvbGluZWFyR3JhZGllbnQ+DQo8cGF0aCBmaWxsPSJ1cmwoI1NWR0lEXzFfKSIgZD0iTTE1LjM5NDUzMTIsMzQuOTM4NDc2NkMxNC4wMjgzMjAzLDM0LjY1ODIwMzEsMTMsMzMuNDQ5MjE4OCwxMywzMnYtMVYwaC0xdjMxDQoJQzEyLDMyLjk5OTAyMzQsMTMuNDc3NTM5MSwzNC42NDQ1MzEyLDE1LjM5NDUzMTIsMzQuOTM4NDc2NnoiLz4NCjxwYXRoIG9wYWNpdHk9IjAuMiIgZD0iTTk0LDMyYzAsMS40NDkyMTg4LTEuMDI4MzIwMywyLjY1ODIwMzEtMi4zOTQ1MzEyLDIuOTM4NDc2NkM5My41MjI0NjA5LDM0LjY0NDUzMTIsOTUsMzIuOTk5MDIzNCw5NSwzMVYwaC0xDQoJdjMxVjMyeiIvPg0KPGxpbmVhckdyYWRpZW50IGlkPSJTVkdJRF8yXyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIHgxPSI5My4zMDI3MzQ0IiB5MT0iLTE3LjAwMDQ4ODMiIHgyPSI5My4zMDI3MzQ0IiB5Mj0iMzUuMDAwMjIxMyI+DQoJPHN0b3AgIG9mZnNldD0iMCIgc3R5bGU9InN0b3AtY29sb3I6IzMxMzUzOSIvPg0KCTxzdG9wICBvZmZzZXQ9IjEiIHN0eWxlPSJzdG9wLWNvbG9yOiMwMDAwMDAiLz4NCjwvbGluZWFyR3JhZGllbnQ+DQo8cGF0aCBmaWxsPSJ1cmwoI1NWR0lEXzJfKSIgZD0iTTk0LDMyYzAsMS40NDkyMTg4LTEuMDI4MzIwMywyLjY1ODIwMzEtMi4zOTQ1MzEyLDIuOTM4NDc2Ng0KCUM5My41MjI0NjA5LDM0LjY0NDUzMTIsOTUsMzIuOTk5MDIzNCw5NSwzMVYwaC0xdjMxVjMyeiIvPg0KPHBhdGggb3BhY2l0eT0iMC4yIiBkPSJNOTEuNjA1NDY4OCwzNC45Mzg0NzY2QzkxLjQwNjI1LDM0Ljk2OTcyNjYsOTEuMjA3MDMxMiwzNSw5MSwzNQ0KCUM5MS4yMDcwMzEyLDM1LDkxLjQxMDE1NjIsMzQuOTc4NTE1Niw5MS42MDU0Njg4LDM0LjkzODQ3NjZ6Ii8+DQo8bGluZWFyR3JhZGllbnQgaWQ9IlNWR0lEXzNfIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDE9IjkxLjMwMjczNDQiIHkxPSIwLjAwMDQ4ODMiIHgyPSI5MS4zMDI3MzQ0IiB5Mj0iMzUuMDAwNDg4MyI+DQoJPHN0b3AgIG9mZnNldD0iMCIgc3R5bGU9InN0b3AtY29sb3I6IzQzNDg0RCIvPg0KCTxzdG9wICBvZmZzZXQ9IjEiIHN0eWxlPSJzdG9wLWNvbG9yOiMwMzAzMDQiLz4NCjwvbGluZWFyR3JhZGllbnQ+DQo8cGF0aCBmaWxsPSJ1cmwoI1NWR0lEXzNfKSIgZD0iTTkxLjYwNTQ2ODgsMzQuOTM4NDc2NkM5MS40MDYyNSwzNC45Njk3MjY2LDkxLjIwNzAzMTIsMzUsOTEsMzUNCglDOTEuMjA3MDMxMiwzNSw5MS40MTAxNTYyLDM0Ljk3ODUxNTYsOTEuNjA1NDY4OCwzNC45Mzg0NzY2eiIvPg0KPHBhdGggb3BhY2l0eT0iMC4yIiBkPSJNMTYsMzVjLTAuMjA3NTE5NSwwLTAuNDA2NzM4My0wLjAzMDI3MzQtMC42MDU0Njg4LTAuMDYxNTIzNEMxNS41OTAzMzIsMzQuOTc4NTE1NiwxNS43OTI0ODA1LDM1LDE2LDM1eiIvPg0KPGxpbmVhckdyYWRpZW50IGlkPSJTVkdJRF80XyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIHgxPSIxNS42OTcyNjU2IiB5MT0iMC4wMDA0ODgzIiB4Mj0iMTUuNjk3MjYzNyIgeTI9IjM1LjAwMDQ4ODMiPg0KCTxzdG9wICBvZmZzZXQ9IjAiIHN0eWxlPSJzdG9wLWNvbG9yOiM0MzQ4NEQiLz4NCgk8c3RvcCAgb2Zmc2V0PSIxIiBzdHlsZT0ic3RvcC1jb2xvcjojMDMwMzA0Ii8+DQo8L2xpbmVhckdyYWRpZW50Pg0KPHBhdGggZmlsbD0idXJsKCNTVkdJRF80XykiIGQ9Ik0xNiwzNWMtMC4yMDc1MTk1LDAtMC40MDY3MzgzLTAuMDMwMjczNC0wLjYwNTQ2ODgtMC4wNjE1MjM0DQoJQzE1LjU5MDMzMiwzNC45Nzg1MTU2LDE1Ljc5MjQ4MDUsMzUsMTYsMzV6Ii8+DQo8cGF0aCBvcGFjaXR5PSIwLjIiIGQ9Ik05NCwzMnYtMWMwLDEuNjU3MjI2Ni0xLjM0Mzc1LDMtMywzSDE2Yy0xLjY1NjI1LDAtMy0xLjM0Mjc3MzQtMy0zdjENCgljMCwxLjQ0OTIxODgsMS4wMjgzMjAzLDIuNjU4MjAzMSwyLjM5NDUzMTIsMi45Mzg0NzY2QzE1LjU5MzI2MTcsMzQuOTY5NzI2NiwxNS43OTI0ODA1LDM1LDE2LDM1aDc1DQoJYzAuMjA3MDMxMiwwLDAuNDA2MjUtMC4wMzAyNzM0LDAuNjA1NDY4OC0wLjA2MTUyMzRDOTIuOTcxNjc5NywzNC42NTgyMDMxLDk0LDMzLjQ0OTIxODgsOTQsMzJ6Ii8+DQo8bGluZWFyR3JhZGllbnQgaWQ9IlNWR0lEXzVfIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDE9IjUzLjQ5OTUxMTciIHkxPSItMTYuOTk5NTExNyIgeDI9IjUzLjQ5OTUwNzkiIHkyPSIzNS4wMDA0ODgzIj4NCgk8c3RvcCAgb2Zmc2V0PSIwIiBzdHlsZT0ic3RvcC1jb2xvcjojMzEzNTM5Ii8+DQoJPHN0b3AgIG9mZnNldD0iMSIgc3R5bGU9InN0b3AtY29sb3I6IzAwMDAwMCIvPg0KPC9saW5lYXJHcmFkaWVudD4NCjxwYXRoIGZpbGw9InVybCgjU1ZHSURfNV8pIiBkPSJNOTQsMzJ2LTFjMCwxLjY1NzIyNjYtMS4zNDM3NSwzLTMsM0gxNmMtMS42NTYyNSwwLTMtMS4zNDI3NzM0LTMtM3YxDQoJYzAsMS40NDkyMTg4LDEuMDI4MzIwMywyLjY1ODIwMzEsMi4zOTQ1MzEyLDIuOTM4NDc2NkMxNS41OTMyNjE3LDM0Ljk2OTcyNjYsMTUuNzkyNDgwNSwzNSwxNiwzNWg3NQ0KCWMwLjIwNzAzMTIsMCwwLjQwNjI1LTAuMDMwMjczNCwwLjYwNTQ2ODgtMC4wNjE1MjM0QzkyLjk3MTY3OTcsMzQuNjU4MjAzMSw5NCwzMy40NDkyMTg4LDk0LDMyeiIvPg0KPGxpbmVhckdyYWRpZW50IGlkPSJTVkdJRF82XyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIHgxPSI1My40OTk1MTE3IiB5MT0iMC4wMDA0ODgzIiB4Mj0iNTMuNDk5NTExNyIgeTI9IjM1LjAwMDQ4ODMiPg0KCTxzdG9wICBvZmZzZXQ9IjAiIHN0eWxlPSJzdG9wLWNvbG9yOiM0MzQ4NEQiLz4NCgk8c3RvcCAgb2Zmc2V0PSIxIiBzdHlsZT0ic3RvcC1jb2xvcjojMDMwMzA0Ii8+DQo8L2xpbmVhckdyYWRpZW50Pg0KPHBhdGggZmlsbD0idXJsKCNTVkdJRF82XykiIGQ9Ik05NCwzMnYtMWMwLDEuNjU3MjI2Ni0xLjM0Mzc1LDMtMywzSDE2Yy0xLjY1NjI1LDAtMy0xLjM0Mjc3MzQtMy0zdjENCgljMCwxLjQ0OTIxODgsMS4wMjgzMjAzLDIuNjU4MjAzMSwyLjM5NDUzMTIsMi45Mzg0NzY2QzE1LjU5MzI2MTcsMzQuOTY5NzI2NiwxNS43OTI0ODA1LDM1LDE2LDM1aDc1DQoJYzAuMjA3MDMxMiwwLDAuNDA2MjUtMC4wMzAyNzM0LDAuNjA1NDY4OC0wLjA2MTUyMzRDOTIuOTcxNjc5NywzNC42NTgyMDMxLDk0LDMzLjQ0OTIxODgsOTQsMzJ6Ii8+DQo8cGF0aCBvcGFjaXR5PSIwLjIiIGQ9Ik0xNiwzMmg3NWMwLjU1MjczNDQsMCwxLTAuNDQ3MjY1NiwxLTFWMEgxNXYzMUMxNSwzMS41NTI3MzQ0LDE1LjQ0NzI2NTYsMzIsMTYsMzJ6Ii8+DQo8bGluZWFyR3JhZGllbnQgaWQ9IlNWR0lEXzdfIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDE9IjUzLjQ5OTUxMTciIHkxPSItMTcuMDAwNDg4MyIgeDI9IjUzLjQ5OTUwNzkiIHkyPSIzNS4wMDAzMDkiPg0KCTxzdG9wICBvZmZzZXQ9IjAiIHN0eWxlPSJzdG9wLWNvbG9yOiMzMTM1MzkiLz4NCgk8c3RvcCAgb2Zmc2V0PSIxIiBzdHlsZT0ic3RvcC1jb2xvcjojMDAwMDAwIi8+DQo8L2xpbmVhckdyYWRpZW50Pg0KPHBhdGggZmlsbD0idXJsKCNTVkdJRF83XykiIGQ9Ik0xNiwzMmg3NWMwLjU1MjczNDQsMCwxLTAuNDQ3MjY1NiwxLTFWMEgxNXYzMUMxNSwzMS41NTI3MzQ0LDE1LjQ0NzI2NTYsMzIsMTYsMzJ6Ii8+DQo8bGluZWFyR3JhZGllbnQgaWQ9IlNWR0lEXzhfIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDE9IjUzLjQ5OTUxMTciIHkxPSIwIiB4Mj0iNTMuNDk5NTExNyIgeTI9IjM1LjAwMDUzNDEiPg0KCTxzdG9wICBvZmZzZXQ9IjAiIHN0eWxlPSJzdG9wLWNvbG9yOiM0MzQ4NEQiLz4NCgk8c3RvcCAgb2Zmc2V0PSIxIiBzdHlsZT0ic3RvcC1jb2xvcjojMDMwMzA0Ii8+DQo8L2xpbmVhckdyYWRpZW50Pg0KPHBhdGggZmlsbD0idXJsKCNTVkdJRF84XykiIGQ9Ik0xNiwzMmg3NWMwLjU1MjczNDQsMCwxLTAuNDQ3MjY1NiwxLTFWMEgxNXYzMUMxNSwzMS41NTI3MzQ0LDE1LjQ0NzI2NTYsMzIsMTYsMzJ6Ii8+DQo8cGF0aCBvcGFjaXR5PSIwLjIiIGQ9Ik0xNiwzNGg3NWMxLjY1NjI1LDAsMy0xLjM0Mjc3MzQsMy0zVjBoLTF2MzFjMCwxLjEwNDQ5MjItMC44OTU1MDc4LDItMiwySDE2Yy0xLjEwNDQ5MjIsMC0yLTAuODk1NTA3OC0yLTJWMA0KCWgtMXYzMUMxMywzMi42NTcyMjY2LDE0LjM0Mzc1LDM0LDE2LDM0eiIvPg0KPGxpbmVhckdyYWRpZW50IGlkPSJTVkdJRF85XyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIHgxPSI1My40OTk1MTE3IiB5MT0iLTE3LjAwMDQ4ODMiIHgyPSI1My40OTk1MDc5IiB5Mj0iMzUuMDAwMTk4NCI+DQoJPHN0b3AgIG9mZnNldD0iMCIgc3R5bGU9InN0b3AtY29sb3I6IzMxMzUzOSIvPg0KCTxzdG9wICBvZmZzZXQ9IjEiIHN0eWxlPSJzdG9wLWNvbG9yOiMwMDAwMDAiLz4NCjwvbGluZWFyR3JhZGllbnQ+DQo8cGF0aCBmaWxsPSJ1cmwoI1NWR0lEXzlfKSIgZD0iTTE2LDM0aDc1YzEuNjU2MjUsMCwzLTEuMzQyNzczNCwzLTNWMGgtMXYzMWMwLDEuMTA0NDkyMi0wLjg5NTUwNzgsMi0yLDJIMTYNCgljLTEuMTA0NDkyMiwwLTItMC44OTU1MDc4LTItMlYwaC0xdjMxQzEzLDMyLjY1NzIyNjYsMTQuMzQzNzUsMzQsMTYsMzR6Ii8+DQo8bGluZWFyR3JhZGllbnQgaWQ9IlNWR0lEXzEwXyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIHgxPSI1My40OTk1MTE3IiB5MT0iMCIgeDI9IjUzLjQ5OTUxMTciIHkyPSIzNS4wMDA0NDI1Ij4NCgk8c3RvcCAgb2Zmc2V0PSIwIiBzdHlsZT0ic3RvcC1jb2xvcjojNDM0ODREIi8+DQoJPHN0b3AgIG9mZnNldD0iMSIgc3R5bGU9InN0b3AtY29sb3I6IzAzMDMwNCIvPg0KPC9saW5lYXJHcmFkaWVudD4NCjxwYXRoIGZpbGw9InVybCgjU1ZHSURfMTBfKSIgZD0iTTE2LDM0aDc1YzEuNjU2MjUsMCwzLTEuMzQyNzczNCwzLTNWMGgtMXYzMWMwLDEuMTA0NDkyMi0wLjg5NTUwNzgsMi0yLDJIMTYNCgljLTEuMTA0NDkyMiwwLTItMC44OTU1MDc4LTItMlYwaC0xdjMxQzEzLDMyLjY1NzIyNjYsMTQuMzQzNzUsMzQsMTYsMzR6Ii8+DQo8cGF0aCBvcGFjaXR5PSIwLjEyIiBmaWxsPSIjRkZGRkZGIiBkPSJNMTYsMzRoNzVjMS42NTYyNSwwLDMtMS4zNDI3NzM0LDMtM1YwaC0xdjMxYzAsMS4xMDQ0OTIyLTAuODk1NTA3OCwyLTIsMkgxNg0KCWMtMS4xMDQ0OTIyLDAtMi0wLjg5NTUwNzgtMi0yVjBoLTF2MzFDMTMsMzIuNjU3MjI2NiwxNC4zNDM3NSwzNCwxNiwzNHoiLz4NCjxwYXRoIG9wYWNpdHk9IjAuMiIgZD0iTTE2LDMzaDc1YzEuMTAzNTE1NiwwLDItMC44OTc0NjA5LDItMlYwaC0xdjMxYzAsMC41NTI3MzQ0LTAuNDQ3MjY1NiwxLTEsMUgxNmMtMC41NTI3MzQ0LDAtMS0wLjQ0NzI2NTYtMS0xDQoJVjBoLTF2MzFDMTQsMzIuMTAyNTM5MSwxNC44OTY0ODQ0LDMzLDE2LDMzeiIvPg0KPGxpbmVhckdyYWRpZW50IGlkPSJTVkdJRF8xMV8iIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiB4MT0iNTMuNDk5NTExNyIgeTE9Ii0xNy4wMDA0ODgzIiB4Mj0iNTMuNDk5NTA3OSIgeTI9IjM1LjAwMDM2MjQiPg0KCTxzdG9wICBvZmZzZXQ9IjAiIHN0eWxlPSJzdG9wLWNvbG9yOiMzMTM1MzkiLz4NCgk8c3RvcCAgb2Zmc2V0PSIxIiBzdHlsZT0ic3RvcC1jb2xvcjojMDAwMDAwIi8+DQo8L2xpbmVhckdyYWRpZW50Pg0KPHBhdGggZmlsbD0idXJsKCNTVkdJRF8xMV8pIiBkPSJNMTYsMzNoNzVjMS4xMDM1MTU2LDAsMi0wLjg5NzQ2MDksMi0yVjBoLTF2MzFjMCwwLjU1MjczNDQtMC40NDcyNjU2LDEtMSwxSDE2DQoJYy0wLjU1MjczNDQsMC0xLTAuNDQ3MjY1Ni0xLTFWMGgtMXYzMUMxNCwzMi4xMDI1MzkxLDE0Ljg5NjQ4NDQsMzMsMTYsMzN6Ii8+DQo8bGluZWFyR3JhZGllbnQgaWQ9IlNWR0lEXzEyXyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIHgxPSI1My40OTk1MTE3IiB5MT0iMCIgeDI9IjUzLjQ5OTUxMTciIHkyPSIzNS4wMDA2NDQ3Ij4NCgk8c3RvcCAgb2Zmc2V0PSIwIiBzdHlsZT0ic3RvcC1jb2xvcjojNDM0ODREIi8+DQoJPHN0b3AgIG9mZnNldD0iMSIgc3R5bGU9InN0b3AtY29sb3I6IzAzMDMwNCIvPg0KPC9saW5lYXJHcmFkaWVudD4NCjxwYXRoIGZpbGw9InVybCgjU1ZHSURfMTJfKSIgZD0iTTE2LDMzaDc1YzEuMTAzNTE1NiwwLDItMC44OTc0NjA5LDItMlYwaC0xdjMxYzAsMC41NTI3MzQ0LTAuNDQ3MjY1NiwxLTEsMUgxNg0KCWMtMC41NTI3MzQ0LDAtMS0wLjQ0NzI2NTYtMS0xVjBoLTF2MzFDMTQsMzIuMTAyNTM5MSwxNC44OTY0ODQ0LDMzLDE2LDMzeiIvPg0KPHBhdGggb3BhY2l0eT0iMC4yIiBkPSJNOTEsMzNjMS4xMDQ0OTIyLDAsMi0wLjg5NTUwNzgsMi0yQzkzLDMyLjEwMjUzOTEsOTIuMTAzNTE1NiwzMyw5MSwzM3oiLz4NCjxsaW5lYXJHcmFkaWVudCBpZD0iU1ZHSURfMTNfIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDE9IjkyIiB5MT0iLTE2Ljk5OTUxMTciIHgyPSI5MiIgeTI9IjM1LjAwMDQ4ODMiPg0KCTxzdG9wICBvZmZzZXQ9IjAiIHN0eWxlPSJzdG9wLWNvbG9yOiMzMTM1MzkiLz4NCgk8c3RvcCAgb2Zmc2V0PSIxIiBzdHlsZT0ic3RvcC1jb2xvcjojMDAwMDAwIi8+DQo8L2xpbmVhckdyYWRpZW50Pg0KPHBhdGggZmlsbD0idXJsKCNTVkdJRF8xM18pIiBkPSJNOTEsMzNjMS4xMDQ0OTIyLDAsMi0wLjg5NTUwNzgsMi0yQzkzLDMyLjEwMjUzOTEsOTIuMTAzNTE1NiwzMyw5MSwzM3oiLz4NCjxsaW5lYXJHcmFkaWVudCBpZD0iU1ZHSURfMTRfIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDE9IjkyIiB5MT0iMC4wMDA0ODgzIiB4Mj0iOTIiIHkyPSIzNS4wMDA0ODgzIj4NCgk8c3RvcCAgb2Zmc2V0PSIwIiBzdHlsZT0ic3RvcC1jb2xvcjojNDM0ODREIi8+DQoJPHN0b3AgIG9mZnNldD0iMSIgc3R5bGU9InN0b3AtY29sb3I6IzAzMDMwNCIvPg0KPC9saW5lYXJHcmFkaWVudD4NCjxwYXRoIGZpbGw9InVybCgjU1ZHSURfMTRfKSIgZD0iTTkxLDMzYzEuMTA0NDkyMiwwLDItMC44OTU1MDc4LDItMkM5MywzMi4xMDI1MzkxLDkyLjEwMzUxNTYsMzMsOTEsMzN6Ii8+DQo8cGF0aCBvcGFjaXR5PSIwLjEyIiBmaWxsPSIjRkZGRkZGIiBkPSJNOTEsMzNjMS4xMDQ0OTIyLDAsMi0wLjg5NTUwNzgsMi0yQzkzLDMyLjEwMjUzOTEsOTIuMTAzNTE1NiwzMyw5MSwzM3oiLz4NCjxwYXRoIG9wYWNpdHk9IjAuMDgiIGZpbGw9IiNGRkZGRkYiIGQ9Ik05MSwzM2MxLjEwNDQ5MjIsMCwyLTAuODk1NTA3OCwyLTJDOTMsMzIuMTAyNTM5MSw5Mi4xMDM1MTU2LDMzLDkxLDMzeiIvPg0KPHBhdGggb3BhY2l0eT0iMC4yIiBkPSJNMTQsMzFjMCwxLjEwNDQ5MjIsMC44OTU1MDc4LDIsMiwyQzE0Ljg5NjQ4NDQsMzMsMTQsMzIuMTAyNTM5MSwxNCwzMXoiLz4NCjxsaW5lYXJHcmFkaWVudCBpZD0iU1ZHSURfMTVfIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDE9IjE1IiB5MT0iLTE2Ljk5OTUxMTciIHgyPSIxNC45OTk5OTgxIiB5Mj0iMzUuMDAwNDg4MyI+DQoJPHN0b3AgIG9mZnNldD0iMCIgc3R5bGU9InN0b3AtY29sb3I6IzMxMzUzOSIvPg0KCTxzdG9wICBvZmZzZXQ9IjEiIHN0eWxlPSJzdG9wLWNvbG9yOiMwMDAwMDAiLz4NCjwvbGluZWFyR3JhZGllbnQ+DQo8cGF0aCBmaWxsPSJ1cmwoI1NWR0lEXzE1XykiIGQ9Ik0xNCwzMWMwLDEuMTA0NDkyMiwwLjg5NTUwNzgsMiwyLDJDMTQuODk2NDg0NCwzMywxNCwzMi4xMDI1MzkxLDE0LDMxeiIvPg0KPGxpbmVhckdyYWRpZW50IGlkPSJTVkdJRF8xNl8iIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiB4MT0iMTUiIHkxPSIwLjAwMDQ4ODMiIHgyPSIxNC45OTk5OTgxIiB5Mj0iMzUuMDAwNDg4MyI+DQoJPHN0b3AgIG9mZnNldD0iMCIgc3R5bGU9InN0b3AtY29sb3I6IzQzNDg0RCIvPg0KCTxzdG9wICBvZmZzZXQ9IjEiIHN0eWxlPSJzdG9wLWNvbG9yOiMwMzAzMDQiLz4NCjwvbGluZWFyR3JhZGllbnQ+DQo8cGF0aCBmaWxsPSJ1cmwoI1NWR0lEXzE2XykiIGQ9Ik0xNCwzMWMwLDEuMTA0NDkyMiwwLjg5NTUwNzgsMiwyLDJDMTQuODk2NDg0NCwzMywxNCwzMi4xMDI1MzkxLDE0LDMxeiIvPg0KPHBhdGggb3BhY2l0eT0iMC4xMiIgZmlsbD0iI0ZGRkZGRiIgZD0iTTE0LDMxYzAsMS4xMDQ0OTIyLDAuODk1NTA3OCwyLDIsMkMxNC44OTY0ODQ0LDMzLDE0LDMyLjEwMjUzOTEsMTQsMzF6Ii8+DQo8cGF0aCBvcGFjaXR5PSIwLjA4IiBmaWxsPSIjRkZGRkZGIiBkPSJNMTQsMzFjMCwxLjEwNDQ5MjIsMC44OTU1MDc4LDIsMiwyQzE0Ljg5NjQ4NDQsMzMsMTQsMzIuMTAyNTM5MSwxNCwzMXoiLz4NCjxnPg0KCTxnIG9wYWNpdHk9IjAuNSI+DQoJCTxwYXRoIGQ9Ik01Ny4xNjE2MjExLDkuOTk4MDQ2OWgtOC4zMjIyNjU2Yy0xLjI4ODU3NDIsMC0yLjM0MTc5NjksMS4wNTQ2ODc1LTIuMzQxNzk2OSwyLjM0MDgyMDN2OC4zMjMyNDIyDQoJCQljMCwxLjI4NzEwOTQsMS4wNTMyMjI3LDIuMzM5ODQzOCwyLjM0MTc5NjksMi4zMzk4NDM4aDguMzIyMjY1NmMxLjI4NzEwOTQsMCwyLjM0MDMzMi0xLjA1MjczNDQsMi4zNDAzMzItMi4zMzk4NDM4di04LjMyMzI0MjINCgkJCUM1OS41MDE5NTMxLDExLjA1MjczNDQsNTguNDQ4NzMwNSw5Ljk5ODA0NjksNTcuMTYxNjIxMSw5Ljk5ODA0Njl6IE01OC4yODMyMDMxLDE5LjE5OTIxODgNCgkJCWMwLDAuNjE4MTY0MS0wLjA4OTM1NTUsMC43MDcwMzEyLTAuNzA3NTE5NSwwLjcwNzAzMTJINDguNDI1MjkzYy0wLjYxOTYyODksMC0wLjcwODAwNzgtMC4wODg4NjcyLTAuNzA4MDA3OC0wLjcwNzAzMTINCgkJCXYtNS4zOTY0ODQ0YzAtMC42MTgxNjQxLDAuMDg4Mzc4OS0wLjcwODk4NDQsMC43MDgwMDc4LTAuNzA4OTg0NGg5LjE1MDM5MDZjMC42MTgxNjQxLDAsMC43MDc1MTk1LDAuMDkwODIwMywwLjcwNzUxOTUsMC43MDg5ODQ0DQoJCQlWMTkuMTk5MjE4OHoiLz4NCgkJPHBhdGggZD0iTTczLjE1ODIwMzEsOS45OTgwNDY5aC04LjMyMjI2NTZjLTEuMjg3MTA5NCwwLTIuMzQxNzk2OSwxLjA1NDY4NzUtMi4zNDE3OTY5LDIuMzQwODIwM3Y4LjMyMzI0MjINCgkJCWMwLDEuMjg3MTA5NCwxLjA1NDY4NzUsMi4zMzk4NDM4LDIuMzQxNzk2OSwyLjMzOTg0MzhoOC4zMjIyNjU2YzEuMjg3MTA5NCwwLDIuMzQwODIwMy0xLjA1MjczNDQsMi4zNDA4MjAzLTIuMzM5ODQzOHYtOC4zMjMyNDIyDQoJCQlDNzUuNDk5MDIzNCwxMS4wNTI3MzQ0LDc0LjQ0NTMxMjUsOS45OTgwNDY5LDczLjE1ODIwMzEsOS45OTgwNDY5eiBNNzQuMjc5Mjk2OSwxOS4xOTkyMTg4DQoJCQljMCwwLjYxODE2NDEtMC4wODg4NjcyLDAuNzA3MDMxMi0wLjcwNzAzMTIsMC43MDcwMzEySDY0LjQyMTg3NWMtMC42MTkxNDA2LDAtMC43MDcwMzEyLTAuMDg4ODY3Mi0wLjcwNzAzMTItMC43MDcwMzEyDQoJCQl2LTUuMzk2NDg0NGMwLTAuNjE4MTY0MSwwLjA4Nzg5MDYtMC43MDg5ODQ0LDAuNzA3MDMxMi0wLjcwODk4NDRoOS4xNTAzOTA2YzAuNjE4MTY0MSwwLDAuNzA3MDMxMiwwLjA5MDgyMDMsMC43MDcwMzEyLDAuNzA4OTg0NA0KCQkJVjE5LjE5OTIxODh6Ii8+DQoJCTxwYXRoIGQ9Ik00MS4xNjQ1NTA4LDkuOTk4MDQ2OWgtOC4zMjIyNjU2Yy0xLjI4ODA4NTksMC0yLjM0MTMwODYsMS4wNTQ2ODc1LTIuMzQxMzA4NiwyLjM0MDgyMDN2OC4zMjMyNDIyDQoJCQljMCwxLjI4NzEwOTQsMS4wNTMyMjI3LDIuMzM5ODQzOCwyLjM0MTMwODYsMi4zMzk4NDM4aDguMzIyMjY1NmMxLjI4NzU5NzcsMCwyLjM0MTMwODYtMS4wNTI3MzQ0LDIuMzQxMzA4Ni0yLjMzOTg0Mzh2LTguMzIzMjQyMg0KCQkJQzQzLjUwNTg1OTQsMTEuMDUyNzM0NCw0Mi40NTIxNDg0LDkuOTk4MDQ2OSw0MS4xNjQ1NTA4LDkuOTk4MDQ2OXogTTQyLjI4NjYyMTEsMTkuMTk5MjE4OA0KCQkJYzAsMC42MTgxNjQxLTAuMDg5ODQzOCwwLjcwNzAzMTItMC43MDc1MTk1LDAuNzA3MDMxMmgtOS4xNTAzOTA2Yy0wLjYxOTYyODksMC0wLjcwODAwNzgtMC4wODg4NjcyLTAuNzA4MDA3OC0wLjcwNzAzMTINCgkJCXYtNS4zOTY0ODQ0YzAtMC42MTgxNjQxLDAuMDg4Mzc4OS0wLjcwODk4NDQsMC43MDgwMDc4LTAuNzA4OTg0NGg5LjE1MDM5MDZjMC42MTc2NzU4LDAsMC43MDc1MTk1LDAuMDkwODIwMywwLjcwNzUxOTUsMC43MDg5ODQ0DQoJCQlWMTkuMTk5MjE4OHoiLz4NCgk8L2c+DQoJPGc+DQoJCTxnPg0KCQkJPHBhdGggZmlsbD0iI0ZGRkZGRiIgZD0iTTU3LjY2MTYyMTEsMTAuNDk4MDQ2OWgtOC4zMjIyNjU2Yy0xLjI4ODU3NDIsMC0yLjM0MTc5NjksMS4wNTQ2ODc1LTIuMzQxNzk2OSwyLjM0MDgyMDN2OC4zMjMyNDIyDQoJCQkJYzAsMS4yODcxMDk0LDEuMDUzMjIyNywyLjMzOTg0MzgsMi4zNDE3OTY5LDIuMzM5ODQzOGg4LjMyMjI2NTZjMS4yODcxMDk0LDAsMi4zNDAzMzItMS4wNTI3MzQ0LDIuMzQwMzMyLTIuMzM5ODQzOHYtOC4zMjMyNDIyDQoJCQkJQzYwLjAwMTk1MzEsMTEuNTUyNzM0NCw1OC45NDg3MzA1LDEwLjQ5ODA0NjksNTcuNjYxNjIxMSwxMC40OTgwNDY5eiBNNTguNzgzMjAzMSwxOS42OTkyMTg4DQoJCQkJYzAsMC42MTgxNjQxLTAuMDg5MzU1NSwwLjcwNzAzMTItMC43MDc1MTk1LDAuNzA3MDMxMkg0OC45MjUyOTNjLTAuNjE5NjI4OSwwLTAuNzA4MDA3OC0wLjA4ODg2NzItMC43MDgwMDc4LTAuNzA3MDMxMg0KCQkJCXYtNS4zOTY0ODQ0YzAtMC42MTgxNjQxLDAuMDg4Mzc4OS0wLjcwODk4NDQsMC43MDgwMDc4LTAuNzA4OTg0NGg5LjE1MDM5MDYNCgkJCQljMC42MTgxNjQxLDAsMC43MDc1MTk1LDAuMDkwODIwMywwLjcwNzUxOTUsMC43MDg5ODQ0VjE5LjY5OTIxODh6Ii8+DQoJCQk8cGF0aCBmaWxsPSIjRkZGRkZGIiBkPSJNNzMuNjU4MjAzMSwxMC40OTgwNDY5aC04LjMyMjI2NTZjLTEuMjg3MTA5NCwwLTIuMzQxNzk2OSwxLjA1NDY4NzUtMi4zNDE3OTY5LDIuMzQwODIwM3Y4LjMyMzI0MjINCgkJCQljMCwxLjI4NzEwOTQsMS4wNTQ2ODc1LDIuMzM5ODQzOCwyLjM0MTc5NjksMi4zMzk4NDM4aDguMzIyMjY1NmMxLjI4NzEwOTQsMCwyLjM0MDgyMDMtMS4wNTI3MzQ0LDIuMzQwODIwMy0yLjMzOTg0MzgNCgkJCQl2LTguMzIzMjQyMkM3NS45OTkwMjM0LDExLjU1MjczNDQsNzQuOTQ1MzEyNSwxMC40OTgwNDY5LDczLjY1ODIwMzEsMTAuNDk4MDQ2OXogTTc0Ljc3OTI5NjksMTkuNjk5MjE4OA0KCQkJCWMwLDAuNjE4MTY0MS0wLjA4ODg2NzIsMC43MDcwMzEyLTAuNzA3MDMxMiwwLjcwNzAzMTJINjQuOTIxODc1Yy0wLjYxOTE0MDYsMC0wLjcwNzAzMTItMC4wODg4NjcyLTAuNzA3MDMxMi0wLjcwNzAzMTINCgkJCQl2LTUuMzk2NDg0NGMwLTAuNjE4MTY0MSwwLjA4Nzg5MDYtMC43MDg5ODQ0LDAuNzA3MDMxMi0wLjcwODk4NDRoOS4xNTAzOTA2DQoJCQkJYzAuNjE4MTY0MSwwLDAuNzA3MDMxMiwwLjA5MDgyMDMsMC43MDcwMzEyLDAuNzA4OTg0NFYxOS42OTkyMTg4eiIvPg0KCQkJPHBhdGggZmlsbD0iI0ZGRkZGRiIgZD0iTTQxLjY2NDU1MDgsMTAuNDk4MDQ2OWgtOC4zMjIyNjU2Yy0xLjI4ODA4NTksMC0yLjM0MTMwODYsMS4wNTQ2ODc1LTIuMzQxMzA4NiwyLjM0MDgyMDN2OC4zMjMyNDIyDQoJCQkJYzAsMS4yODcxMDk0LDEuMDUzMjIyNywyLjMzOTg0MzgsMi4zNDEzMDg2LDIuMzM5ODQzOGg4LjMyMjI2NTZjMS4yODc1OTc3LDAsMi4zNDEzMDg2LTEuMDUyNzM0NCwyLjM0MTMwODYtMi4zMzk4NDM4DQoJCQkJdi04LjMyMzI0MjJDNDQuMDA1ODU5NCwxMS41NTI3MzQ0LDQyLjk1MjE0ODQsMTAuNDk4MDQ2OSw0MS42NjQ1NTA4LDEwLjQ5ODA0Njl6IE00Mi43ODY2MjExLDE5LjY5OTIxODgNCgkJCQljMCwwLjYxODE2NDEtMC4wODk4NDM4LDAuNzA3MDMxMi0wLjcwNzUxOTUsMC43MDcwMzEyaC05LjE1MDM5MDZjLTAuNjE5NjI4OSwwLTAuNzA4MDA3OC0wLjA4ODg2NzItMC43MDgwMDc4LTAuNzA3MDMxMg0KCQkJCXYtNS4zOTY0ODQ0YzAtMC42MTgxNjQxLDAuMDg4Mzc4OS0wLjcwODk4NDQsMC43MDgwMDc4LTAuNzA4OTg0NGg5LjE1MDM5MDYNCgkJCQljMC42MTc2NzU4LDAsMC43MDc1MTk1LDAuMDkwODIwMywwLjcwNzUxOTUsMC43MDg5ODQ0VjE5LjY5OTIxODh6Ii8+DQoJCTwvZz4NCgk8L2c+DQo8L2c+DQo8L3N2Zz4NCg==)',
	thumbTab:'url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxNS4wLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAgLS0+DQo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiIFsNCgk8IUVOVElUWSBuc19mbG93cyAiaHR0cDovL25zLmFkb2JlLmNvbS9GbG93cy8xLjAvIj4NCl0+DQo8c3ZnIHZlcnNpb249IjEuMSINCgkgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeG1sbnM6YT0iaHR0cDovL25zLmFkb2JlLmNvbS9BZG9iZVNWR1ZpZXdlckV4dGVuc2lvbnMvMy4wLyINCgkgeD0iMHB4IiB5PSIwcHgiIHdpZHRoPSI4N3B4IiBoZWlnaHQ9IjM3cHgiIHZpZXdCb3g9IjcgMCA4NyAzNyIgb3ZlcmZsb3c9InZpc2libGUiIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgNyAwIDg3IDM3Ig0KCSB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxkZWZzPg0KPC9kZWZzPg0KPHBhdGggZmlsbD0ibm9uZSIgZD0iTTg3LjYwNzQyMTksMEM5MC45MjA4OTg0LDAsOTQsMi42ODY1MjM0LDk0LDZ2MzFoMlYwSDg3LjYwNzQyMTl6Ii8+DQo8cGF0aCBmaWxsPSJub25lIiBkPSJNMTIuNjA3NDIxOSwwSDB2MzdoN1Y2QzcsMi42ODY1MjM0LDkuMjkzOTQ1MywwLDEyLjYwNzQyMTksMHoiLz4NCjxwYXRoIG9wYWNpdHk9IjAuMiIgZD0iTTg3LjYwNzQyMTksMGgtNzVDOS4yOTM5NDUzLDAsNywyLjY4NjUyMzQsNyw2djMxaDJWNmMwLTIuMjA2MDU0NywxLjQwMTg1NTUtNCwzLjYwNzQyMTktNGg3NQ0KCUM4OS44MTM0NzY2LDIsOTIsMy43OTM5NDUzLDkyLDZ2MzFoMlY2Qzk0LDIuNjg2NTIzNCw5MC45MjA4OTg0LDAsODcuNjA3NDIxOSwweiIvPg0KPHBhdGggb3BhY2l0eT0iMC4yIiBkPSJNODcuNjA3NDIxOSwyaC03NUMxMC40MDE4NTU1LDIsOSwzLjc5Mzk0NTMsOSw2djMxaDFWNmMwLTEuNjU3MjI2NiwwLjk1MDY4MzYtMywyLjYwNzQyMTktM2g3NQ0KCUM4OS4yNjM2NzE5LDMsOTEsNC4zNDI3NzM0LDkxLDZ2MzFoMVY2QzkyLDMuNzkzOTQ1Myw4OS44MTM0NzY2LDIsODcuNjA3NDIxOSwyeiIvPg0KPGxpbmVhckdyYWRpZW50IGlkPSJTVkdJRF8xXyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIHgxPSI1MC41IiB5MT0iMiIgeDI9IjUwLjQ5OTk5NjIiIHkyPSI1NC4wMDA1NzIyIj4NCgk8c3RvcCAgb2Zmc2V0PSIwIiBzdHlsZT0ic3RvcC1jb2xvcjojMzEzNTM5Ii8+DQoJPHN0b3AgIG9mZnNldD0iMSIgc3R5bGU9InN0b3AtY29sb3I6IzAwMDAwMCIvPg0KPC9saW5lYXJHcmFkaWVudD4NCjxwYXRoIGZpbGw9InVybCgjU1ZHSURfMV8pIiBkPSJNODcuNjA3NDIxOSwyaC03NUMxMC40MDE4NTU1LDIsOSwzLjc5Mzk0NTMsOSw2djMxaDFWNmMwLTEuNjU3MjI2NiwwLjk1MDY4MzYtMywyLjYwNzQyMTktM2g3NQ0KCUM4OS4yNjM2NzE5LDMsOTEsNC4zNDI3NzM0LDkxLDZ2MzFoMVY2QzkyLDMuNzkzOTQ1Myw4OS44MTM0NzY2LDIsODcuNjA3NDIxOSwyeiIvPg0KPHBhdGggb3BhY2l0eT0iMC4yIiBkPSJNODcuNjA3NDIxOSw1aC03NUMxMi4wNTUxNzU4LDUsMTIsNS40NDcyNjU2LDEyLDZ2MzFoNzdWNkM4OSw1LjQ0NzI2NTYsODguMTYwMTU2Miw1LDg3LjYwNzQyMTksNXoiLz4NCjxsaW5lYXJHcmFkaWVudCBpZD0iU1ZHSURfMl8iIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiB4MT0iNTAuNSIgeTE9IjIiIHgyPSI1MC40OTk5OTYyIiB5Mj0iNTQuMDAwNzk3MyI+DQoJPHN0b3AgIG9mZnNldD0iMCIgc3R5bGU9InN0b3AtY29sb3I6IzMxMzUzOSIvPg0KCTxzdG9wICBvZmZzZXQ9IjEiIHN0eWxlPSJzdG9wLWNvbG9yOiMwMDAwMDAiLz4NCjwvbGluZWFyR3JhZGllbnQ+DQo8cGF0aCBmaWxsPSJ1cmwoI1NWR0lEXzJfKSIgZD0iTTg3LjYwNzQyMTksNWgtNzVDMTIuMDU1MTc1OCw1LDEyLDUuNDQ3MjY1NiwxMiw2djMxaDc3VjZDODksNS40NDcyNjU2LDg4LjE2MDE1NjIsNSw4Ny42MDc0MjE5LDV6Ig0KCS8+DQo8bGluZWFyR3JhZGllbnQgaWQ9IlNWR0lEXzNfIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDE9IjUwLjUiIHkxPSIzIiB4Mj0iNTAuNDk5OTk2MiIgeTI9IjUzLjAwMDc2MjkiPg0KCTxzdG9wICBvZmZzZXQ9IjAiIHN0eWxlPSJzdG9wLWNvbG9yOiM0MzQ4NEQiLz4NCgk8c3RvcCAgb2Zmc2V0PSIwLjY1NjQ0MTkiIHN0eWxlPSJzdG9wLWNvbG9yOiMwMzAzMDQiLz4NCjwvbGluZWFyR3JhZGllbnQ+DQo8cGF0aCBmaWxsPSJ1cmwoI1NWR0lEXzNfKSIgZD0iTTg3LjYwNzQyMTksNWgtNzVDMTIuMDU1MTc1OCw1LDEyLDUuNDQ3MjY1NiwxMiw2djMxaDc3VjZDODksNS40NDcyNjU2LDg4LjE2MDE1NjIsNSw4Ny42MDc0MjE5LDV6Ig0KCS8+DQo8cGF0aCBvcGFjaXR5PSIwLjIiIGQ9Ik04Ny42MDc0MjE5LDNoLTc1QzEwLjk1MDY4MzYsMywxMCw0LjM0Mjc3MzQsMTAsNnYzMWgxVjZjMC0xLjEwNDQ5MjIsMC41MDI5Mjk3LTIsMS42MDc0MjE5LTJoNzUNCglDODguNzExOTE0MSw0LDkwLDQuODk1NTA3OCw5MCw2djMxaDFWNkM5MSw0LjM0Mjc3MzQsODkuMjYzNjcxOSwzLDg3LjYwNzQyMTksM3oiLz4NCjxsaW5lYXJHcmFkaWVudCBpZD0iU1ZHSURfNF8iIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiB4MT0iNTAuNSIgeTE9IjIiIHgyPSI1MC40OTk5OTYyIiB5Mj0iNTQuMDAwNjg2NiI+DQoJPHN0b3AgIG9mZnNldD0iMCIgc3R5bGU9InN0b3AtY29sb3I6IzMxMzUzOSIvPg0KCTxzdG9wICBvZmZzZXQ9IjEiIHN0eWxlPSJzdG9wLWNvbG9yOiMwMDAwMDAiLz4NCjwvbGluZWFyR3JhZGllbnQ+DQo8cGF0aCBmaWxsPSJ1cmwoI1NWR0lEXzRfKSIgZD0iTTg3LjYwNzQyMTksM2gtNzVDMTAuOTUwNjgzNiwzLDEwLDQuMzQyNzczNCwxMCw2djMxaDFWNmMwLTEuMTA0NDkyMiwwLjUwMjkyOTctMiwxLjYwNzQyMTktMmg3NQ0KCUM4OC43MTE5MTQxLDQsOTAsNC44OTU1MDc4LDkwLDZ2MzFoMVY2QzkxLDQuMzQyNzczNCw4OS4yNjM2NzE5LDMsODcuNjA3NDIxOSwzeiIvPg0KPGxpbmVhckdyYWRpZW50IGlkPSJTVkdJRF81XyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIHgxPSI1MC41IiB5MT0iMyIgeDI9IjUwLjQ5OTk5NjIiIHkyPSI1My4wMDA3NzgyIj4NCgk8c3RvcCAgb2Zmc2V0PSIwIiBzdHlsZT0ic3RvcC1jb2xvcjojNDM0ODREIi8+DQoJPHN0b3AgIG9mZnNldD0iMSIgc3R5bGU9InN0b3AtY29sb3I6IzAzMDMwNCIvPg0KPC9saW5lYXJHcmFkaWVudD4NCjxwYXRoIGZpbGw9InVybCgjU1ZHSURfNV8pIiBkPSJNODcuNjA3NDIxOSwzaC03NUMxMC45NTA2ODM2LDMsMTAsNC4zNDI3NzM0LDEwLDZ2MzFoMVY2YzAtMS4xMDQ0OTIyLDAuNTAyOTI5Ny0yLDEuNjA3NDIxOS0yaDc1DQoJQzg4LjcxMTkxNDEsNCw5MCw0Ljg5NTUwNzgsOTAsNnYzMWgxVjZDOTEsNC4zNDI3NzM0LDg5LjI2MzY3MTksMyw4Ny42MDc0MjE5LDN6Ii8+DQo8cGF0aCBvcGFjaXR5PSIwLjEyIiBmaWxsPSIjRkZGRkZGIiBkPSJNODcuNjA3NDIxOSwzaC03NUMxMC45NTA2ODM2LDMsMTAsNC4zNDI3NzM0LDEwLDZ2MzFoMVY2DQoJYzAtMS4xMDQ0OTIyLDAuNTAyOTI5Ny0yLDEuNjA3NDIxOS0yaDc1Qzg4LjcxMTkxNDEsNCw5MCw0Ljg5NTUwNzgsOTAsNnYzMWgxVjZDOTEsNC4zNDI3NzM0LDg5LjI2MzY3MTksMyw4Ny42MDc0MjE5LDN6Ii8+DQo8cGF0aCBvcGFjaXR5PSIwLjIiIGQ9Ik04Ny42MDc0MjE5LDRoLTc1QzExLjUwNDM5NDUsNCwxMSw0Ljg5NzQ2MDksMTEsNnYzMWgxVjZjMC0wLjU1MjczNDQsMC4wNTUxNzU4LTEsMC42MDc0MjE5LTFoNzUNCglDODguMTYwMTU2Miw1LDg5LDUuNDQ3MjY1Niw4OSw2djMxaDFWNkM5MCw0Ljg5NzQ2MDksODguNzEwOTM3NSw0LDg3LjYwNzQyMTksNHoiLz4NCjxsaW5lYXJHcmFkaWVudCBpZD0iU1ZHSURfNl8iIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiB4MT0iNTAuNSIgeTE9IjIiIHgyPSI1MC40OTk5OTYyIiB5Mj0iNTQuMDAwODUwNyI+DQoJPHN0b3AgIG9mZnNldD0iMCIgc3R5bGU9InN0b3AtY29sb3I6IzMxMzUzOSIvPg0KCTxzdG9wICBvZmZzZXQ9IjEiIHN0eWxlPSJzdG9wLWNvbG9yOiMwMDAwMDAiLz4NCjwvbGluZWFyR3JhZGllbnQ+DQo8cGF0aCBmaWxsPSJ1cmwoI1NWR0lEXzZfKSIgZD0iTTg3LjYwNzQyMTksNGgtNzVDMTEuNTA0Mzk0NSw0LDExLDQuODk3NDYwOSwxMSw2djMxaDFWNmMwLTAuNTUyNzM0NCwwLjA1NTE3NTgtMSwwLjYwNzQyMTktMWg3NQ0KCUM4OC4xNjAxNTYyLDUsODksNS40NDcyNjU2LDg5LDZ2MzFoMVY2QzkwLDQuODk3NDYwOSw4OC43MTA5Mzc1LDQsODcuNjA3NDIxOSw0eiIvPg0KPGxpbmVhckdyYWRpZW50IGlkPSJTVkdJRF83XyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIHgxPSI1MC41IiB5MT0iMyIgeDI9IjUwLjQ5OTk5NjIiIHkyPSI1My4wMDA2ODY2Ij4NCgk8c3RvcCAgb2Zmc2V0PSIwIiBzdHlsZT0ic3RvcC1jb2xvcjojNDM0ODREIi8+DQoJPHN0b3AgIG9mZnNldD0iMSIgc3R5bGU9InN0b3AtY29sb3I6IzAzMDMwNCIvPg0KPC9saW5lYXJHcmFkaWVudD4NCjxwYXRoIGZpbGw9InVybCgjU1ZHSURfN18pIiBkPSJNODcuNjA3NDIxOSw0aC03NUMxMS41MDQzOTQ1LDQsMTEsNC44OTc0NjA5LDExLDZ2MzFoMVY2YzAtMC41NTI3MzQ0LDAuMDU1MTc1OC0xLDAuNjA3NDIxOS0xaDc1DQoJQzg4LjE2MDE1NjIsNSw4OSw1LjQ0NzI2NTYsODksNnYzMWgxVjZDOTAsNC44OTc0NjA5LDg4LjcxMDkzNzUsNCw4Ny42MDc0MjE5LDR6Ii8+DQo8cGF0aCBvcGFjaXR5PSIwLjIiIGQ9Ik0xMi42MDc0MjE5LDRjLTEuMTA0NDkyMiwwLTIsMC44OTU1MDc4LTIsMkMxMC42MDc0MjE5LDQuODk3NDYwOSwxMS41MDQzOTQ1LDQsMTIuNjA3NDIxOSw0eiIvPg0KPGxpbmVhckdyYWRpZW50IGlkPSJTVkdJRF84XyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIHgxPSIxMS42MDc0MjE5IiB5MT0iMiIgeDI9IjExLjYwNzQyIiB5Mj0iNTQiPg0KCTxzdG9wICBvZmZzZXQ9IjAiIHN0eWxlPSJzdG9wLWNvbG9yOiMzMTM1MzkiLz4NCgk8c3RvcCAgb2Zmc2V0PSIxIiBzdHlsZT0ic3RvcC1jb2xvcjojMDAwMDAwIi8+DQo8L2xpbmVhckdyYWRpZW50Pg0KPHBhdGggZmlsbD0idXJsKCNTVkdJRF84XykiIGQ9Ik0xMi42MDc0MjE5LDRjLTEuMTA0NDkyMiwwLTIsMC44OTU1MDc4LTIsMkMxMC42MDc0MjE5LDQuODk3NDYwOSwxMS41MDQzOTQ1LDQsMTIuNjA3NDIxOSw0eiIvPg0KPGxpbmVhckdyYWRpZW50IGlkPSJTVkdJRF85XyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIHgxPSIxMS42MDc0MjE5IiB5MT0iMyIgeDI9IjExLjYwNzQyIiB5Mj0iNTMiPg0KCTxzdG9wICBvZmZzZXQ9IjAiIHN0eWxlPSJzdG9wLWNvbG9yOiM0MzQ4NEQiLz4NCgk8c3RvcCAgb2Zmc2V0PSIxIiBzdHlsZT0ic3RvcC1jb2xvcjojMDMwMzA0Ii8+DQo8L2xpbmVhckdyYWRpZW50Pg0KPHBhdGggZmlsbD0idXJsKCNTVkdJRF85XykiIGQ9Ik0xMi42MDc0MjE5LDRjLTEuMTA0NDkyMiwwLTIsMC44OTU1MDc4LTIsMkMxMC42MDc0MjE5LDQuODk3NDYwOSwxMS41MDQzOTQ1LDQsMTIuNjA3NDIxOSw0eiIvPg0KPHBhdGggb3BhY2l0eT0iMC4xMiIgZmlsbD0iI0ZGRkZGRiIgZD0iTTEyLjYwNzQyMTksNGMtMS4xMDQ0OTIyLDAtMiwwLjg5NTUwNzgtMiwyQzEwLjYwNzQyMTksNC44OTc0NjA5LDExLjUwNDM5NDUsNCwxMi42MDc0MjE5LDQNCgl6Ii8+DQo8cGF0aCBvcGFjaXR5PSIwLjA4IiBmaWxsPSIjRkZGRkZGIiBkPSJNMTIuNjA3NDIxOSw0Yy0xLjEwNDQ5MjIsMC0yLDAuODk1NTA3OC0yLDJDMTAuNjA3NDIxOSw0Ljg5NzQ2MDksMTEuNTA0Mzk0NSw0LDEyLjYwNzQyMTksNA0KCXoiLz4NCjxwYXRoIG9wYWNpdHk9IjAuMiIgZD0iTTg5LjYwNzQyMTksNmMwLTEuMTA0NDkyMi0wLjg5NTUwNzgtMi0yLTJDODguNzEwOTM3NSw0LDg5LjYwNzQyMTksNC44OTc0NjA5LDg5LjYwNzQyMTksNnoiLz4NCjxsaW5lYXJHcmFkaWVudCBpZD0iU1ZHSURfMTBfIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDE9Ijg4LjYwNzQyMTkiIHkxPSIyIiB4Mj0iODguNjA3NDIxOSIgeTI9IjU0Ij4NCgk8c3RvcCAgb2Zmc2V0PSIwIiBzdHlsZT0ic3RvcC1jb2xvcjojMzEzNTM5Ii8+DQoJPHN0b3AgIG9mZnNldD0iMSIgc3R5bGU9InN0b3AtY29sb3I6IzAwMDAwMCIvPg0KPC9saW5lYXJHcmFkaWVudD4NCjxwYXRoIGZpbGw9InVybCgjU1ZHSURfMTBfKSIgZD0iTTg5LjYwNzQyMTksNmMwLTEuMTA0NDkyMi0wLjg5NTUwNzgtMi0yLTJDODguNzEwOTM3NSw0LDg5LjYwNzQyMTksNC44OTc0NjA5LDg5LjYwNzQyMTksNnoiLz4NCjxsaW5lYXJHcmFkaWVudCBpZD0iU1ZHSURfMTFfIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDE9Ijg4LjYwNzQyMTkiIHkxPSIzIiB4Mj0iODguNjA3NDIxOSIgeTI9IjUzIj4NCgk8c3RvcCAgb2Zmc2V0PSIwIiBzdHlsZT0ic3RvcC1jb2xvcjojNDM0ODREIi8+DQoJPHN0b3AgIG9mZnNldD0iMSIgc3R5bGU9InN0b3AtY29sb3I6IzAzMDMwNCIvPg0KPC9saW5lYXJHcmFkaWVudD4NCjxwYXRoIGZpbGw9InVybCgjU1ZHSURfMTFfKSIgZD0iTTg5LjYwNzQyMTksNmMwLTEuMTA0NDkyMi0wLjg5NTUwNzgtMi0yLTJDODguNzEwOTM3NSw0LDg5LjYwNzQyMTksNC44OTc0NjA5LDg5LjYwNzQyMTksNnoiLz4NCjxwYXRoIG9wYWNpdHk9IjAuMTIiIGZpbGw9IiNGRkZGRkYiIGQ9Ik04OS42MDc0MjE5LDZjMC0xLjEwNDQ5MjItMC44OTU1MDc4LTItMi0yQzg4LjcxMDkzNzUsNCw4OS42MDc0MjE5LDQuODk3NDYwOSw4OS42MDc0MjE5LDZ6DQoJIi8+DQo8cGF0aCBvcGFjaXR5PSIwLjA4IiBmaWxsPSIjRkZGRkZGIiBkPSJNODkuNjA3NDIxOSw2YzAtMS4xMDQ0OTIyLTAuODk1NTA3OC0yLTItMkM4OC43MTA5Mzc1LDQsODkuNjA3NDIxOSw0Ljg5NzQ2MDksODkuNjA3NDIxOSw2eg0KCSIvPg0KPGc+DQoJPGcgb3BhY2l0eT0iMC41Ij4NCgkJPHBhdGggZD0iTTU1LjE1NDI5NjksMTQuMzU4Mzk4NGwtMi4yMjk0OTIyLTUuNzk4ODI4MWwtMTcuNTA3ODEyNSw2LjczMjQyMTlsNS4wNTM3MTA5LDEzLjE0MTYwMTZ2MC4wMDU4NTk0aDE4Ljc1NzgxMjUNCgkJCVYxNC4zNTgzOTg0SDU1LjE1NDI5Njl6IE01My40Nzg1MTU2LDE0LjM1ODM5ODRINDIuMjA1MDc4MWw5LjgyMTI4OTEtMy43NzYzNjcyTDUzLjQ3ODUxNTYsMTQuMzU4Mzk4NHogTTM3LjQzODQ3NjYsMTYuMTkxNDA2Mg0KCQkJbDMuMDMyMjI2Ni0xLjE2Njk5MjJ2OS4wNDg4MjgxTDM3LjQzODQ3NjYsMTYuMTkxNDA2MnogTTQyLjAzNTE1NjIsMjYuODc1VjE1LjkyMjg1MTZoMTUuNjI3OTI5N1YyNi44NzVINDIuMDM1MTU2MnoiLz4NCgkJPHBvbHlnb24gcG9pbnRzPSI1NC41NzkxMDE2LDIwLjE1NzIyNjYgNTMuMzI4MTI1LDIwLjU3MzI0MjIgNTIuMjQ0MTQwNiwxOC41MjkyOTY5IDQ4Ljc0MDIzNDQsMjMuNTg3ODkwNiA0Ni44NjMyODEyLDIyLjM3ODkwNjIgDQoJCQk0My45MjE4NzUsMjUuNTczMjQyMiA1Ni4yNDgwNDY5LDI1LjU3MzI0MjIgCQkiLz4NCgkJPGNpcmNsZSBjeD0iNDUuNDc1NTg1OSIgY3k9IjE5LjE2NDA2MjUiIHI9IjEuNDgwNDY4OCIvPg0KCTwvZz4NCgk8Zz4NCgkJPGc+DQoJCQk8cGF0aCBmaWxsPSIjRkZGRkZGIiBkPSJNNTUuNjU0Mjk2OSwxNC44NTgzOTg0bC0yLjIyOTQ5MjItNS43OTg4MjgxbC0xNy41MDc4MTI1LDYuNzMyNDIxOWw1LjA1MzcxMDksMTMuMTQxNjAxNnYwLjAwNTg1OTQNCgkJCQloMTguNzU3ODEyNVYxNC44NTgzOTg0SDU1LjY1NDI5Njl6IE01My45Nzg1MTU2LDE0Ljg1ODM5ODRINDIuNzA1MDc4MWw5LjgyMTI4OTEtMy43NzYzNjcyTDUzLjk3ODUxNTYsMTQuODU4Mzk4NHoNCgkJCQkgTTM3LjkzODQ3NjYsMTYuNjkxNDA2MmwzLjAzMjIyNjYtMS4xNjY5OTIydjkuMDQ4ODI4MUwzNy45Mzg0NzY2LDE2LjY5MTQwNjJ6IE00Mi41MzUxNTYyLDI3LjM3NVYxNi40MjI4NTE2aDE1LjYyNzkyOTdWMjcuMzc1DQoJCQkJSDQyLjUzNTE1NjJ6Ii8+DQoJCQk8cG9seWdvbiBmaWxsPSIjRkZGRkZGIiBwb2ludHM9IjU1LjA3OTEwMTYsMjAuNjU3MjI2NiA1My44MjgxMjUsMjEuMDczMjQyMiA1Mi43NDQxNDA2LDE5LjAyOTI5NjkgNDkuMjQwMjM0NCwyNC4wODc4OTA2IA0KCQkJCTQ3LjM2MzI4MTIsMjIuODc4OTA2MiA0NC40MjE4NzUsMjYuMDczMjQyMiA1Ni43NDgwNDY5LDI2LjA3MzI0MjIgCQkJIi8+DQoJCQk8Y2lyY2xlIGZpbGw9IiNGRkZGRkYiIGN4PSI0NS45NzU1ODU5IiBjeT0iMTkuNjY0MDYyNSIgcj0iMS40ODA0Njg4Ii8+DQoJCTwvZz4NCgk8L2c+DQo8L2c+DQo8L3N2Zz4NCg==)'
};