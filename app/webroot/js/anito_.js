var DelayedObserver = Class.create({
    initialize: function(element, eventname, delay, callback) {
        this.delay = delay || 0.5;
        this.element = $(element);
        this.eventname = eventname;
        this.callback = callback;
        this.timer = null;
        this.lastValue = $F(this.element);
        Event.observe(this.element, eventname, this.delayedListener.bindAsEventListener(this));
    },
    delayedListener: function(event) {
        if (this.eventname == 'keyup') {
            if (this.lastValue == $F(this.element)) {
                return;
            }
        }
        if (this.timer) clearTimeout(this.timer);
        this.timer = setTimeout(this.onTimerEvent.bind(this, event), this.delay * 1000);
        this.lastValue = $F(this.element);
    },
    onTimerEvent: function(event) {
        this.timer = null;
        this.callback(event, this.element, $F(this.element));
    }
});

var Focus = Class.create({
    initialize: function(name) {
        this._defaultClass = name;
        this.defaultValue;
        this.blurObserver = null;
        this.keyUpObserver = null;
    },
    defaultClass: function() {
        return this._defaultClass;
    },
    start: function() {
        var defaultClass = this.defaultClass();
        var label = $("default-value");
        /* Get the default value */
        this.defaultValue = label.innerHTML;

        /* Get the associated input */
        var input = $(label.htmlFor);

        /* Get the form */
        var form = input.up('form');

        /* Store information about the input being a password so we can use this later */
        var isPassword = (input.type && input.type == "password");

        if (isPassword) {
            var default_password = new Element('input', {
                'type': 'text',
                'class': defaultClass,
                'value': this.defaultValue
            }).hide();
            if (input.readAttribute('tabindex'))
            default_password.writeAttribute('tabindex', input.readAttribute('tabindex'));
            input.insert({
                after: default_password
            });
            default_password.observe("focus", function(event) {
                default_password.hide();
                input.show().focus();
            });
        }

        /* When input gets focus, set value to "" if value is default value */
        input.observe("focus", function(event) {
            if (input.value == this.defaultValue) {
                if (!isPassword) {
                    input.value = "";
                    input.removeClassName(defaultClass);
                } else {
                    default_password.hide();
                    input.show();
                }
            }
        });

        input.observe("keydown", function(ev) {
            if (ev.keyCode == Event.KEY_ESC) {
                ev.stop();
                input.clear();
                input.addClassName(defaultClass);
                input.blur();
                $('no-filter').hide();
                if ($F(input) != '') {
                    roo.search(null, true);
                }
            }
        });

        var keyupCallback = function(ev, e, v) {
            if (v == "") {
                $('no-filter').hide();
                roo.search(true);

            } else if (v != this.defaultValue && v != "") {
                $('no-filter').show();
                roo.search(v);
            }
        }

        /* When input loses focus, set value to default value if value = "" */

        var blurCallback = function(ev, e, v) {
            if (v == "" || v == this.defaultValue) {
                if (!isPassword) {
                    e.addClassName(defaultClass);
                    if (v == '') {
                        e.value = this.defaultValue;
                        roo.search(true);
                    }
                } else {
                    e.hide();
                    default_password.show();
                }
            }
        }

        if(!this.blurObserver) this.blurObserver = new DelayedObserver(input, 'blur', 1, blurCallback.bind(this))
        if(!this.keyUpObserver) this.keyUpObserver = new DelayedObserver(input, 'keyup', 1, keyupCallback.bind(this))


        /* Set default values to "" when form is submitted */
        if (form) {
            form.observe("submit", function(event) {
                if (input.value == this.defaultValue) {
                    input.value = "";
                }
            });
        }

        /* Set default value when page loads */
        if (input.value == "" || input.value == this.defaultValue) {
            if (!isPassword) {
                input.addClassName(defaultClass);
                input.value = this.defaultValue;
            } else {
                input.hide();
                default_password.show();
            }
        }
    },
    unwatch: function() {
        var label = $("default-value");
        var input = $(label.htmlFor);
        input.stopObserving('blur');
        input.stopObserving('keydown');
    },
    clear_search: function() {
        var defaultClass = this.defaultClass();
        clear_content('ProductQuery');
        $('no-filter').hide();
        $('ProductQuery').addClassName(defaultClass);
        $('ProductQuery').value = this.defaultValue;
        roo.search(true);
    }
});

function loadUploadDialogue(e) {
    var id = roo.id;
    var title = $(id).down('td').title;
    var src = Event.element(e).src;
    //p.load(p.slave(), src, {maxHeight: 500});
    mes.dialogue('messenger-upload-avatar', 'Modify Icon '+title, 'Initializing...', true); // do it quickly
    document.fire('dom:uploaderstarted');
    set_av_upload();
    reset_info();
}

function reset_info(info) {
    var text = info || 'Change or Reset Icon';
    var fb = $('avatar-feedback');
    new Effect.Morph(fb, {
        queue: {
            scope: 'reset_info_scope',
            position: 'end'
        },
        style: 'opacity: 0.01',
        afterFinish: function() {
            
            fb.writeAttribute('class', '').update(text);
            new Effect.Morph(fb, {
                queue: {
                    scope: 'reset_info_scope',
                    position: 'end'
                },
                style: 'opacity: 1' 
            })
        }
    })
}
function resetLoaderBar() {
    new Effect.Morph('progress', {style: 'width:0%;', duration: 0.7});
}
function initObserver(elm) {
    $$(elm).each(function(el) {
        el.observe('mouseover', function(e) {
            e.stop();
            if(el.up('div').hasClassName('ontop')) {
                el.appear({duration:0.2});
            }
        })
        el.observe('mouseout', function(e) {
            e.stop();
            if(el.up('div').hasClassName('ontop')) {
                el.fade({to: 0.5, duration:0.2});
            }
        })
    })
}

function set_submit_button(div_on_top, div_new) {
    if(div_on_top == div_new) {
        $('preview-submit-button').disabled = true;
        $('preview-submit-button').addClassName('disabled');
    } else {
        $('preview-submit-button').disabled = false;
        $('preview-submit-button').removeClassName('disabled');
    }
}

function linkToActiveRecord(sort, direction) {
    $$(".active-page a").each(function(el) {
        el.observe("click", function(event) {
            event.stop();
            new Ajax.Updater("paginate-content", base_url + "products/index/sort:" + sort + "/direction:" + direction, {
                evalScripts: true,
                onComplete: function(transport) {
                    pagination_spin(false, 'page-busy-indicator2');
                },
                onCreate: function(transport) {
                    pagination_spin(true, 'page-busy-indicator2');
                },
                onFailure: function(response, jsonHeader) {
                    pagination_failure(response, jsonHeader);
                }
            });
        })
    })
}

function cancel_info(id) {
    new Effect.Fade($(id), {
        duration: 0.5,
        afterFinish: function() {
            $(id).next().show()
        }
    })
}

function clear_content(id) {
    if ($(id).value == fcs.defaultValue || $(id).value == '') return;
    $(id).clear();
}

function pagination_spin(status, id) {
    if (!id) return;
    if (status)
    $(id).appear({
        from: 0.05,
        to: 1,
        duration: 0.1
    });
    else
    $(id).fade({
        from: 1,
        to: 0,
        duration: 0.5
    });
}

function pagination_failure(response, jsonHeader) {
    trigger_ajax_error(response, true);
}

function effect_tooltip(id) {
    var myscope = UUID();
    var min = 2,
        max = 5;
    // try position horizontally
    // take half the width as tooltips horizontal position
    if ($(id).next().select('input[type=text]').size() != 0) {
        var rnd = min + parseInt(Math.random() * (max - min + 1));
        var child_input_width = $(id).next().select('input[type=text]')[0].getStyle('width');
        var new_width = parseInt(parseInt(child_input_width) / rnd) + 'px';
        $(id).setStyle({
            'left': new_width
        });
    }
    new Effect.Appear(id, {
        queue: {
            position: 'end',
            scope: myscope
        },
        duration: 0.1
    });
    $(id).tooltip_effect = new Effect.Opacity(id, {
        queue: {
            position: 'end',
            scope: myscope
        },
        from: 1,
        to: 0,
        duration: 1,
        delay: 5,
        afterFinish: function() {
            if ($(id)) $(id).remove();
        }
    })
}

function effect_cancel(id) {
    if ($(id)) {
        $(id).tooltip_effect.cancel();
        new Effect.Fade(id, {
            duration: 0.3,
            afterFinish: function() {
                $(id).remove();
            }
        })
    }
}

