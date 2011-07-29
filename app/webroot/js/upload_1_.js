var list_count=0;
var tn_count=0;
var audio_count=0;
var thumb_count=0;
var complete=false;
var dash_flash=false;
var swf_path='';
var upload_url='';
var max_size=0;
var dash_av=false;
var dash_water=false;
var dash_prv=false;
var vid_prv=false;
var dash_audio=false;
var tit = '';
function what_type(){
	if(dash_flash){
		return 1;
	}else if(dash_av||dash_water){
		return 5;
	}else if(dash_prv||vid_prv){
		return 3;
	}else if(dash_audio){
		return 4;
	}else{
		var opt=$F("upload_type");
		return opt;
	}
}
function what_title(){
	return title;
}

function set_av_upload(){
    if(!dash_av) {
        var dim = $('browse-button').getDimensions();
        var h = dim.height;
        var w = dim.width;
        var flashvars={
            aid:"0",
            dash:"2",
            max_size:max_size,
            upload_url:upload_url
        }
        var params={
            allowScriptAccess:"always",
            wmode:"transparent"
        }
        var attributes={
            id:"_uploader"
        }
        swfobject.embedSWF(swf_path,"flash-target",w,h,"9",false,flashvars,params,attributes,after_swf_init);
        dash_av = true;
    }
}

function on_select_avatar(list,tn_list,thumb_list,audio_list,rejects){
	if(list.length>0){
		var new_av=list[0].name;
		$('avatar-feedback').writeAttribute('class', '').update('File selected: '+new_av);
		upload_avatar(new_av);
	}
}

function upload_avatar(t){
    complete = false;
	$("_uploader").js_upload();
    $('avatar-feedback').addClassName('hourglass').update('Upload in progress ('+t+')');
	on_progress();
}

function on_progress(){
    try {
        var progress=$("_uploader").js_check_progress();
        if(progress>=100){
            $('progress').style.width='100%';
        }else{
            mes.pingProgress(progress);
            window.setTimeout(on_progress,50);
        }
    } catch (e) {
//        console.log('error on_progress')
    }

}

function done(){
    if(!complete) {
        $('progress').style.width='100%';
        on_complete();
    }
}

function rm_file(file_name,t){
	$("_uploader").js_remove_file(file_name,t);
}

function on_complete(){
    if(!complete) {
        complete=true;
        avatar_preview();
    }
}

function http_error(o){
	mes.hello(o.err+"<br />An error occured when trying to upload your image."+"<br />", 4, false);
    mes.kill('messenger-upload-avatar', true);
}

function redirect(){
	redir="products/index/"+aid;
	location.href=base_url+redir;
}
function convert_bits(bytes){
	kb=bytes/1024;
	if(kb<1024){
		return Math.round(kb)+' KB';
	}else{
		mb=kb/1024;
		return Math.round(mb*10)/10+' MB';
	}
}

function exit_uploader(){
    new Ajax.Request(base_url+'products/exit_uploader', {
        onComplete: function() {
            document.fire('dom:uploaderfinished');
        },
        onCreate: function() {
            mes.kill('messenger-upload-avatar', true);
            p.reset();
        },
        onFailure: function(transport) {
            alert('Could not clear temporary file !')
        }
    });
}

function start_file(fn){
	//mes.hello("Uploading"+' '+fn+'...',1,false,true);
}

function process_file(fn){
	//mes.hello("Processing"+' '+fn+'...',1,false,true);
}

function reset_avatar(id){
    var url = base_url+"products/reset_avatar/"+id;
    var tmbs = $$('img.tmb_'+id);
    var lgs = $$('div#master img');
    var imgs = tmbs.concat(lgs);
    new Ajax.Request(url,{
		onComplete:function(transport){
            if (parseInt(transport.status) > 300) {
                //alert('error: status > 300')
                return
            }
            tmbs.each(function(el) {
                el.src = '/img/default_avatar.jpg';
                el.onload = function() {
                    Effect.Appear(el);
                }
            }, this)
            //parsePreviewString(id);
            flushRow(id);
            $('broken-image').removeClassName('broken');
            $('default-icon-button').disabled = true;
            $('default-icon-button').addClassName('disabled');
            $('messenger-upload-avatar').redraw_hack();
            reset_info();
//            p.load(p.master(), '/img/default_avatar.jpg.big.jpg', {duration: 1, maxHeight: 450, isFinal: 'yes'});//, callback: p.reset.bind(p, true)});
            p.load(p.master(), '/img/default_avatar.jpg.big.jpg', { isFinal: true, duration: 0.5})
		}.bind(this),
        onSuccess: function() {
            tmbs.each(function(el) {
                el.src = '';
                el.setOpacity(0.0001);
            })
        },
        onCreate: function() {
            //
        },
        onFailure: function(transport) {
            trigger_ajax_error(transport);
        }
	});
}

//-------------- preview ---------------

