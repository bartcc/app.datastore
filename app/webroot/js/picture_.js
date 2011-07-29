var PICTURE = (function(o) {
    var my = o,
        boxes = {},
        m = 'master',
        s = 'slave',
        currentstate = null,
        that = this,
        boxTable = $A([]),
        xStart = 0,
        fadeoutTo = 0.0001,
        fadeoutDuration = 0.3,
        smallPreviewName = 'small-preview',
        smallPrv,
        clickHandler,
        
        specs = $H({
            div:null,
            img: null,
            dimmedElement: null,
            last: null,
            sceduledForDeletion: null,
            options:{
                duration: 0.5,      // resize duration
                isFinal: false,     // resets after update if true
                maxWidth:900,       //
                maxHeight:450,      //
                begin: null,
                inter: null,
                finale: null,                  // actions begin:after first load; inter:not supported; finale:after reset 
                InternalCallbacks: function(){
                    return {
                        before: smallPrv.kill
                        ,
                        after: function() {
                            flushElement('slave')
                        }
                    }
                }
            },
            snapshot: $H(this.options).clone().toObject()
            
        });
    
    boxes[m] = null;
    boxes[s] = null;
    my.boxes = boxes;
    
    Event.observe = Event.observe.wrap(function(p, element, eventName, handler) {
      return p.call(p, element, eventName, function(e) {
        if (e.currentTarget.__disabled) return; 
        handler.call(e.target, e);
      })
    })
    
    /*
     *  augment DOMElements with some helpful methods
    */
    Element.addMethods({
        test: function(element, s) {
            alert('1: '+s);
            alert('2: '+element.id);
        },
        master: function(element) {
            return my.master();
        },
        slave: function(element) {
            return my.slave()
        },
        hasValidImg: function(element) {
            return hasValidImage(element)
        },
        startListening: function(element, event, handler) {
            Element.stopObserving(element, event, handler);
            Element.observe(element, event, handler);
            return element;
        },//startListening
        stopListening: function(element, event, handler) {
            Element.stopObserving(element, event, handler);
            return element;
        },
        isDOMElementDIV: function(element) {
            return (typeof element.nodeType === 'number' && element.nodeName === 'DIV');
        },
        disable: function(element, eventName) {
            element.__disabled = true;
        },
        enable: function(element, eventName) {
            delete element.__disabled;
        },
        disabled: function(element) {
            return !!element.__disabled;
        },
        observe: Event.observe
    })
    /*
     * Private Methodes
    */
   
    var make = function(tp, opts, cb) {
        var box;
        var type = tp || (my.master() ? my.slave() ? undefined : s : m);
        var defaults = {'class': type, id: type};
        var options = $H(defaults).merge(opts).toObject();
        if(typeof type === 'string' && (type == m || type == s)) {
            var listener = function() {
                if(typeof cb === 'function') {
                    cb.defer();
                }
            }
            box = typeof my.boxes[type] === 'object' ? new Image() : my.boxes[type];
            //box.setStyle({width: '100%'});
            box.on('load', listener);
            my.boxes[type] = box.wrap('div', options)
            if(!itemExists(my.boxes[type].id)) {
                addToTable(my.boxes[type].id);
            }
        }
        return my.boxes[type];
    }
    var helper = {
        stepfather: null,
        init: function() {
            var helper;
            if (!$('p_helper')) {
                helper = new Element('div', {id: 'p_helper', 'style': 'float: left; left: -10000000px; position: absolute;'});
                document.body.insert({bottom: helper});
                this.stepfather = helper;
            }
            return helper;
        },
        kill: function() {
            var el = this.stepfather.down();
            if(el) el.remove();
        },
        measure: function(element) {
            var img = $(element), dim, clone;
            var el = img;
            if(el.nodeName == 'IMG') {
                // here we have to deal with an IMG that either comes from the DOM or is freshly loaded and not part of the DOM yet
                // Webkits does not know offsetHeights on Elements not yet part of the DOM whereas FF does
                // so keep a reference to teh IMG' container (if there is one) for later restore
                var parent = img.up();
                // now make the IMG part of the DOM
                // important to know that after updating our stepfather with new content (IMG here), 
                // the IMG leaves it's original place in the DOM to become  the only and unique child
                // of stepfather - so don't forget to restore it to it's original place after measuring
                this.stepfather.update(img);
                dim = this.stepfather.getDimensions();
                // restore image if it came from the DOM
                if(parent && parent != img.up()) parent.update(img);
            } else {
                clone = el.cloneWithoutIDs(true);
                this.stepfather.update(clone.stripScripts());
                dim = this.stepfather.getDimensions();
            }
            this.kill();
            return dim;
        },
        optimizeSize: function(currentSize) {
            var w, h, h_tmp, h_max, dim = {width: null, height: null};
            w = specs.get('options').maxWidth;
            h_max = specs.get('options').maxHeight;
            h_tmp = (currentSize.height*w)/currentSize.width;
            h = h_tmp > h_max ? h_max : h_tmp;
            h = parseInt(h);
            dim.width = w;
            dim.height = h;
            return dim;
        },
        isJumpStart: function(el) {
            var h;
            h = this.measure(el).height;
            return h == 0 ? true : false;
        }
    }
    var pullDimmedElement = function(readonly) {
        var el = specs.get('dimmedElement');
        return el ? (function(e) {
            if(!readonly) specs.update({dimmedElement: null});
            return e;
        })(el) : null;
    }
    var pullFinal = function(readonly) {
        var o = specs.get('snapshot');
        return o.isFinal ? (function(a) {
            if(!readonly) o.isFinal = false;
            return a;
        })(o.isFinal) : false;
    }
    var SmallPreview = function(element) {
        var inOverEffect, outOverEffect, outEffect, innerOutEffect, isFinal = pullFinal(true);
        var largeOutbound, imgToClone, imgToUpdate;
        var clonewrapper  = function() {
            if($(element)) return $(element);
            
            var options = {id: element, 'class': element, style: 'position: absolute; z-index:999999; opacity: 0.5;'};
            var div, img;
            
            img = new Element('img');
            div = img.wrap('div', options);
            
            my.root.up().insert({top: div});
            register();
            return $(element);
        }
        var register = function() {
            if(!element)  return;
            var mouseoverListener = function(e, el) {
                if(outOverEffect) outOverEffect.cancel();
                inOverEffect = new Effect.Morph(element, {
                    style: 'opacity: 1'
                })
            }
            var mouseoutListener = function(e, el) {
                inOverEffect.cancel();
                outOverEffect = new Effect.Morph(element, {
                    style: 'opacity: 0.5'
                })
            }
            Event.on(element, 'mouseover', mouseoverListener);
            Event.on(element, 'mouseout', mouseoutListener);
            Event.on(element, 'click', clickListener)
        }
        var inbound = function() {
            if(isFinal) return;
            new Effect.Morph(element, {
                queue: {
                    position: 'end',
                    scope: 'small_preview_scope'
                },
                duration: 0.3,
                style: 'opacity: 1',
                afterFinish: function() {
                    innerOutEffect = new Effect.Morph(element, {
                        queue: {
                            position: 'end',
                            scope: 'small_preview_scope'
                        },
                        duration: 2,
                        style: 'opacity: 0.5'
                    })
                }
            })
        }
        var exchange = function() {
            imgToUpdate.src = imgToClone.src;
            clonewrapper().store('friend', largeOutbound)
        }
        return {
            kill: function(fast) {
                if(fast) {
                    $(element).update().remove();
                    return
                }
                new Effect.Morph(element, {
                    style: 'opacity:0.0001;',
                    afterFinish: function() {
                        $(element).update().remove();
                }.bind(this)})
            },
            outbound: function(largeInbound) {
                largeOutbound = largeInbound.retrieve('friend');
                
                imgToClone = largeOutbound.down('img');
                imgToUpdate = clonewrapper().down('img')
                
                // dont fade if source is the same
                if(imgToUpdate && imgToUpdate.src == imgToClone.src) {
                    return;
                }
                
                if(!largeOutbound.hasValidImg()) {
                    exchange();
                    if(!pullFinal(true)) this.inbound();
                    return;
                }
                
                [innerOutEffect, outEffect].map(function(eff) {if(eff) eff.cancel()});
                outEffect = new Effect.Morph(element, {
                    queue: {
                        position: 'end',
                        scope: 'small_preview_scope'
                    },
                    style: 'opacity: 0.0001',
                    duration: 0.3,
                    afterFinish: function() {
                        if($(element)) {
                            exchange()
                            if(!pullFinal(true)) inbound();
                        }
                    }.bind(this)
                })
            }
            
        }
            
    }
    var hasValidImage = function(el) {
        if(!(el instanceof HTMLElement) && !el.isDOMElementDIV) return;
        var res = false, img;
        if(el.down('img')) {
            img = el.down('img');
            res = (img.src != location.href) && (img.src != '');
        }
        return res;
    }
    var friendOf = function(el) {
        return el == my.boxes[m] ? my.boxes[s] : my.boxes[m];
    }
    var dimmElement = function(el, val) {
        var dimmto = val || fadeoutTo;
        Element.setOpacity(el, dimmto);
        specs.update({dimmedElement: el})
    }
    var clickListener = function(e, el) {
        var div = Event.element(e).up('div.preview') || currentstate,
            frnd;
        
        frnd = this.retrieve('friend');
        // listen only if the element to change to has an valid Image
        if(frnd.hasValidImg()) {
            swap.call(frnd);//
        }
    }
    var swap = function(target, opts) {
        var master = my.master(),
            slave = my.slave(),
            small_previev = $(smallPreviewName),
            pos_master = xFromId(master.id),
            pos_slave = xFromId(slave.id),
            defaults = {before: null, after: null},
            img,
            homeFrame,
            targetFrame,
            dim,
            hasFriend,
            moveTo,
            thisX,
            options;
        
        options = $H(defaults).merge(opts).toObject();
        targetFrame = this;
        homeFrame = arguments[0] == window.HTMLElement ? target : targetFrame.retrieve('friend');
        img = specs.get('img');
        
        smallPrv.outbound(targetFrame);
        
        // is img fresh loaded ????
        dim = targetFrame.retrieve('dim');
        if(!dim) {
            dim = helper.measure(img);
            dim = helper.optimizeSize(dim);
            targetFrame.store('dim', dim);
        }
        
            clickHandler.stop()
            moveTo = targetFrame == master ? pos_master : pos_slave;
            thisX = xFromId(homeFrame.id)
            new Effect.Morph(my.root, {
                queue: {
                    position: 'end',
                    scope: 'morph_scope'
                },
                style: 'left:'+moveTo,
                duration: thisX != moveTo ? 1 : 0,
                transition: Effect.Transitions.EaseFromTo,
                beforeStart: function() {
                    if(options && typeof options.before === 'function') {
                        options.before.defer();
                    }
                    dimmElement(targetFrame)
                },
                afterFinish: function() {
                    currentstate = $(idFromX());
                    updateControls([$('preview-submit-button')]);
                    if(options && typeof options.after === 'function') {
                        options.after.defer();
                    }
                    resize.call(this, dim);
                    
                    clickHandler.start();
                }
            })
    }
    var resize = function(dim) {
        var el = specs.get('div'),
            img = specs.get('img'),
            options = specs.get('snapshot'),
            internalCallbacks = options.InternalCallbacks(),
            frnd = friendOf(el),
            src = img.src,
            dim_old,
            dim_new,
            dim_opt,
            morphTime,
            dimmedElement = pullDimmedElement() || el,
            isFinal = pullFinal(true),
            externalCallback = (function(options, f) {
                if(!options) return;
                    
                return function() {
                    if(!(f)) {
                        if(options.begin) {
                            if(typeof options.begin === 'function') {
                                options.begin();
                                options.begin = null;
                            }
                        } else {
                            if(currentstate == my.slave()) {
                                if(typeof options.inter === 'function') {
                                    options.inter();
                                }
                            } else {
                                if(typeof options.basic === 'function') {
                                    options.basic();
                                }
                            }
                        }
                    } else {
                        if(typeof options.finale === 'function') {
                            options.finale();
                        }
                    }
                }
                
            })(options, isFinal); // Mixes in external callbacks
            
        dim_old = currentstate.getDimensions();
        dim_new = dim;
        dim_opt = helper.optimizeSize(dim_new);
        
        // don't waste time where heights are the same
        morphTime = dim_old.height != dim_opt.height ? options.duration : 0;
        
        el.setStyle({height:''});
        frnd.setStyle({height:''});
        
        new Effect.Morph(my.root, {
            queue: {
                position: 'end',
                scope: 'morph_scope'
            },
            style: 'height:'+dim_opt.height+'px;',
            duration: morphTime,
            beforeStart: function() {
                if((src != el.down('img').src) && (el.hasValidImg())) {
                    fade(el, 'out')
                }
                if(isFinal) {
                    internalCallbacks.before();
                }
            },
            beforeSetup: function() {
                //if(el.down('img').src != src) {
                    if(!(isFinal) || el === my.master()) {
                        el.down('img').src = src;
                    }
                    if(isFinal) {
                        flushElement('slave');
                    }
                    document.body.redraw_hack();
            },
            afterFinish: function() {
                fade(dimmedElement, 'in', {afterFinish: externalCallback})
                if(isFinal) {
                    pullFinal(true);
                    internalCallbacks.after();
                }
            }
        })
        return {old:dim_old, opt: dim_opt};
    }
    var fade = function(el, type, options) {
        el = $(el);
        var defaults = {
                queue: {
                    position: 'end',
                    scope: 'morph_scope'
                },
                duration: 1,
                afterFinish:function() { }
            },
            opts = function() {
                var o = $H({});
                if(type == 'in') {
                    o.set('style', 'opacity:1');
                } else if(type == 'out') {
                    o.set('style', 'opacity:'+fadeoutTo);
                }
                if(o.get('to') == Element.getOpacity(el)) {
                    o.update({duration: 0});
                }
                return o;
            };

        options = $H(defaults).merge(opts()).merge(options).toObject();
        new Effect.Morph(el, options);
    }
    var disableControl = function(input, b) {
        if(b) {
            Element.addClassName(input, 'disabled');
            input.disabled = true;
        } else {
            Element.removeClassName(input, 'disabled');
            input.disabled = false;
        }
    }
    var updateControls = function(a) {
        if(currentstate == my.master()) {
            a.each(function(el) {
                disableControl(el, true);
            })
        } else {
            a.each(function(el) {
                disableControl(el, false);
            })
        }
    }
    var addToTable = function(id) {
        var w = specs.get('options').maxWidth;
        var newMax = xStart;
        var newMin = newMax-w+1;
        xStart = newMin-1;
        boxTable.push({id:id, max:newMax, min:newMin});
    }
    var idFromX = function() {
        var xPos = parseInt(my.root.getStyle('left'));
        var itr = boxTable.find(function(o) {
            return o.max <= xPos && xPos >= o.min;
        })
        return itr.id;
    }
    var xFromId = function(id) {
        var itr = boxTable.find(function(o) {
            return o.id == id;
        })
        return itr.max+'px';
    }
    var itemExists = function(id) {
        var itr = boxTable.find(function(o) {
            return o.id == id;
        })
        return itr != undefined ? true : false;
    }
    var isSceduledForDeletionElement = function(el, readonly) {
        var sceduledElement = specs.get('sceduledForDeletion');
        return el === sceduledElement ? (function(el) {
            if(!readonly) specs.update({sceduledForDeletion: null});
            return el;
        })(sceduledElement) : false;
    }
    var flushElement = function(el) {
        var element = $(el);
        if(!element && !element.down('img')) return
        element.down('img').src = location.href;
        flushStore(element);
    }
    var flushStore = function(el) {
        var element = $(el);
        var items = element ? '#'+element.id : 'div#'+my.root.id+' div.preview';
        $$(items).each(function(el) {
            el.store('dim', null);
        })
        return $(items)
    }
    var doLoad = function(el, src, opts) {
        var defaults = {},
            options = {},
            img = specs.get('img');
            
        img = null;
        img = Object.extend(new Image());
        specs.update({img: img});
        defaults = specs.get('options');
        options = $H(defaults).merge(opts).toObject();
        specs.update({
            div: el,
            snapshot: options
        })
        flushStore(el);
        img.addEventListener('load', swap.bind(el), false);
        img.src = src;
    }
    var test = (function() {
        return {
            a: function(str) {
                return str.toString().toUpperCase();
            }
        }
    })()
    /*
     *  Public Methodes
     */
    my.init = function(el, opts) {
        var master = m,
            slave = s,
            defaults,
            options,
            morphysWidth;

        helper.init();
        
        defaults = specs.get('options');
        options = $H(defaults).merge(opts).toObject();
        my.root = $(el) || document.body;

        morphysWidth = helper.measure(my.root.up('div.morph')).width;
        specs.update({options: $H(options).merge({maxWidth: morphysWidth}).toObject()});

        my.root.insert({bottom: make(master, {id: master, 'class': master+' preview', style: 'opacity: 0.0001; float:left; left:0; top:0; width:'+morphysWidth+'px; position:relative;'})});
        my.root.insert({bottom: make(slave, {id: slave, 'class': slave+' preview', style: 'opacity: 0.0001; float:left; left:0; top:0; width:'+morphysWidth+'px; position:relative;'})});
        my.root.insert({bottom: new Element('div', {style: 'clear:both'})});
        
        my.root.setStyle({position: 'relative', left: 0, width: (morphysWidth*2)+'px'});
        $$('div.preview').each(function(el) {
            clickHandler = el.on('click', clickListener);
        })
        
        my.master().store('friend', my.slave()).store('dim', null);
        my.slave().store('friend', my.master()).store('dim', null);
        currentstate = my.master();
        updateControls([$('preview-submit-button')]);
        smallPrv = SmallPreview(smallPreviewName);
        return my.root;
    }
    my.getBoxTable = function() {
        return boxTable; // for debugging
    }
    my.getCurrentState = function() {
        return currentstate
    }
    my.master = function() {
        return my.boxes[m];
    }
    my.slave = function() {
        return my.boxes[s];
    }
    my.currentstate = function() {
        return currentstate; // for debugging
    }
    my.specs = function() {
        return specs; // for debugging
    }
    my.load = function() {
        if(arguments.length == 0) return;
        var args, array, tf;
            
        args = $A(arguments);
        array = Array.prototype.slice.call(args, 0, 1);
        if((array[0] instanceof HTMLElement) && (array[0].isDOMElementDIV())) {
            tf = array[0];
        }
        // what will be target ?
        tf = tf ? tf : !my.master().hasValidImg() ? my.master() : my.slave();
        args = args.slice(-2);
        doLoad(tf, args[0], args[1])
        
    }
    my.use = function() {
        var master = my.master(),
            slave = my.slave();
        
        if(!slave.hasValidImg()) return;
        var snapshot = specs.get('snapshot');
        var toMerge = {isFinal: true, duration: 0.5};
        var merged = $H(snapshot).merge(toMerge);
        my.load(master, slave.down('img').src, merged);
    }
    my.reset = function() {
        var master = my.master(),
            src = master.down('img').src;
        
        my.load(master, src, {isFinal: 'yes'});
    }
    return my;
}(PICTURE || {}))