var Preview = {
    cur_preview: null,
    pop: null,
    initialize: function(elements) {
        this.id = 'pop-preview';
        this.elements = elements;
        if(this.pop === null) {
            var the_img = document.createElement('img');
            this.pop = $(this.id);
            this.pop.appendChild(the_img);
            this.pop_img = this.pop.getElementsByTagName('IMG')[0];
            this.pop_img.width = 300;
            this.pop_img.height = 300;
            this.pop_img.onload = function(){
                Preview.go_active();
            };
        }
        Preview.observe(elements);
    },
    observe: function(elements) {
        $$(elements).each(function(el) {
            el.observe('mousemove', function(e) {
                e.stop();
                Preview.up(el, e)
            }.bind(this))
            el.observe('mouseout', function(e) {
                e.stop();
                Preview.bye();
            }.bind(this))
        }, this)
    },
    go_active: function() {
        this.pop_img.style.width = 'auto';
        this.pop_img.style.height = 'auto';
    },
    up: function(el, ev) {
        if(!this.cur_preview) {
            this.cur_preview = {
                pop: this.pop,
                src: this.pop_img.src
            };
            var specs=el.next('td.specs').innerHTML.split('||');
            var id = specs[0]
            var src = specs[1];
            var title = specs[2].substring(0, 55);
            var comp = specs[3].substring(0, 55);
            var serials = specs[4];
            var found = this.cur_preview.src.indexOf(src);
            if(found == -1) {
                this.pop_img.src = specs[1];
                this.pop_img.style.width = '300px';
                this.pop_img.style.height = '300px';
            }
            if(this.cur_preview.id != id) {
                this.cur_preview.id = id;
                var purge_div = new Element('span', {id: 'purge-items'})
                var html = serials != undefined ? serials : 'no serials available'
                purge_div.innerHTML = html;
            }
            $('preview-title').update(title);
            $('preview-company').update(comp);
            $('preview-serials').update(purge_div);
        }
        this.cur_preview.pop.show();
        this.position(ev);
    },
    bye: function() {
        if(this.cur_preview) {
            this.cur_preview.pop.hide();
            this.cur_preview = null;
            if($('purge-items')) {
                $('purge-items').remove();
            }
        }
    },
    position:function(e){
		var preview_h=this.cur_preview.pop.getHeight();
		var preview_w=this.cur_preview.pop.getWidth();
		var dims=Animate.Utilities.getWindowSize();
		var w=dims[0];
		var h=dims[1]-10;
		var top=dims[2];
		var posx=Event.pointerX(e)-(preview_w/2);
		var posy=Event.pointerY(e)+10;
		var maxx=posx+preview_w;
		var minx=posx-preview_w;
		var maxy=posy+preview_h;
		if(maxx>=w){
			posx-=preview_w+20;
		}
		if(maxy>=(h+top)){
			posy-=(preview_h+15);
		}
		this.cur_preview.pop.setStyle({
			top:posy+'px',
			left:posx+'px',
			display:'block'
		});
	}
}