function avatar_preview(){
    var url = base_url+"products/avatar_uri/tmp/1/1/2";
    var img_new = p.slave().down('img');
    var fb = $('avatar-feedback');
    new Ajax.Request(url, {
        onComplete:function(transport){
            var src = '';
            if (parseInt(transport.status) > 300) {
                alert('error: status > 300')
                return
            }
            var json = transport.responseText.evalJSON();
            if(json.src_tmp != 'nofile') {
                src = json.src_tmp;
            } else {
                fb.updateClassNameAndContent('exclamation', 'Warning! No answer from server!');
            }
            
            var options = {
                duration: 0.7,
                begin: function() {
                    
                    new Effect.Morph('progress', {
                        style: 'width:0%;',
                        duration: 0.7
                    });
                    $$('#slave.ontop').each(function(el) {
                        el.removeClassName('loading');
                    });
                    fb.updateClassNameAndContent('', 'This is your Preview').smoothUpdate.bind(fb).delay(1, 'Click inside the area below to toggle between current and new Image. To activate press \'Activate\'.');
                },
                inter: function() {
                    fb.updateClassNameAndContent('', 'Preview Mode').smoothUpdate.bind(fb).delay(1, 'Click inside the area below to toggle between current and new Image. To activate press \'Activate\'.');;
                },
                basic: function() {
                    fb.updateClassNameAndContent('', 'Active Icon Mode').smoothUpdate.bind(fb).delay(1, 'Click inside the area below to toggle between current and new Image. To activate press \'Activate\'.');;
                },
                finale: function() {
                    fb.updateClassNameAndContent('', 'The new Icon has been activated.').smoothUpdate.bind(fb).delay(3, 'Change or Reset Icon');
                }
            }
            fb.updateClassNameAndContent.bind(fb).delay(0.5, 'hourglass', 'Loading Image...');
            p.load(src, options);
        }.bind(this),
        onSuccess: function() {
            fb.updateClassNameAndContent('accept', 'Waiting for Server Response... OK');
        }.bind(this),
        onCreate: function() {
            fb.updateClassNameAndContent('hourglass', 'Waiting for Server Response...');
            $$('#slave.ontop').each(function(el) {
                el.addClassName('loading');
            });
        },
        onFailure: function(transport) {
            trigger_ajax_error(transport);
        }
    });
}

function avatar_make_thumbs(id) {
    $$('img.tmb_'+id).each(function(img) {
        this.avatar_use(id, img, {
            width:  50,
            height: 50,
            square: 1
        })
    }, this)
    $$('div#master img').map(function(img) {
        this.avatar_use(id, img, {
            width:  400,
            height: 600,
            square: 3,
            isThumb: false
        })
    }, this)
    $('preview-submit-button').disabled = true;
    $('preview-submit-button').addClassName('disabled');
    $('default-icon-button').disabled = false;
    $('default-icon-button').removeClassName('disabled');
    //reset_info();
}

function avatar_use(id, image, options){
    var defaults = {
        width:    50,
        height:   50,
        square:   1,
        isThumb: true
    }
    var o = $H(defaults).merge(options).toObject();
	var url = base_url+"products/avatar_uri/"+id+'/'+o.width+'/'+o.height+'/'+o.square;
    var img_old = image;
	new Ajax.Request(url,{
		onComplete:function(transport){
            if (parseInt(transport.status) > 300) {
                alert('error: status > 300')
                return
            }
            var json = transport.responseText.evalJSON();
            var src = json.src_tmp;
            var img = new Image();
            var loadListener = function() {
                if(!o.isThumb) {
                    $('broken-image').removeClassName('broken');
                    $('messenger-upload-avatar').redraw_hack();
                    flushRow(id);
                    p.use();
                }
            }
            
            img.src = '';
            img.addEventListener('load', loadListener, false)
            img.src = src;
            img_old.src = img.src;
        }.bind(this),
        onSuccess: function() {},
        onCreate: function() {
            if(!o.isThumb) {
                var fb = $('avatar-feedback')
                fb.updateClassNameAndContent('hourglass', 'Activating...');
            }
        },
        onFailure: function(transport) {
            img_old.setOpacity(1);
            trigger_ajax_error(transport);
        }
	});
}

function parsePreviewString(id, opts) {
    var el, str_old, arr, conc, str_new, defaults, o;
    var options = opts || {};
    el= $(id).down('td.specs');
    str_old = el.innerHTML;
    arr = str_old.split('||');
    defaults = {
        id: arr[0],
        src:   '/img/default_avatar.jpg.big.jpg',
        title:   arr[2],
        company: arr[3],
        keys: arr.slice(4)
    }
    o = $H(defaults).merge(options).toObject();
    conc = Object.values(o);
    conc.flatten();
    str_new = conc.join('||');
    return el.update(str_new);
}

function after_swf_init(e){
    if(!e.success) {
        alert('Could not load Flash!')
        return;
    }
    Element.clonePosition(e.ref.id, 'browse-button', {offsetLeft: 0});//offsetLeft: 100
    var w = parseInt($(e.ref.id).getStyle('width'))+'px';//+2
    var h = parseInt($(e.ref.id).getStyle('height'))+'px';//+2
    $(e.ref.id).setStyle({
        width: w,
        height: h,
        position:'absolute',
        top:0,
        left:0,
        zIndex:100000
    });
}