var RowObserver = Class.create({
    initialize: function(name, detailsElement, pageElement) {
        this.name = name;
        this.detailsElement = detailsElement;
        this.pageElement = pageElement;
        this.nextControl = 'next-control';
        this.prevControl = 'prev-control';
        this.nextPage = false;
        this.previousPage = false;
        this.isClosed = false;
        this.id = null;
        this.url = false;
        this.base_index_url = base_url + 'products/index';
        this.actionpage = 'page:';
        this.page = this.actionpage + 1;
        this.activeRecordPage = this.page;
        this.limit = 5;
        this.actual_session_status = undefined;
        this.actual_session_group = undefined;
        this.image;
    },
    search: function (mode) {
        if (!$('top-header') || lgn.session_status() != LOGIN_OK_CODE) return;
        var key, param;
        if(typeof mode === 'boolean') {
            key = 'data[Product][clearquery]=';
            key += mode;
            param = key;
        } else if(typeof mode === 'string')  {
            key = 'data[Product][query]=';
            key += mode;
            param = key;
        }
        
        new Ajax.Updater(roo.pageElement, roo.base_index_url, {
            parameters: param,
            evalScripts: true,
            onCreate: function() {
                pagination_spin(true, 'page-busy-indicator2')
            },
            onFailure: function(response, jsonHeader) {
                pagination_failure(response, jsonHeader);
            },
            onComplete: function(transport) {
                pagination_spin(false, 'page-busy-indicator2')
                new Effect.Appear('paginate-content', {
                    duration: 0.1
                });
            }
        })
    },
    reset: function() {
        this.setActiveRecord(null);
    },
    setup_queryform: function(querykey) {
        var defaultClass = fcs.defaultClass();
        if (querykey == '') return;
        if (querykey == fcs.defaultValue || (querykey == '%')) {
            $('no-filter').hide();
            $('ProductQuery').value = fcs.defaultValue;
            $('ProductQuery').addClassName(defaultClass);
            return;
        }
        if ((querykey != '%') && (querykey !== '')) {
            $('ProductQuery').value = querykey;
            $('ProductQuery').removeClassName(defaultClass);
            $('no-filter').show();
        }
    },
    observe: function(id, url, page, activeRecordPage, querykey) {
        // in case someone else on the same browser session locked out, do a refresh of the login panel
        if((lgn.session_status() != LOGIN_OK_CODE) || (lgn.session_group() != lgn.actual_session_group)) {
            lgn.retrieve_session(lgn.reloadHeader.bind(lgn));
        }
        this.setup_queryform(querykey);
        var firstElement = null;
        url = url.replace(/[\/]$/, '');
        // remove trailing '/'
        url = this.base_index_url + this.page;
        url = (base_url + url).replace(/\/\//, '/');
        // remove all '//''
        this.page = this.actionpage + page;
        this.activeRecordPage = activeRecordPage;
        this.url = url;
        $$(this.name).each(function(el) {
            el.observe('click', this.rowClickHandler.bind(this, el.id, true))
        }, this)
        $('rowcount').observe('change', this.rowSelectHandler.bind(this))
        if (id == NO_ID) {
            /**
             *  Use this to mark the first record and load deatils in the background
             *  used only when server has no active record ID yet, or after deletion
             *  To avoid an (ACL) UNAUTHORIZED error (e.g. on guest accounts) avoid using this
             */
            //return
            firstElement = this.getFirstElement();
            if(firstElement) {
                if (firstElement.id) {
                    this.navigate(firstElement, null);
                } else {
                    mes.kill('messenger-wrap');
                }
            }
        } else if (id == INVALID_ID) {
            /**
             *  AFTER PAGE RELOAD TRIGGERED BY RELOADMAINPAGE IN ROWOBSERVER::NAVIGATE - FOR PAGE FLIP
             *  INVALID_ID flag is set by reloadMainPage() if page flip is necessary
             *  and will be handled by reloadMainPage() itself
             *
             */
        } else if (this.id == INVALID_ID) {
            /**
             *  AFTER PAGE RELOAD TRIGGERED BY ROWOBSERVER::DUPLICATE
             *  if a duplication succeeds, active record ID is reset,
             *  so we do set a new id here and refresh details view
             *  this is a workaround since duplicate doesn't know the new ID
             *  and therefore can't proceed on it's own
             *  instead duplicate triggers an page reload which is handled here
             */
            this.setActiveRecord(id);
            this.navigate($(this.id), null);
        } else {
            /**
             *  
             */
            this.setActiveRecord(id);
            this.initPagingMenu();
        }

    },
    initPagingMenu: function() {
        var arp = this.activeRecordPage;
        var pge = this.page;
        if (arp == pge) {
            $$('div.paging span a:href').each(function(el) {
                el.up('span').removeClassName('activepage');
            })
            $$('div.paging span.friend').each(function(el) {
                el.addClassName('activepage');
            })
            return;
        }
        $$('div.paging').each(function(el, i) {
            var numericLink = null,
            linkArray = [];
            var elem, _arp, _pge, activeRecordHTML, activeRecordLink = null;
            el.select('span a').each(function(e) {
                if (e.hasAttribute('href')) {
                    var href = e.readAttribute('href'), nbr, res, expr;
                    expr = /page:\d+\b/;
                    res = href.match(expr);
                    if (res == arp) {
                        nbr = res[0].match(/[\d\.]+/g);
                        if (e.innerHTML == nbr[0]) {
                            numericLink = e;
                        }
                    }
                    linkArray.push(e);
                }
            }, this)
            linkArray.pop();
            //alert(linkArray.length)
            if (numericLink != null) {
                numericLink.up('span').addClassName('activepage');
                numericLink.up('span').title = 'Active Record Page';
            } else {
                expr = /[\d\.]+/g
                _arp = parseInt(arp.match(expr));
                _pge = parseInt(pge.match(expr));
                if (_arp > _pge && _arp > 0) {
                    elem = linkArray[linkArray.length - 1]
                } else if (_arp < _pge && _arp > 0) {
                    elem = linkArray[0]
                }
                if ($(elem)) {
                    activeRecordLink = elem.up('div').select('span.active-page a')[0];
                    elem.up('span').addClassName('activepage');
                }
            }
            if(activeRecordLink) {
                expr = /[\d\.]+/g;
                nbr = roo.activeRecordPage.match(expr);
                activeRecordLink.update(nbr[0]);
                activeRecordLink.up('span').show();
            }
        }, this)
    },
    rowSelectHandler: function(ev) {
        var element = Event.element(ev);
        if(element.hasAttribute('value') || element.value) {
            this.limit = element.value;
            this.reloadMainPage();
        }
    },
    rowClickHandler: function(id, clicked, cb) {
        var el = $(id);
        if (typeof el === 'undefined' || !el.id) {
            alert('No Element ID specified. Must exit.')
            return;
        }
        tgl.tog(2);
        if(clicked) {
            this.show();
        }
        if (el.id != this.id || !clicked || !$('product-view')) {
            this.setActiveRecord(el.id);
            this.activeRecordPage = this.page
            this.initPagingMenu();
            var url = base_url + "products/view/" + this.id;
            var params = 'data[Product][id]=' + this.id;
            var deferredFn = function(cb){
                if(typeof cb === 'function') {
                    cb();
                }
                p.load(p.master(), $('preview-src').innerHTML, {duration: 1.5, maxHeight: 450});
            };
            var onCreateHandler = function() {
                pagination_spin(true, 'messenger-busy-indicator');
                $('delete-control-wrapper').down('button').disabled = true;
                $('delete-control-wrapper').down('button').addClassName('disabled');
                $('duplicate-control-wrapper').down('button').disabled = true;
                $('duplicate-control-wrapper').down('button').addClassName('disabled');
            }
            var onCompleteHandler = function(transport) {
                if (parseInt(transport.status) > 300) {
                    return
                }
                $('delete-control-wrapper').down('button').disabled = false;
                $('delete-control-wrapper').down('button').removeClassName('disabled');
                $('duplicate-control-wrapper').down('button').disabled = false;
                $('duplicate-control-wrapper').down('button').removeClassName('disabled');
                pagination_spin(false, 'messenger-busy-indicator');
                // defering callback until the script of parsed content is evaluated
                deferredFn.defer(cb);
                
                this.updateControls();
            }
            var onFailureHandler = function(transport) {
                Element.update(this.detailsElement, '');
                trigger_ajax_error(transport);
                pagination_spin(false, 'messenger-busy-indicator');
                this.updateControls();
            }

            new Ajax.Updater(this.detailsElement, url, {
                evalScripts: true,
                parameters: params,
                onCreate: onCreateHandler.bind(this),
                onComplete: onCompleteHandler.bind(this),
                onFailure: onFailureHandler.bind(this)
            });
            $('id-control-wrapper').down('input').value = el.id;
            $('delete-control-wrapper').show().down('button').setAttribute('onClick', 'event.stop(); roo.delete_confirm(\'' + el.id + '\',\'' + el.title + '\'); return false;');
            $('duplicate-control-wrapper').show().down('button').setAttribute('onClick', 'event.stop(); roo.duplicate(\'' + el.id + '\'); return false;');
            mes.update_header('messenger-wrap', 'Products Editor', 'Fields can be edited inline: click inside a value or use the Pen Button. To change the Icon, click on it.');
        } else if (typeof cb === 'function') {
            // we must delay this since this dialogue will not be completely visible at this time (Effect.Appear triggered by RowObserver::show([quick]))
            // and some methods only shoot properly after this is completely opaque
            cb.delay(0.2);
        }
        $$('span.active-page').each(function(el) {
            el.hide();
        })
    },
    navigate: function(el, direction, clicked) {
        var targetElement = null;
        var activeRecord = $(this.id);
        if (activeRecord) {
            if (direction == 'prev') {
                targetElement = this.getPrev(activeRecord);
            } else if (direction == 'next') {
                targetElement = this.getNext(activeRecord);
            } else {
                targetElement = activeRecord;
            }
        } else {
            // no activeRecord means we've had an reload to roll over the dataset (pagescroll)
            // we should now have an fresh loaded element
            if (el) {
                //this.highlight(el.id, false)
                targetElement = el;
            } else {
                targetElement = this.getFirstElement();
                //if(clicked) clicked = true;
            }
        }
        if (!targetElement) {
            this.reloadMainPage(direction, null, true);

        } else {
            this.rowClickHandler(targetElement, clicked);
        }
    },
    reloadMainPage: function(direction, id, sync) {
        var row = null;
        if(sync) {
            this.page = '';
        }
        var url = this.base_index_url + '/' + this.page;
        var params = direction ? 'data[Product][neighbors]=' + direction: '';
        params += id ? params ? '&id' + id: 'id=' + id: '';
        params += '&limit='+this.limit;
        this.setAdjacentPages();
        if (direction == 'prev')
        url = this.previousPage ? this.previousPage: url;
        if (direction == 'next')
        url = this.nextPage ? this.nextPage: url;
        var onCompleteHandler = function(transport) {
            if (parseInt(transport.status) > 300) {
                return
            }
            Element.update(this.pageElement, transport.responseText);
            switch (direction) {
            case 'prev':
                row = this.getLastElement();
                break;
            case 'next':
                row = this.getFirstElement();
                break;
            default:
                row = id ? $(id) ? $(id) : null : null;
            }
            if (sync) {
                // why use defere here?
                // the freshly loaded page triggers RowObserver::observe which causes sometimes
                // the active record beeing updated AFTER this handler is triggered !
                // in consequence RowObserver::navigate uses the wrong active record and we must
                // defere it until the interpreter is idle
                // so this ensures we really have the most up to date RowObserver::id to work with
                if (row) {
                    this.navigate.bind(this).defer(row, direction);
                } else {
                    createQ('Record is not available for editing!<br>Check the Following:<br>* Filter<br>* Record is available', 'error');
                }
            } else {
                this.updateControls();
            }
        }
        var onFailureHandler = function(transport) {
            trigger_ajax_error(transport);
        }
        new Ajax.Request(url, {
            method: 'post',
            parameters: params,
            evalScripts: true,
            onComplete: onCompleteHandler.bind(this),
            onFailure: onFailureHandler.bind(this)
        })
    },
    show: function(quick) {
        mes.dialogue('messenger-wrap', null, null, quick);
        this.isClosed = false;
        this.updateControls();
    },
    getFirstElement: function() {
        return $$(this.name)[0];
    },
    getLastElement: function() {
        return $$(this.name + ":last-child")[0];
    },
    close: function(quick) {
        mes.kill('messenger-wrap', quick);
        this.isClosed = true;
    },
    delete_confirm: function(id) {
        var title = $(id).down('td').title;
        mes.dialogue_in('messenger-confirm', 'Delete Record <b>'+ title +'</b> ?', 'This action is non-reversible !', 'This action is non-reversible !');
        this.prepare_for_delete(id);
    },
    prepare_for_delete: function(id) {
        $('confirm-delete').stopObserving('click');
        $('confirm-delete').observe('click',
        function() {
            this.del(id);
            mes.dialogue_out('messenger-confirm', false);
        }.bind(this))
    },
    del: function(id) {
        var el = id ? $(id) : $(this.id);
        if (!el) return;
        var onCompleteHandler = function(transport) {
            if (parseInt(transport.status) > 300) {
                return
            }
            var json = transport.responseText.evalJSON();
            var q_mode = json.value == 'success' ? 'dark' : 'error';
            createQ(json.flash, q_mode);
            this.reset();
            el.fade({
                from: 1,
                to: 0.05,
                duration: 0.02,
                afterFinish: function() {
                    this.reloadMainPage();
                }.bind(this)
            });
            this.id_for_delete = null;
        }
        var onFailureHandler = function(transport) {
            trigger_ajax_error(transport);
        }
        new Ajax.Request(base_url + 'Products/delete/' + id, {
            onComplete: onCompleteHandler.bind(this),
            onFailure: onFailureHandler.bind(this)
        })
    },


    /* This method just commands the server to duplicate a record,
     * it is not designed to receive any information about the newly created (active) record
     * rather it receives a status report only.
     * However the server keeps track of our (active) record, so we just have to call
     * ROWOBSERVER::RELOADMAINPAGE method which in turn will open up the correct page,
     * highlight the record and, if opened, load the record details automagically into our editor
    */
    duplicate: function(id) {
        if (!id) return;
        var onCreateHandler = function() {
            $('delete-control-wrapper').down('button').disabled = true;
            $('delete-control-wrapper').down('button').addClassName('disabled');
        }
        var onCompleteHandler = function(transport) {
            if (parseInt(transport.status) > 300) {
                return
            }

            var json = transport.responseText.evalJSON();
            var q_mode = json.value == 'success' ? 'dark' : 'error';
            createQ(json.flash, q_mode);
            if(json.value == 'success') {
                this.page = '';
                this.id = INVALID_ID;
                this.reloadMainPage();
            }
            $('delete-control-wrapper').down('button').disabled = false;
            $('delete-control-wrapper').down('button').removeClassName('disabled');
        }
        var onFailureHandler = function(transport) {
            trigger_ajax_error(transport);
            $('delete-control-wrapper').down('button').disabled = false;
            $('delete-control-wrapper').down('button').removeClassName('disabled');
        }
        new Ajax.Request(base_url + 'products/duplicate/' + id, {
            onCreate: onCreateHandler.bind(this),
            onComplete: onCompleteHandler.bind(this),
            onFailure: onFailureHandler.bind(this)
        });
    },
    add: function() {
        // in case someone else on the same browser session locked out, do a refresh of the login panel
        var doReload = false;
        if(lgn.session_status() != lgn.actual_session_status) {
            doReload = true;
        } else if(lgn.actual_session_group) {
            // considering the case of an user change w/ different credentials during a session
            if(lgn.session_group() != lgn.actual_session_group) {
                doReload = true;
            }
        }
        if(doReload) lgn.retrieve_session(lgn.reloadHeader.bind(lgn));
        
        var el = $(this.id);
        var onCreateHandler = function() {
            pagination_spin(true, 'messenger-busy-indicator');
            $('delete-control-wrapper').hide();
            $('duplicate-control-wrapper').hide();
        }
        var onCompleteHandler = function(transport) {
            if (parseInt(transport.status) > 300) {
                return
            }

            Element.update(this.detailsElement, transport.responseText);
            pagination_spin(false, 'messenger-busy-indicator');

            if ($('ProductAddForm')) {
                $('ProductAddForm').reset();
            }
            if ($('ProductTitle')) {
                $('ProductTitle').focus();
            }
        }
        var onFailureHandler = function(transport) {
            if (parseInt(transport.status) == 500) {
                //
                } else {
                trigger_ajax_error(transport);
                Element.update(this.detailsElement);
            }
            pagination_spin(false, 'messenger-busy-indicator');
            //			mes.dialogue('messenger-alert');
            //			var tgt = this.detailsElement;
            //			var url = base_url+'users/autherror';
            //			$(this.detailsElement).update(transport.status);
            //			triggerAjax.apply(this, [tgt, url, this]);
        }
        if (!$('add-view')) {
            var url = base_url + 'products/add';
            var triggerAjaxRequest = function(url, me) {
                new Ajax.Request(url, {
                    evalScripts: true,
                    onCreate: onCreateHandler.bind(me),
                    onComplete: onCompleteHandler.bind(me),
                    onFailure: onFailureHandler.bind(me)
                })
            }
            triggerAjaxRequest(url, this);
        }
        mes.update_header('messenger-wrap', 'Create a new Record', 'Add new Records to your Database');
        if(lgn.session_status() != LOGIN_ERROR_CODE) this.show();
    },
    submit: function() {
        this.form = $('ProductAddForm');
        this.params = this.form.serialize(true);
        var checkedRadio = null;
        var onCompleteHandler = function(transport) {
            if (parseInt(transport.status) > 300) {
                return
            }
            var value = transport.responseText.evalJSON().value;
            var flash = transport.responseText.evalJSON().flash;
            createQ(flash, 'dark');
            switch (value.product.option) {
            case '0':
                // Change to Editor-View-Mode
                this.reloadMainPage(null, value.product.id, true);
                break;
            case '1':
                // Close the window after adding / do some preparations in case the window re-opens
                checkedRadio = this.form.getInputs('radio').find(function(r) {
                    return r.checked
                });
                this.form.reset();
                this.form.getInputs('radio').each(function(r) {
                    r != checkedRadio ? r.checked = false: r.checked = true
                });
                this.close();
                this.reloadMainPage(null, value.product.id, true);
                break;
            case '2':
                // stay in Add-View-Mode
                checkedRadio = this.form.getInputs('radio').find(function(r) {
                    return r.checked
                });
                this.form.reset();
                this.form.getInputs('radio').each(function(r) {
                    r != checkedRadio ? r.checked = false: r.checked = true
                });
                // this time we must reload the page in the background w/o changing into Editor-View-Mode
                // (what happens as a default each time the Active Record changes)
                // we must let the server decide which page to serve: RowObserver::page property must be empty therefor
                // now the sync parameter of RowObserver::reloadMainPage must not be set (or false) in order to leave
                // this in Add-View-Mode
                this.page = '';
                this.reloadMainPage(null, value.product.id, false);
                break;
            default:
                //alert('nothing to do')
            }
        }
        var onFailureHandler = function(transport) {
            if (parseInt(transport.status) == 500) {
                var value = transport.responseText.evalJSON().value;
                var flash = transport.responseText.evalJSON().flash;
                for (var key in value) {
                    var id = 'tooltip-wrapper_' + 'new' + '_' + key;
                    var el = $(id);
                    var tooltip = el.down('.field-error-message');
                    if (el.select('.field-error-message').size() == 0) {
                        el.insert({
                            top: value[key].html
                        });
                    } else {
                        if (tooltip) {
                            tooltip.tooltip_effect.cancel();
                            tooltip.select('p#tooltip-error-updater')[0].update(value[key].error);
                            effect_tooltip(tooltip.id);
                        }
                    }
                }
                createQ(flash, 'error');
            } else {
                trigger_ajax_error(transport);
                Element.update(this.detailsElement);
            }
        }
        this.form.request({
            parameters: this.params,
            onComplete: onCompleteHandler.bind(this),
            onFailure: onFailureHandler.bind(this)
        });
    },
    addAfterSubmit: function() {
        this.submit();

    },
    setActiveRecord: function(newid) {
        var oldid = this.id
        this.id = newid;
        this.emphasise(oldid, false, false);
        this.emphasise(newid, true, false);
        var ret = $(this.id) ? $(this.id) : null;

        return ret;
    },
    emphasise: function(id, doActivate, flash) {
        if (!id) id = this.id;
        if (arguments[1] == undefined) doActivate = true;
        if (arguments[2] == undefined) flash = true;

        if ($(id)) {
            var el = $(id);
            if (doActivate) {
                el.addClassName('marked');
            } else {
                el.removeClassName('marked');
                el.setStyle({
                    backgroundColor: ''
                })
            }
        }
        if(flash) {
            if($(id)) {
                $(id).highlight({
                    startcolor: "#33FF33"
                })
            }
        }
    },
    getNext: function(el) {
        var ret = null;
        if (el) {
            ret = el.next('tr.selectable', 0);
        }
        return ret;
    },
    getPrev: function(el) {
        var ret = null;
        if (el) {
            ret = el.previous('tr.selectable');
        }
        return ret;
    },
    updateControls: function() {
        var el = $(this.id);
        var prevAction = false;
        var nextAction = false;
        this.setAdjacentPages();
        prevAction = (!this.getPrev(el) && !this.previousPage) ? false: true;
        if (!prevAction) {
            $(this.prevControl).addClassName('disabled');
            $(this.prevControl).disabled = true;
        } else {
            $(this.prevControl).removeClassName('disabled');
            $(this.prevControl).disabled = false;
        }
        nextAction = (!this.getNext(el) && !this.nextPage) ? false: true;
        if (!nextAction) {
            $(this.nextControl).addClassName('disabled');
            $(this.nextControl).disabled = true;
        } else {
            $(this.nextControl).removeClassName('disabled');
            $(this.nextControl).disabled = false;
        }
    },
    setAdjacentPages: function() {
        this.previousPage = $('prevPg1') ? $('prevPg1').readAttribute('href') : false;
        this.nextPage = $('nextPg1') ? $('nextPg1').readAttribute('href') : false;
    },
    cleanUp: function(message) {
        // remove content from details window
        Element.update(this.detailsElement, '');
        if (!this.isClosed) {
            this.close();
        }
        var afterFinishHandler = function() {
            Element.update(this.pageElement, '<div class="message" style="color: #6C6F70; display: block; font-size: 3em; margin: 0 auto; padding-top: 30px; text-align: center; text-shadow: 0 1px 0 #FFFFFF;">' + message + '</div>');
            new Effect.Appear(this.pageElement);
            fcs.unwatch();
            $('ProductQuery').clear();
            $('ProductQuery').disabled = true;
            $('no-filter').hide();
        }
        new Effect.Fade(this.pageElement, {
            afterFinish: afterFinishHandler.bind(this)
        });
    }
})

var AjaxEditor = Class.create({
    initialize: function(model, url) {
        this.inplace = '.inplace';
        this.inplacecoll = '.inplacecoll';
        this.model = model;
        this.url = base_url + url;
    },
    observe: function(selection, id) {
        var id = id ? id: roo.id;
        //pagingurl = (base_url+pagingurl).replace(/\/\//, '/');
        selection.map(function(klass) {
            switch (klass) {
            case this.inplace:
                $$(klass).each(function(el) {
                    var field = el.readAttribute('title');
                    var cb = function(form, value) {
                        var post = '_method=POST&id=' + id + '&data[' + this.model + '][id]=' + encodeURIComponent(id) + '&data[' + this.model + '][' + field + ']=' + encodeURIComponent(value);
                        return post;
                    }
                    var onCompleteHandler = function(transport, el) {
                        if (parseInt(transport.status) > 300) {
                            return
                        }
                        var json = transport.responseText.evalJSON();
                        el.update(json.value);
                        createQ(json.flash, 'dark');
                        var cb = function() {
                            new Ajax.Updater('title-header-content', base_url + 'products/get_title/' + id);
                        }
                        flushRow(id, cb.bind(this));
                        el.up('td').highlight({
                            startcolor: "#33FF33"
                        })
                    }
                    var onFailureHandler = function(ipe, transport) {
                        ipe.element.status = transport.status;
                        var myipe = ipe;
                        if (parseInt(transport.status) == 500) {
                            var json = transport.responseText.evalJSON();
                            if ($('tooltip-wrapper_' + json.id + '_' + json.field).select('.field-error-message').size() == 0) {
                                $('tooltip-wrapper_' + json.id + '_' + json.field).insert({
                                    top: json.html
                                });
                            } else {
                                if ($('tooltip_' + json.id + '_' + json.field)) {
                                    $('tooltip_' + json.id + '_' + json.field).tooltip_effect.cancel();
                                    $('tooltip-wrapper_' + json.id + '_' + json.field).select('p#tooltip-error-updater')[0].update(json.error);
                                    effect_tooltip('tooltip_' + json.id + '_' + json.field);
                                }
                            }
                        } else {
                            trigger_ajax_error(transport);
                        }
                    }
                    var onEnterHandler = function(el) {
                        //
                        }
                    var onLeaveHandler = function(el) {
                        if (el.status == 500) {
                            el.status = undefined;
                            el.editor.enterEditMode();
                        }
                    }
                    el.editor = new Ajax.InPlaceEditor(el, this.url + '/' + id + '/' + field, {
                        onLeaveEditMode: onLeaveHandler.bind(this, el),
                        onEnterEditMode: onEnterHandler.bind(this, el),
                        callback: cb.bind(this),
                        highlightcolor: 'none',
                        highlightendcolor: 'none',
                        onCreate: function(ipe) {
                            alert(ipe)
                        },
                        onComplete: onCompleteHandler.bind(this),
                        onFailure: onFailureHandler.bind(this),
                        rows: el.type == 'textarea' ? 6: 1,
                        cols: 25,
                        formClassName: 'inplaceeditor-form',
                        hoverClassName: 'inplaceeditor-hover',
                        cancelControl: 'button',
                        externalControl: 'editor_' + id + '_' + field,
                        clickToEditText: 'Click to edit',
                        loadingText: 'Lade...',
                        savingText: 'saving...',
                        savingClassName: 'inplaceeditor-saving',
                        okText: 'Save',
                        cancelText: 'Cancel'
                    },
                    this);
                },
                this)
                break;

            case this.inplacecoll:
                $$(klass).each(function(el) {
                    var field = el.readAttribute('title');
                    var cb = function(form, value) {
                        return '_method=POST&data[' + this.model + '][id]=' + encodeURIComponent(id) + '&data[' + this.model + '][' + field + ']=' + encodeURIComponent(value);
                    }
                    var onCompleteHandler = function(transport, el) {
                        if (parseInt(transport.status) > 300) {
                            return
                        }
                        //transport is XHR Object
                        var json = transport.responseText.evalJSON();
                        el.update(json.value);
                        createQ(json.flash, 'dark');
                        var oldMessage = $('flash-message-content').innerHTML;
                        var cb = function(id) {
                            new Ajax.Updater('title-header-content', base_url + 'products/get_title/' + id);
                        }.bind(this)
                        flushRow(id, cb.bind(this, id));
                        el.up('td').highlight({
                            startcolor: "#33FF33"
                        })
                    }
                    var onFailureHandler = function(ipe, transport) {
                        if (parseInt(transport.status) == 500) {
                            //
                            } else {
                            trigger_ajax_error(transport);
                        }
                    }
                    new Ajax.InPlaceCollectionEditor(el, base_url + 'products/ajax_coll_edit/' + id + '/' + field, {
                        loadCollectionURL: base_url + 'products/ajax_coll_view/',
                        callback: cb.bind(this),
                        highlightcolor: 'none',
                        highlightendcolor: 'none',
                        onComplete: onCompleteHandler.bind(this),
                        onFailure: onFailureHandler.bind(this),
                        hoverClassName: 'inplaceeditor-hover',
                        cancelControl: 'button',
                        externalControl: 'editor_' + id + '_' + field,
                        clickToEditText: 'Click to edit',
                        loadingCollectionText: 'Loading',
                        savingText: 'saving...',
                        okText: 'Save',
                        cancelText: 'Cancel'
                    },
                    this);
                },
                this)
                break;
            default:
                var el = $(klass);
                if (el) {
                    var field = el.readAttribute('title');
                    var hash = el.id;
                    var s_id = hash.substring(hash.indexOf('_') + 1, hash.length);
                    // i.e: inplaceserial_3294829348-9023489234-ß0329402
                    var model = 'Product';
                    var submodel = 'Serial';
                    var cb = function(form, value) {
                        return '_method=POST&data[' + model + '][id]=' + encodeURIComponent(id) + '&data[' + submodel + '][0][id]=' + encodeURIComponent(s_id) + '&data[' + submodel + '][0][product_id]=' + encodeURIComponent(id) + '&data[' + submodel + '][0][' + field + ']=' + encodeURIComponent(value);
                    }
                    var onCompleteHandler = function(transport, el) {
                        if (parseInt(transport.status) > 300) {
                            return
                        }
                        var json = transport.responseText.evalJSON();
                        el.update(json.value);
                        //parsePreviewString(id, {});
                        createQ(json.flash, 'dark');
                        flushRow(id);
                        el.up('td').highlight({
                            startcolor: "#33FF33"
                        })
                        
                    }
                    var onFailureHandler = function(ipe, transport) {
                        ipe.element.status = transport.status;
                        if (parseInt(transport.status) == 500) {
                            var json = transport.responseText.evalJSON();
                            var id = 'tooltip-wrapper_' + json.id + '_' + json.field;
                            var el = $(id);
                            var tooltip = el.down('.field-error-message');
                            if (el.select('.field-error-message').size() == 0) {
                                el.insert({
                                    top: json.html
                                });
                            } else {
                                if (el) {
                                    tooltip.tooltip_effect.cancel();
                                    tooltip.select('p#tooltip-error-updater')[0].update(json.error);
                                    effect_tooltip(tooltip.id);
                                }
                            }
                        } else {
                            trigger_ajax_error(transport);
                        }
                    }
                    var onLeaveHandler = function(el) {
                        if (el.status == 500) {
                            el.status = undefined;
                            el.editor.enterEditMode();
                        }
                    }
                    el.editor = new Ajax.InPlaceEditor(el, this.url + '/' + s_id + '/key', {
                        onLeaveEditMode: onLeaveHandler.bind(this, el),
                        callback: cb.bind(this),
                        highlightcolor: 'none',
                        highlightendcolor: 'none',
                        onComplete: onCompleteHandler.bind(this),
                        onFailure: onFailureHandler.bind(this),
                        hoverClassName: 'inplaceeditor-hover',
                        cancelControl: 'button',
                        externalControl: 'editor_' + s_id,
                        clickToEditText: 'Click to edit',
                        loadingCollectionText: 'Loading',
                        savingText: 'saving...',
                        okText: 'Save',
                        cancelText: 'Cancel'
                    },
                    this)
                }
                break;
            }
        },
        this)
    },
    highlight: function(el) {
        el.highlight({
            startcolor: "#33FF33"
        })
    }
})

var ViewToggle = Class.create({
    initialize: function(bindObj, trigger_frwrd, trigger_bkwrd, klass) {
        this.activeObject = null;
        this.inactiveObject = null;
        this.bindObj = bindObj;
        this.toggleClass = klass;
        this.one;
        this.two;
        this.trigger_frwrd = trigger_frwrd;
        this.trigger_bkwrd = trigger_bkwrd;
    },
    observe: function() {
        var handlerOne = function(el, me) {
            // edit Handler
            this[me.trigger_frwrd](null, null, true);
            me.tog(2);
        }
        var handlerTwo = function(el, me) {
            // add Handler
            this[me.trigger_bkwrd]();
            me.tog(1);
        }
        var i = 1;
        // handlers will be attached to all elements found of klass class (the last argument)
        // the elements found (max 2 allowed) will be the ones that are toggled back and forth
        // all elements that should become a toggle-trigger should be class-named like so:
        // for toggle 1: 'id_of_toggle_1 '-trigger
        // for toggle 2: 'id_of_toggle_2'-trigger
        $$(this.toggleClass).each(function(el) {
            if (i > 2) {
                //alert('ERROR: too many toggle elements (elments of class "' + this.toggleClass + '" found !\nmax toggle elements allowed: 2\nfound: '+i+'\nONLY THE FIRST TWO WILL BE USED');
                }
            switch (i) {
            case 1:
                // looking for 'toggle 1 id'-trigger to make them trigger toggle 1
                Event.observe(el, 'click', handlerOne.bindAsEventListener(this.bindObj, this));
                $$('.' + el.id + '-trigger').each(function(el) {
                    el.observe('click', handlerOne.bindAsEventListener(this.bindObj, this));
                }, this)
                this.one = el;
                break;
            case 2:
                // looking for 'toggle 2 id'-trigger to make them trigger toggle 2
                Event.observe(el, 'click', handlerTwo.bindAsEventListener(this.bindObj, this));
                $$('.' + el.id + '-trigger').each(function(el) {
                    el.observe('click', handlerTwo.bindAsEventListener(this.bindObj, this));
                }, this)
                this.two = el;
                break;
            default:
                alert('There are too many toggles (elements with class "' + this.toggleClass + '")');
            }
            ++i;
        }, this)
    },
    tog: function(activeObject) {
        if (activeObject != null) {
            if (!this._forceSetting(activeObject)) return;
        } else {
            this._swop();
        }
        this._updateControls();
    },
    _forceSetting: function(activeObject) {
        var el = activeObject;
        if (Object.isNumber(activeObject)) {
            switch (activeObject) {
            case 1:
                el = this.one;
                break;
            case 2:
                el = this.two;
                break;
            default:
                return false;
            }
        }
        this.activeObject = el;
        this.inactiveObject = el == this.one ? this.two: this.one;
        return true;
    },
    _updateControls: function(activeObject) {
        var ao = (activeObject) ? activeObject: this.activeObject;
        if (ao) {
            ao.removeClassName('disabled');
            ao.disabled = false;
            this.inactiveObject.addClassName('disabled');
            this.inactiveObject.disabled = true;
        }

    },
    _swop: function() {
        var o = this.activeObject;
        this.activeObject = o == this.one ? this.two: this.one;
        this.inactiveObject = this.activeObject != this.one ? this.one: this.two;
    }
})

var Serial = Class.create({
    initialize: function(root) {
        this.root = root;
        this.url = base_url + 'products/ajax_edit/';
        this.tr = null;
    },
    make: function() {
        var formUUID = UUID();
        var refresh = new Element('input', {
            type: 'hidden',
            name: 'data[newserial]',
            value: formUUID
        });
        var id_parentModel = new Element('input', {
            type: 'hidden',
            name: 'data[Product][id]',
            value: roo.id
        });
        var id_subModel = new Element('input', {
            type: 'hidden',
            name: 'data[Serial][0][product_id]',
            value: roo.id
        });
        var text = new Element('input', {
            type: 'text',
            name: 'data[Serial][0][key]',
            'onfocus': 'effect_cancel(\'tooltip_' + formUUID + '_key\');'
        });
        var okButton = new Element('input', {
            'class': 'editor_ok_button',
            type: 'submit',
            value: 'save'
        });
        var cancelButton = new Element('input', {
            'class': 'editor_cancel_button',
            type: 'button',
            value: 'cancel',
            onclick: 'srl.cancel(\'' + formUUID + '\'); return false;'
        });
        var form = new Element('form', {
            action: this.url + roo.id + '/key',
            id: formUUID,
            'class': 'inplaceeditor-form',
            'onsubmit': 'srl.submit(\'' + formUUID + '\'); return false;'
        });
        var td = new Element('td', {
            'class': 'bborder',
            'style': 'height: 44px;'
        });
        var wrapper = new Element('div', {
            'id': 'tooltip-wrapper_' + formUUID + '_key',
            'class': 'tooltip-wrapper'
        });
        var wrapper_inner_div = new Element('div', {
            'id': ''
        });
        this.tr = new Element('tr');
        form.insert(refresh);
        form.insert(id_parentModel);
        form.insert(id_subModel);
        form.insert(text);
        form.insert(okButton);
        form.insert(cancelButton);
        wrapper.insert(wrapper_inner_div);
        wrapper_inner_div.insert(form);
        td.insert(wrapper);
        this.tr.insert(td);
        $(this.root).insert({
            bottom: this.tr
        });
    },
    submit: function(id) {
        var form = $(id);
        var el = $(id).up('tr');
        var onCompleteHandler = function(transport) {
            if (parseInt(transport.status) > 300) {
                return
            }
            el.update(transport.responseText);
            createQ('New <b>serial</b> was successfully created', 'dark');
            flushRow(roo.id);
        }
        var onFailureHandler = function(transport) {
            if (parseInt(transport.status) == 500) {
                var json = transport.responseText.evalJSON();
                if ($('tooltip-wrapper_' + json.id + '_key').select('.field-error-message').size() == 0) {
                    $('tooltip-wrapper_' + json.id + '_key').insert({
                        top: json.html
                    });
                }
                $('tooltip-wrapper_' + json.id + '_key').select('p#tooltip-error-updater')[0].update(json.error)
                //new Effect.Appear($('tooltip_'+json.id+'_'+json.field), {duration: 0.5});
                //new Effect.Pulsate($('tooltip_'+json.id+'_'+json.field), {queue: 'end', duration: 1, from: 0.4, pulses: 3});
            } else {
                trigger_ajax_error(transport);
            }
            //mes.dialogue('messenger-alert');
        }
        if (form) {
            form.request({
                method: 'post',
                onComplete: onCompleteHandler.bind(this),
                onFailure: onFailureHandler.bind(this)
            });
        }
    },
    delete_confirm: function(id, key) {
        mes.dialogue_in('messenger-confirm', 'Confirm Deletion for <b>'+ key +'</b> !', 'This action is non-reversible !', this);
        this.prepare_for_delete(id);
    },
    prepare_for_delete: function(id) {
        $('confirm-delete').stopObserving('click');
        $('confirm-delete').observe('click',
        function() {
            this.del(id);
            mes.dialogue_out('messenger-confirm', false);
        }.bind(this, id))
    },
    del: function(id) {
        if (!$(id)) return;
        var el = $(id).up('tr');
        new Effect.Highlight(el, {
            afterFinish: function() {
                var onCompleteHandler = function(transport) {
                    if (parseInt(transport.status) > 300) {
                        return
                    }
                    var json = transport.responseText.evalJSON();
                    if (json.value == 'success') {
                        el.fade({
                            from: 1,
                            to: 0.2,
                            duration: 0.4,
                            afterFinish: function() {
                                el.remove();
                            }.bind(this)
                        });
                        flushRow(roo.id);
                    }
                    var q_mode = json.value == 'success' ? 'dark' : 'error';
                    createQ(json.flash, q_mode);
                    this.id_for_delete = null;
                }
                var onFailureHandler = function(transport) {
                    trigger_ajax_error(transport);
                }

                new Ajax.Request(base_url + 'serials/delete/' + id, {
                    onComplete: onCompleteHandler.bind(this),
                    onFailure: onFailureHandler.bind(this)
                })
            }.bind(this)
        });
        return;
    },
    cancel: function(id) {
        if ($(id)) {
            var tr = $(id).up('tr');
            try {
                tr.remove();
            } catch(e) {}
        }
    }
})

var Login = Class.create({
    initialize: function(trigger, trigger_lock, loginform, logoutform, el) {
        this.trigger = trigger;
        this.trigger_lock = trigger_lock;
        this.el = el;
        this.loginform = loginform;
        this.logoutform = logoutform;
        this.oldBorderStyle;
        this.isValidForm = false;
        this.maxToggleDownTime = 4;
        this.timeoutArray = [];
        this.formObserver = null;
        this.default_lock_title = undefined;
    },
    observe: function() {
        //if(this.session_status() == LOGIN_OK_CODE) {
            Event.stopObserving(this.trigger, 'click');
            Event.stopObserving(this.trigger_lock, 'click');

            Event.observe(this.trigger, 'click', function(ev) {
                Event.stop(ev);
                this.toggle_proxy();
            }.bind(this))
            Event.observe(this.trigger_lock, 'click', function(ev) {
                Event.stop(ev);
                this.toggle_trigger_lock();
            }.bind(this))
        //}
        if ($(this.loginform) && !this.formObserver) {
            this.formObserver = new Form.Observer(this.loginform, 0, function(form, value) {
                this.isValidForm = this.validate(form);
            }.bind(this))
        }
    },
    unwatch_trigger: function() {
        this.timeoutArray.each(function(i) {
            window.clearTimeout(i)
        });
        $$('.' + this.trigger + ' input').each(function(inputs) {
            inputs.title = 'You cannot hide this right now'
            Event.stopObserving(inputs, 'click');
        })
    },
    retrieve_session: function(cb) {
        var onCompleteHandler = function(transport) {
            var json = transport.responseText.evalJSON();
            this.actual_session_status = json.status;
            this.actual_session_group = json.group;
            var opacity = this.session_status() == LOGIN_OK_CODE ? 1 : 1;
            $$('.' + this.trigger)[0].setOpacity(opacity);
            if (typeof cb === 'function') cb();
        }
        new Ajax.Request(base_url + 'users/retrieve_session_status', {
            onComplete: onCompleteHandler.bind(this),
            evalScripts: true
        })
    },
    set_session_status: function(val) {
        $('session-status').update(val);
    },
    session_status: function() {
        return $('session-status').innerHTML;
    },
    session_group: function() {
        return $('group-status').innerHTML;
    },
    reloadHeader: function() {
        var onCompleteHandler = function(transport) {
            var callback = function() {
                var status = this.session_status();
                if(status == LOGIN_ERROR_CODE) {
                    roo.cleanUp('Your session has expired');
                }
            }.bind(this)
            if($(this.trigger).hasClassName('down')) {
                this.toggle(callback);
            } else {
                callback();
            }
        }
        new Ajax.Updater('top-header-updater', base_url + "users/refresh_header", {
            evalScripts: true,
            onComplete: onCompleteHandler.bind(this)
        })
    },
    createHeader: function() {
        if (!$('top-header-updater')) return;
        var onCompleteHandler = function(transport) {
            document.fire('dom:headercreated');
            //var search = window.search(SEARCH_MODE_FULL);
            this.toggle(roo.search.bind(roo, true));
        }

        // ENTRYPOINT
        new Ajax.Updater('top-header-updater', base_url + "users/login_ajax", {
            evalScripts: true,
            onComplete: onCompleteHandler.bind(this)
        })
    },
    toggle_proxy: function(cb) {
        var isUpState = $(this.trigger).hasClassName('down');
        var status = this.session_status();
        
        if(status != LOGIN_OK_CODE && !isUpState) {
            Animate.button(this.trigger, 'Login first', 2, 'Hide Login', '', false);
            return;
        } else {
            this.toggle(cb);
        }
    },
    toggle: function(cb) {
        var isUpState = $(this.trigger).hasClassName('down');

        this.doToggle(cb);
        var goBackUp = function() {
            if (!$(this.trigger_lock).hasClassName('locked')) {
                if (this.session_status() == LOGIN_OK_CODE) {
                    var index = this.toggle.bind(this).delay(this.maxToggleDownTime);
                    this.timeoutArray.push(index);
                }
            }
        }.bind(this)
        if(isUpState) this.retrieve_session(goBackUp)
    },
    doToggle: function(cb) {
        var title = '';
        var value = '';
        this.timeoutArray.each(function(i) {
            window.clearTimeout(i)
        });
        if ($(this.el)) {
            new Effect.toggle(this.el, 'blind', {
                from: 0,
                to: 1,
                duration: 0.8,
                transition: Effect.Transitions.EaseTo,
                afterFinish: function() {
                    if (typeof cb === 'function') cb();
                    $(this.trigger).toggleClassName('down');
                    var input = $(this.trigger);
                    if(input.value == 'Login') {
                        value = 'Move Up Login';
                        title = 'Hide Login Panel';
                    } else {
                        value = 'Login';
                        title = 'Show Login Panel'
                    }
                    input.value = value;
                    input.title = title;
                }.bind(this)
            });
        }
    },
    toggle_trigger_lock: function() {
        var isUpState = $(this.trigger).hasClassName('down');
        if(this.session_status() != LOGIN_OK_CODE && !isUpState) {
            Animate.button(this.trigger, 'Login first', 2, 'Hide Login', '', false);
            return;
        }
        
        var locker = $(this.trigger_lock);
        if(this.default_lock_title == undefined) {
            this.default_lock_title = locker.title;
        }
        var title = locker.title;
        locker.toggleClassName('locked');
        if(locker.hasClassName('locked')) {
            this.timeoutArray.each(function(i) {
                window.clearTimeout(i)
            })
            title = 'Click to Enable Auto-Hiding';
        } else {
            if(!$(this.trigger).hasClassName('down')) {
                this.toggle();

            }
            title = this.default_lock_title;
        }
        locker.title = title;
    },
    validate: function(form) {
        var valid = true;
        var arr = new Array;
        var params = $(form).getElements();
        params.each(function(el) {
            if ((el.type == 'text' || el.type == 'password')) {
                if (el.value == '') {
                    if (!this.oldBorderColor) this.oldBorderColor = $(el).getStyle('borderColor');
                    if (!this.oldBorderWidth) this.oldBorderWidth = $(el).getStyle('border-width');
                    arr.push(el);
                } else {
                    el.setStyle({
                        borderColor: this.oldBorderColor,
                        borderWidth: this.oldBorderWidth
                    })
                }
            }
            $A(arr).each(function(el) {
                el.setStyle({
                    borderColor: '#FF0000',
                    borderWidth: '2px'
                })
            })
            if (arr.length > 0) valid = false
        }.bind(this))
        return valid;
    },
    report: function(msg) {
        alert(msg + ' ' + this)
    },
    login: function() {
        if (!this.validate(this.loginform)) return;
        if (!this.isValidForm) return;
        var form = $(this.loginform);
        var onCreateHandler = function() {}
        var onCompleteHandler = function(transport) {
            Element.update('top-header-updater', transport.responseText);
            this.toggle.bind(this).defer(roo.search(true));
        }
        var onFailureHandler = function(transport) {}
        var toggle_callback = function() {
            new Effect.BlindUp(this.el, {
                afterFinish: function() {
                    if(form) {
                        form.request({
                            evalScripts: true,
                            onCreate: onCreateHandler.bind(this),
                            onComplete: onCompleteHandler.bind(this),
                            onFailure: onFailureHandler.bind(this)
                        });
                    }
                }.bind(this)
            });
        }
        this.toggle(toggle_callback.bind(this));

    },
    login_simple: function() {
        var form = $(this.loginform);
        var params = form.serialize(true);
        form.request({
            method: 'post',
            evalScripts: true,
            parameters: params
        })
    },
    logout: function() {
        var form = $(this.logoutform);
        var onCreateHandler = function() {
        }
        var onCompleteLogoutHandler = function(transport) {
            Element.update('top-header-updater', transport.responseText);
            this.toggle();// goes down again
            roo.cleanUp('You\'re logged out');
        }
        var onFailureLogoutHandler = function(transport) {

            }
        var onCompleteIndexHandler = function(transport) {

            }
        var onFailureIndexHandler = function(transport, jsonHeader) {
            pagination_failure(transport, jsonHeader);
            Element.update('paginate-content', transport.responseText);
        }
        var toggle_callback = function() {
            form.request({
                evalScripts: true,
                onCreate: onCreateHandler.bind(this),
                onComplete: onCompleteLogoutHandler.bind(this),
                onFailure: onFailureLogoutHandler.bind(this)
            })
        }
        this.toggle(toggle_callback.bind(this));
    }
})

function init() {'global init'}
function mouseoverListener(e, el) {
    console.log('global listener')
}
function new_serial() {
    return new Serial('key-insertionpoint');
}

function flushPage(cb) {
    new Ajax.Updater('paginate-content', roo.base_index_url + '/' + roo.page, {
        evalScripts: true,
        onComplete: function() {
            if(typeof cb === 'function') {
                cb();
            }
        },
        onFailure: function() {}
    });
}

function flushRow(id, cb) {
    new Ajax.Updater(id, base_url + 'products/render_table_row/'+id, {
        evalScripts: true,
        onComplete: function() {
            if(typeof cb === 'function') {
                cb();
            }
        }
    });
}

function trigger_ajax_error(transport) {
    var responseText;

    try {
        responseText = transport.responseText;
    }
    catch(e) {
        alert('Ein Fehler ist aufgetreten')
        return;
    }
    var data = responseText.evalJSON();
    var statusText = transport.statusText;
    var status = transport.status;
    if((lgn.session_status() == LOGIN_OK_CODE) && (status != ACL_ERROR_CODE)) {
        lgn.reloadHeader();
    }
    mes.dialogue_in('messenger-alert');
    mes.update_header('messenger-alert', ' Error: (' + status + ') ' + statusText, data.message);
    if (arguments.length > 1 && $(arguments[1] != false)) {
        transport.responseText = transport.statusText;
    }
}

var Messaging = Class.create({
    initialize: function(elem) {
        this.effectbox = elem;
    },
    current_percent: 0,
    hello: function(msg, status, autokill, progress, quick, back_to) {
        var progress = (progress == null) ? false: progress;
        var quick = (quick == null) ? false: quick;
        var back_to = (back_to == null) ? false: back_to;
        var elem_p = $('messenger-icon');
        var elem_fill = $('messenger-span')
        var elem = $('messenger-status');
        if (msg != '') {
            msg = msg.widont();
            this.clearClasses();
            switch (status) {
            case(1):
                elem_p.addClassName('hourglass');
                break;
            case (2):
                elem_p.addClassName('accept');
                break;
            case (3):
                elem_p.addClassName('exclamation');
                break;
            case (4):
                elem_p.addClassName('error');
                break;
            }
            if (status > 2) {
                var fill = '';
                if (back_to) {
                    fill = 'mes.dialogue(\'' + back_to + '\');'
                }
                msg += '<br /><br /><fieldset class="nopad right"><button type="button" class="primary_lg input" onclick="mes.kill(\'\', true);' + fill + ' this.parentNode.removeChild(this);">' + 'OK' + '</button></fieldset>';
            }
            if (progress) {
                $('progress_wrap').show();
            } else {
                $('progress_wrap').hide();
                $('progress').setStyle({
                    width: '0%'
                });
            }
            elem_fill.update(msg);
        }
        if (quick) {
            elem.show();
        } else {
            Effect.Appear(elem, {
                duration: 0.1
            });
        }
        if (autokill)
        window.setTimeout('mes.kill()', 1000);
    },
    dialogue: function(elem, h, p, quick, cb) {
        var quick = quick === undefined ? false : quick === true ? true : false;
        var elem = (elem == null || elem == '') ? 'messenger-status': elem;
        this.update_header(elem, h, p);
        if(quick === true) {
            $(elem).show();
            if(typeof cb === 'function') {
                cb();
            }
        } else {
            Effect.Appear(elem, {
                duration: 0.1,
                afterFinish: cb
            });
        }
    },
    dialogue_in: function(elem, h, p, cb) {
        var defaultEffectType = 'BlindDown';
        var elem = (elem == null || elem == '') ? 'messenger-status': elem;
        if (!$(elem)) return;
        this.update_header(elem, h, p)
        $(elem).show();
        var inner = $(elem).down('div.bg');
        // make the effect dependent on the type of messenger
        var EffectType = elem.indexOf('alert') != -1 ? 'BlindDown' : elem.indexOf('confirm') != -1 ? 'Appear' : defaultEffectType;
        Effect[EffectType](inner, {
            queue: 'end',
            duration: 0.2,
            afterFinish: function() {
                $(elem).select('button.focus')[0].focus();
                if(typeof cb === 'function') {
                    cb();
                }
            }.bind(this)
        })
    },
    dialogue_out: function(elem, redirect) {
        var defaultEffectType = 'BlindUp';
        var quick = (quick == null) ? false: quick;
        var elem = (elem == null || elem == '') ? 'messenger-status': elem;
        var afterFinishHandler = function() {
            if (typeof redirect === 'string') {
                this.dialogue_redirect(redirect)
            }
        }
        if (!$(elem)) return;
        // make the effect dependent on the type of messenger
        var EffectType = elem.indexOf('alert') != -1 ? 'BlindUp' : elem.indexOf('confirm') != -1 ? 'Fade' : defaultEffectType;
        var inner = $(elem).down('div.bg');
        if (inner) {
            Effect[EffectType](inner, {
                queue: 'end',
                duration: 0.2
            });
            Effect.Fade(elem, {
                queue: 'end',
                duration: 0.2,
                afterFinish: afterFinishHandler.bind(this)
            });
        }
    },
    dialogue_redirect: function(loc) {
        var host = document.location.host;
        var protocol = document.location.protocol;
        document.location = base_url+loc;
    },
    update_header: function(elem, h, p) {
        var elem = (elem == null || elem == '') ? 'messenger-status': elem;
        if(elem) {
            if (h) $(elem).select('div h1')[0].innerHTML = h;
            if (p) $(elem).select('div p')[0].innerHTML = p;
        }
    },
    pingProgress: function(percent) {
//        console.log(percent)
        $('progress').setStyle({
            width: percent + '%'
        });
    },
    dialogueToHello: function(elem, msg, status, autokill, progress, back_to) {
        var progress = (progress == null) ? false: progress;
        var back_to = (back_to == null) ? false: elem;
        this.hello(msg, status, autokill, progress, true, back_to);
        $(elem).hide();
    },
    d2d: function(one, two) {
        $(two).show();
        $(one).hide();
    },
    kill: function(name, quick) {
        var quick = (quick == null) ? false: quick;
        var name = (name == null || name == '') ? 'messenger-status': name;
        quick ? $(name).hide() : Effect.Fade(name, {
            duration: 0.2,
            queue: 'end'
        });
    },
    clearClasses: function() {
        $w('hourglass accept exclamation error').each(function(klass) {
            $('messenger-icon').removeClassName(klass);
        });
    },
    confirm: function(m, action, arg) {
        this.clearClasses();
        $('messenger-icon').addClassName('exclamation');
        if (isNaN(arg)) {
            pad = '\'';
        } else {
            pad = '';
        }
        m += '<br /><span class="messenger-bttns"><button type="button" class="primary_lg_mod" onclick="mes.kill(\'\', true);">' + 'Cancel' + '</button>&nbsp;<button type="button" class="primary_lg_mod" onclick="' + action + '(' + pad + arg + pad + ');">' + 'OK' + '</button></span>';
        $('messenger-span').update(m);
        Effect.Appear('messenger-status', {
            duration: 0.1
        });
    }
});

var Animate = {
    button: function(id, string, stage, return_string, hideFinishedClass, disabled) {
        // finished class is the checkmark image icon
        var finishedClass = !hideFinishedClass ? 'finished': '';
        var method = $(id).tagName.toLowerCase() == 'button' ? 'innerHTML' : 'value';
        switch (stage) {
        case 1:
            $(id).disabled = true;
            $(id).style.opacity = 0.8;
            if ($(id)[method] != string) {
                $(id)[method] = string
            };
            $(id).addClassName('progress');
            break;
        case 2:
            $(id).removeClassName('progress');
            $(id).addClassName(finishedClass);
            if ($(id)[method] != string) {
                $(id)[method] = string
            };
            new Effect.Fade(id, {
                duration: 0.40,
                delay: 3,
                to: 0.0001,
                afterFinish: function() {
                    $(id).removeClassName(finishedClass);
                    $(id).disabled = disabled;
                    $(id)[method] = return_string;
                    new Effect.Appear(id, {
                        duration: 0.40,
                        from: 0.0001,
                        to: 1
                    });
                }
            });
            break;
        }
    },
    Utilities: {
        doRedirect: function(url) {
            location.href = url;
        },
        getWindowSize: function(w) {
            w = w ? w: window;
            var width = w.innerWidth || (w.document.documentElement.clientWidth || w.document.body.clientWidth);
            var height = w.innerHeight || (w.document.documentElement.clientHeight || w.document.body.clientHeight);
            var top = w.pageYOffset || w.document.body.scrollTop || w.document.documentElement.scrollTop;
            return [width, height, top];
        },
        doSelection: function(element_id) {
            var elem = $(element_id);
            var s = window.getSelection();
            if (s.rangeCount > 0) s.removeAllRanges();
            if (Prototype.Browser.WebKit) {
                s.setBaseAndExtent(elem, 0, elem, elem.innerHTML.length - 1);
            } else {
                var range = document.createRange();
                range.selectNode(elem);
                s.addRange(range);
            }
        }
    },
    Interface: {
        clearClasses: function(class_name) {
            var clear_these = $$('.' + class_name);
            for (i = 0; i < clear_these.length; i++) {
                clear_these[i].removeClassName(class_name);
            }
        },
        toggle: function(id) {
            if (Element.visible(id)) {
                new Effect.Fade(id, {
                    duration: 0.40,
                    from: 0.9999,
                    to: 0
                });
            } else {
                new Effect.Appear(id, {
                    duration: 0.40,
                    from: 0.0001,
                    to: 0.9999
                });
            }
        },
        focusDelay: function(id, delay) {
            window.setTimeout(function() {
                $(id).focus();
            }, delay);
        }
    }
};

var Helper = {
    helper: null,
    helper_p: null,
    init: function() {
        this.helper = $('helper');
        this.helper_p = Element.down(this.helper);
        var helpers = $$('.help');
        helpers.each(function(h) {
            Event.observe(h, 'mousemove',
            function(e) {
                Event.stop(e);
                Helper.up(h, e);
            });
            Event.observe(h, 'mouseout',
            function(e) {
                Event.stop(e);
                Helper.bye();
            });
        });
    },
    up: function(elem, e) {
        msg = Element.down(elem).innerHTML;
        this.helper_p.innerHTML = msg.widont();
        var helper_h = this.helper.getHeight();
        var dims = Animate.Utilities.getWindowSize();
        var w = dims[0];
        var h = dims[1] - 10;
        var top = dims[2];
        var posx = Event.pointerX(e) - 105;
        var posy = Event.pointerY(e) + 10;
        var maxx = posx + 210;
        var minx = posx - 210;
        var maxy = posy + helper_h;
        if (maxx >= w) {
            posx -= 105;
        }
        if (maxy >= (h + top)) {
            posy -= (helper_h + 25);
        }
        this.helper.setStyle({
            top: posy + 'px',
            left: posx + 'px',
            display: 'block'
        });
    },
    bye: function() {
        this.helper.hide();
    }
};

function UUID() {
    return [4, 2, 2, 8].map(function(length) {
        return $R(0, length, true).map(function() {
            return (parseInt(Math.random() * 256).toString(16));
        }).join('');
    }).join('-');
}

// extending Prototype
Element.addMethods({
    // this hack is necessary because of an bug? in Safari where elements
    // weren't repainted after being updated
    redraw_hack: function(el) {
        var element = $(el);
        var display_style = element.getStyle('display');
        element.style.display = 'none';
        var fix = element.offsetHeight;
        element.style.display = display_style;
        return element;
    },
    redraw_textnode: function(el){
        var element = $(el);
        var n = document.createTextNode(' ');
        
        (function(){
            var n = document.createTextNode(' ');
            element.appendChild(n);
            n.parentNode.removeChild(n)
        }).defer();
        return element;
    },
    redraw_transform: function(el){
        var element = $(el);
        element.style.webkitTransform = 'scale(1)';
        return element;
    },
    stripScripts: function(el) {
        var exp = /<script[\s\S]*?\/script>/g;
        var str = el.toString();
        var match = exp.test(str);
        return  match ? str.replace(exp, '') : el;
    },
    // adapted from Thomas Fuchs' Scripty2'
    cloneWithoutIDs: function(element) {
        element = $(element);
        var clone = element.cloneNode(true);
        clone.id = '';
        $(clone).select('*[id]').each(function(e) {e.id = '';});
        return clone;
    },
    updateClassNameAndContent: function(element, cn, ct, alt) {
        element.writeAttribute('class', cn);
        if (ct) element.update(ct);
        return element;
    },
    smoothUpdate: function(element, ct) {
        new Effect.Opacity(element, {
            duration: 0.3,
            from: 1,
            to: 0.0001,
            afterFinish: function() {
                element.update(ct)
                element.appear();
            }    
        })
    }
})

String.prototype.widont = function() {
    var space = this.lastIndexOf(' ');
    if (space == -1) {
        return this;
    } else {
        return this.substr(0, space) + '&nbsp;' + this.substr(space + 1);
    }
};

/*
Gradual Transitions
*/
// EaseFromTo (adapted from "Quart.EaseInOut")
Effect.Transitions.EaseFromTo = function(pos) {
    if ((pos/=0.5) < 1) return 0.5*Math.pow(pos,4);
    return -0.5 * ((pos-=2)*Math.pow(pos,3) - 2);
};
// EaseFrom (adapted from "Quart.EaseIn")
Effect.Transitions.EaseFrom = function(pos) {
    return Math.pow(pos,4);
};
// EaseTo (adapted from "Quart.EaseOut")
Effect.Transitions.EaseTo = function(pos) {
return Math.pow(pos,0.25);
};

var createQ = function(m, type) {
    Informer[type](m);
}

var fcs = new Focus('default');
var roo = new RowObserver('tr.selectable', 'messenger-update-content', 'paginate-content');
var axe = new AjaxEditor('Product', 'products/ajax_edit');
var tgl = new ViewToggle(roo, 'navigate', 'add', '.toggle');
var lgn = new Login('login-trigger', 'trigger-lock', 'UserLoginAjaxForm', 'UserLogoutForm', 'top-header-updater');
var mes = new Messaging('effectbox');
var drg_wrap, drg_uploader;
document.observe("dom:loaded", function() {
    lgn.createHeader();
    tgl.observe();
    mes.dialogue_out('messenger-alert', false);
    mes.dialogue_out('messenger-confirm', false);
    drg_wrap = new Draggable('draggable-messenger-wrap', {
        revert: false,
        handle: 'drag-handle'
    });
});
document.observe('dom:uploaderstarted', function() {
    drg_uploader = new Draggable('draggable-messenger-upload-avatar', {
        revert: false,
        handle: 'drag-handle'
    });
});
document.observe('dom:uploaderfinished', function() {
    drg_uploader.destroy();
});
document.observe('dom:headercreated', function() {
    var options = {
        closeButton: 'right',
        life: {
            info: 10,
            notice: 4,
            dark: 4
            //dark: 'immortal'
        }
    }
    Informer = new Q.Informer(options);
});
document.observe('q:loaded', function() {
    Q.set({
        imagePath: "/img/q"
    });
});
document.observe('dom:viewcreated', function() {
    //
})
document.observe('dom:pageloaded', function() {
    Preview.initialize('tr.selectable td.thumbnail');
    roo.emphasise();
})
