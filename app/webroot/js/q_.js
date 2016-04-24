/*
 * Q.js 0.1.1
 *
 * Copyright (c) 2010 Boys Abroad (Wout Fierens)
 *
 * Licensed under the MIT (http://opensource.org/licenses/mit-license.php) license.
 */

if (typeof Prototype == 'undefined')
  alert("Q Error:  Prototype is not loaded. Please make sure that your page includes prototype.js before it includes q.js");
if (Prototype.Version < "1.6")
  alert("Q Error:  Minimum Prototype 1.6.0 is required; you are using " + Prototype.Version);

/*
 * Reject browser if IE under version 6
 */

if (Prototype.Browser.IE)
  if (/MSIE (\d+\.\d+);/.test(navigator.userAgent))
    Prototype.BrowserFeatures.version = new Number(RegExp.$1);

if (Prototype.Browser.IE && Prototype.BrowserFeatures.version < 7)
  alert("Your webbrowser, Internet Explorer " + Prototype.BrowserFeatures.version + ", is more than 8 years old and doesn't support many of the features necessary for using this page.")

var Q = {
  // image location, type and style
  imagePath:        "images/q",
  style:            "default",
  types:            $w("plain info notice warning error dark"),
  fontFamily:       "Lucida Sans Unicode, Lucida Grande, sans-serif;",
  fontSize:         "12px",
  imageTypes: {
    plain:          0,
    info:           1,
    notice:         2,
    warning:        3,
    error:          4,
    dark:           5 },
  
  // shortcut to prototype's current browser
  IE:               Prototype.Browser.IE,
  Opera:            Prototype.Browser.Opera,
  WebKit:           Prototype.Browser.WebKit,
  Gecko:            Prototype.Browser.Gecko,
  MobileSafari:     Prototype.Browser.MobileSafari,
  
  // buffer of instances
  instances:        [],
  counts:           {},
  active:           false,
  
  // other buffers
  cssDeclarations:  [],
  
  // initialize
  setup: function() {
    Q.addDynamicStylesheetMethodsTo(document);
    
    // create a stylesheet
    this.css = document.createStyleSheet();
    
    // compile the skin
    this.setSkin();
    
    // define base css styles
    this.addCssFor('base');
    
    // fire when setup is ready
    document.fire('q:loaded');
  },
  
  // set Q properties
  set: function(options) {
    if (typeof options == "string" && options.isJSON())
      options = options.evalJSON();
    
    // image_path is depricated
    if (options.image_path)
      options.imagePath = options.image_path;
    
    $H(options).each((function(pair) {
      this[pair.key] = pair.value;
    }).bind(this));
    
    this.setSkin(this.style, true);
  },
  
  // set the image sytle
  setSkin: function(style, load) {
    var preload = load ? new Image(25,25) : {};
    
    if (style)
      this.style = style;
    
    $w("h v").each((function(part) {
      preload.src = this["imagePath_" + part] = this.imagePath + "/" + this.style + "-" + part + ".png";
    }).bind(this));
    
    this.types.each((function(type) {
      preload.src = this["filler_path_" + type] = this.imagePath + "/" + this.style + "-" + type + ".png";
    }).bind(this));
    
    ["#q_wrapper", "#q_wrapper input", "#q_wrapper textarea"].each((function(klass) {
      this.addCss(klass, "font-family:" + this.fontFamily + ";font-size:" + this.fontSize + ";");
    }).bind(this));
  },
  
  // mass instancing
  create: function(subclass, options) {
    var klass     = options.klass || 'q-' + subclass.toLowerCase(),
        inputType = 'input';
    
    if (subclass == 'Textarea')
      inputType = 'textarea'
    
    $$(inputType + '.' + klass).each(function(input) {
      new Q[subclass](input, options);
    });
  },
  
  // register a subclass in the counts object
  register: function(subclass) {
    if (this.counts[subclass])
      this.counts[subclass] += 1;
    else
      this.counts[subclass] = 1;
  },
  
  // hide active (the force argument is to hide persistent intances as well)
  hide: function(force) {
    if (force || (this.active && !this.active.persistent))
      this.active.hide();
  },
  
  // mass hide
  hideAll: function(force) {
    this.instances.each((function(instance) {
      if (instance != this && (force || !instance.persistent))
        instance.hide(force);
    }).bind(this));
  },
  
  // reposition all instances according to the new screen size
  reposition: function() {
    this.instances.invoke("positionHolder");
  },
  
  // add css rule
  addCss: function(targets, cssText) {
    if (typeof targets == 'string') {
      targets.
        split(',').
        collect(function(part) {
          return part.strip();
        }).
        each((function(selector) {
          this.css.addRule(selector, cssText);
        }).bind(this));
    
    } else if (typeof targets == 'object') {
      $H(targets).each((function(pair) {
        
        if (typeof pair.value == 'object') {
          cssText = '';
          
          $H(pair.value).each(function(p) {
            cssText += p.key.underscore().dasherize() + ':' + p.value + ';';
          });
        } else {
          cssText = pair.value;
        }
        
        this.css.addRule(pair.key, cssText);
      }).bind(this));
    
    }
  },
  
  // add css for a given plugin and remember adding to prevent double decarations
  addCssFor: function(plugin) {
    
    if (this.cssDeclarations.indexOf(plugin) > -1) return;
    
    switch(plugin) {
      /////////////////////////////////////
      // Css for Q.Base
      /////////////////////////////////////
      case "base":
        // ovelaying protective layer, used in many plugins
        this.addCss(
          "div.q-protective-layer",
          "position:fixed;left:0;top:0;width:100%;height:100%;z-index:99997;background-color:#fff;");
        // the wrapper itself
        this.addCss(
          "div.q-wrapper",
          "position:absolute;left:0;top:0;z-index:99999999;width:100%;height:1px;");
        // float clearer
        this.addCss(
          ".q-clearer",
          "content:'.';display:block;clear:both;visibility:hidden;line-height:0;height:0;zoom:1;list-style-type:none;margin:0;padding:0;");
        // the resizable background setup
        this.addCss(
          "div.q-background",
          "width:100%;height:100%;padding:0;margin:0;border-spacing:0;position:relative;");
        this.addCss(
          "div.q-background div.q-center",
          "margin:0 12px;position:relative;");
        this.addCss(
          "div.q-background div.q-center div.q-top-spacer",
          "height:1px;");
        this.addCss(
          "div.q-background div.q-corner",
          "width:12px;height:12px;position:absolute;margin:0;padding:0;");
        this.addCss(
          "div.q-background div.q-edge",
          "width:100%;height:12px;position:absolute;left:0;");
        this.addCss(
          "div.q-background div.q-edge-spacer",
          "height:12px;position:relative;");
        this.addCss(
          "div.q-background div.q-border",
          "width:12px;height:100%;position:absolute;margin:0;padding:0;");
        // style specific font colors
        this.addCss(".q-plain",   "color:#333;");
        this.addCss(".q-info",    "color:rgb(44, 50, 51);");
        this.addCss(".q-notice",  "color:rgb(40, 51, 0);");
        this.addCss(".q-warning", "color:rgb(51, 31, 2);");
        this.addCss(".q-error",   "color:#fff;");
        this.addCss(".q-dark",    "color:#fff;");
      break;
      
      /////////////////////////////////////
      // Css for Q.Informer
      /////////////////////////////////////
      case "informer":
        this.addCss(
          ".q-message",
          "position:relative;margin:0 0 5px 0;overflow:hidden;cursor:pointer;");
        // close button
        this.addCss(
          "div.q-message div.q-message-close",
          "position:absolute;width:24px;height:24px;right:0px;top:0px;z-index:100;cursor:pointer;background-position:-24px -168px;background-image:url(" + Q.imagePath_h + ");visibility:hidden;");
        this.addCss(
          "div.q-message:hover div.q-message-close",
          "visibility:visible;");
        this.addCss(
          "div.q-message div.q-message-close.q-left",
          "left:0px;right:auto;");
        // basics
        this.addCss(
          ".q-text",
          "font-size:12px;");
        this.addCss(
          ".q-pending-bar",
          "width:auto;height:16px;border:1px solid #999;-moz-border-radius:2px;-webkit-border-radius:2px;background-image:url(" + Q.imagePath + "/pending.gif" + ");");
        this.addCss(
          ".q-progress-bar",
          "width:auto;height:16px;border:1px solid #999;-moz-border-radius:2px;-webkit-border-radius:2px;");
        this.addCss(
          ".q-progress-bar .q-indicator",
          "width:0;height:100%;background-color:#ccc;");
      break;
      
      /////////////////////////////////////
      // Css for Q.Palette
      /////////////////////////////////////
      case "palette":
        this.addCss(
          "#q_wrapper ul.q-palette",
          "margin:0; padding:0; max-width:342px");
        this.addCss(
          "#q_wrapper ul.q-palette li.q-color",
          "padding:0; list-style-type:none; margin:2px; float:left; width:15px; height:15px; cursor:pointer;");
        this.addCss(
          "#q_wrapper ul.q-palette li.q-color:hover",
          "margin:0px; width:19px; height:19px;");
        this.addCss(
          "#q_wrapper ul.q-palette li.q-color.active",
          "margin:0px; width:19px; height:19px;");
        this.addCss(
          "#q_wrapper ul.q-palette li.q-color.round",
          "-moz-border-radius:10px;-webkit-border-radius:10px;border-radius:10px;");
      break;
      
      /////////////////////////////////////
      // Css for Q.Tagger
      /////////////////////////////////////
      case "tagger":
        // the tooltip itself
        this.addCss(
          "#q_wrapper ul.q-taglist",
          "margin:0;padding:0;");
        this.addCss(
          "#q_wrapper ul.q-taglist li.q-tag",
          "margin:3px;padding:0px 8px;list-style-type:none;float:left;background-color:#666;color:#fff;-moz-border-radius:10px;-webkit-border-radius:10px;border-radius:10px;cursor:pointer;");
        this.addCss(
          "#q_wrapper ul.q-taglist li.q-tag:hover",
          "background-color:#ccc;color:#666;text-decoration:line-through;");
        this.addCss(
          "#q_wrapper ul.q-taglist li.q-tag.q-used",
          "background-color:#ccc;color:#666;text-decoration:line-through;");
        this.addCss(
          "#q_wrapper ul.q-taglist li.q-tag.q-used:hover",
          "background-color:#666;color:#fff;text-decoration:none;");
      break;
      
      /////////////////////////////////////
      // Css for Q.Tooltip
      /////////////////////////////////////
      case "tooltip":
        // the tooltip itself
        this.addCss("#q_wrapper div.q-tooltip", "position:absolute;");
        
        this.addCss("#q_wrapper div.q-tooltip div.q-content", "overflow:hidden;");
      break;
      
      /////////////////////////////////////
      // Css for Q.Textarea
      /////////////////////////////////////
      case "textarea":
        var cssClass;
        
        this.addCss(
          'div.q-textarea-wrapper',
          'position: relative;');
        
        this.addCss(
          'div.q-textarea-wrapper iframe',
          'border: 1px solid #ccc;');
        
        this.addCss(
          'div.q-textarea-wrapper textarea',
          'border:1px solid #ccc; resize:none; position:relative !important; top:auto; left:auto; right:auto; bottom:auto;');
        
        this.addCss(
          "ul.q-textarea-toolbar",
          "margin:0; padding: 0; background-color:#f2f2f2; position:relative;");
                     
        this.addCss(
          "ul.q-textarea-toolbar li.button",
          "margin:0; padding:0; list-style-type:none; cursor:pointer; float:left; position:relative; width:30px; height:30px; background-image: url(" + Q.imagePath + "/textarea.png);");
        
        this.addCss(
          "ul.q-textarea-toolbar li.q-heading-select",
          "position:absolute; margin:0; padding:0; list-style-type:none; top:0px; left:0; z-index:10;");
        
        this.addCss(
          "ul.q-textarea-toolbar li.q-heading-select ul",
          "margin:0; padding:0; top:0px; width:210px; height:30px; background-color:#fff; -webkit-box-shadow: rgba(0, 0, 0, 0.5) 0px 2px 7px; box-shadow: rgba(0, 0, 0, 0.5) 0px 2px 7px; -moz-box-shadow: rgba(0, 0, 0, 0.5) 0px 2px 7px;");
        
        this.addCss(
           "ul.q-textarea-toolbar li.q-heading-select ul li",
           "margin:0; padding:0; list-style-type:none; float:left; cursor:pointer;");
        
        this.addCss(
          "ul.q-textarea-toolbar li.button input.q-editor-color-field",
          "width:28px; height:28px; margin:0; padding:0; opacity:0; -moz-opacity:0; cursor:pointer;");
        
        if (Q.IE) {
          this.addCss(
            "ul.q-textarea-toolbar li.button input.q-editor-color-field",
            "filter:alpha(opacity=0);");
            
          this.addCss(
            "ul.q-textarea-toolbar li.q-heading-select ul",
            "border: 2px solid #666;");
        }
          
        this.addCss(
          "ul.q-textarea-toolbar.small li.q-heading-select ul",
          "width:140px; height:20px;");
        
        this.addCss(
          "ul.q-textarea-toolbar.small li.button",
          "width:20px; height:20px; background-image: url(" + Q.imagePath + "/textarea-small.png);");
        
        this.addCss(
          "ul.q-textarea-toolbar.small li.button select.q-editor-select",
          "top: 2px; width:20px; height:20px;");
        
        this.addCss(
          "ul.q-textarea-toolbar.small li.button input.q-editor-color-field",
          "width:18px; height:18px;");
        
        // add all toolbar buttons
        $w('Heading Bold Italic Underline StrikeThrough CreateLink InsertImage JustifyLeft JustifyCenter JustifyRight JustifyFull Indent Outdent ForeColor BackColor InsertUnorderedList InsertOrderedList RemoveFormat EditCode').each((function(button, i) {
          cssClass = button.underscore().dasherize();
          
          // big icons (30 x 30 px)
          this.addCss(
            "ul.q-textarea-toolbar li." + cssClass,
            "background-position: -" + i * 30 + "px 0;");
          
          this.addCss(
            "ul.q-textarea-toolbar li." + cssClass + ":hover" + ", ul.q-textarea-toolbar li." + cssClass + ".active",
            "background-position: -" + i * 30 + "px -30px;");
          
          this.addCss(
            "ul.q-textarea-toolbar li." + cssClass + ".inactive",
            "background-position: -" + i * 30 + "px -60px !important; cursor:default !important;");
          
          // small icons (20 x 20 px)
          this.addCss(
            "ul.q-textarea-toolbar.small li." + cssClass,
            "background-position: -" + i * 20 + "px 0;");
          
          this.addCss(
            "ul.q-textarea-toolbar.small li." + cssClass + ":hover" + ", ul.q-textarea-toolbar.small li." + cssClass + ".active",
            "background-position: -" + i * 20 + "px -20px;");
          
          this.addCss(
            "ul.q-textarea-toolbar.small li." + cssClass + ".inactive",
            "background-position: -" + i * 20 + "px -40px !important; cursor:default !important;");
        }).bind(this));
        
        // heading select div option big icon (30 x 30 px)
        this.addCss(
          "ul.q-textarea-toolbar li.option.div",
          "background-position: 0px 0px;");
        
        this.addCss(
          "ul.q-textarea-toolbar li.option.div:hover",
          "background-position: 0px -30px;");
        
        // heading select div option small icon (20 x 20 px)
        this.addCss(
          "ul.q-textarea-toolbar.small li.option.div",
          "background-position: 0px 0px;");
        
        this.addCss(
          "ul.q-textarea-toolbar.small li.option.div:hover",
          "background-position: 0px -20px;");
        
        // all heading variations
        $R(1,6).each((function(i) {
          // big icons (30 x 30 px)
          this.addCss(
            "ul.q-textarea-toolbar li.option.h" + i,
            "background-position: -" + (540 + i * 30) + "px 0px;");
          
          this.addCss(
            "ul.q-textarea-toolbar li.heading.h" + i + ", ul.q-textarea-toolbar li.option.h" + i + ":hover",
            "background-position: -" + (540 + i * 30) + "px -30px;");
          
          this.addCss(
            "ul.q-textarea-toolbar li.heading.h" + i + ".inactive",
            "background-position: -" + (540 + i * 30) + "px -60px;");
          
          // small icons (20 x 20 px)
          this.addCss(
            "ul.q-textarea-toolbar.small li.option.h" + i,
            "background-position: -" + (360 + i * 20) + "px 0px;");
          
          this.addCss(
            "ul.q-textarea-toolbar.small li.heading.h" + i + ", ul.q-textarea-toolbar.small li.option.h" + i + ":hover",
            "background-position: -" + (360 + i * 20) + "px -20px;");
          
          this.addCss(
            "ul.q-textarea-toolbar.small li.heading.h" + i + ".inactive",
            "background-position: -" + (360 + i * 20) + "px -40px;");
          
        }).bind(this));
      break;
      
      /////////////////////////////////////
      // Css for Q.Window
      /////////////////////////////////////
      case "window":
        // window itself
        this.addCss(
          "div.q-window",
          "z-index:99996;font-size:12px;");
        // content
        this.addCss(
          "div.q-window div.q-content",
          "overflow:hidden;");
        // close button
        this.addCss(
          "div.q-window div.q-window-close",
          "position:absolute;width:24px;height:24px;right:0px;top:0px;z-index:100;cursor:pointer;background-position:-24px -168px;background-image:url(" + Q.imagePath_h + ");");
        this.addCss(
          "div.q-window div.q-window-close.q-left",
          "left:0px;right:auto;");
        // resize handle
        this.addCss(
          "div.q-window div.q-window-resize",
          "position:absolute;width:24px;height:24px;right:6px;bottom:5px;z-index:101;cursor:move;background-position:-72px -168px;background-image:url(" + Q.imagePath_h + ");");
        this.addCss(
          "div.q-plain div.q-window-resize",
          "background-position:-96px -168px;");
        // window titlebar
        this.addCss(
          "div.q-window div.q-window-title",
          "position:absolute;width:100%;height:24px;left:0px;top:6px;");
        this.addCss(
          "div.q-window div.q-window-title p.q-window-label",
          "height:100%;margin:0 25px;font-weight:bold;text-align:center;");
        // wrapper for buttons
        this.addCss(
          "div.q-window div.q-buttons-wrapper",
          "position:relative;height:25px;")
        // button
        this.addCss(
          "div.q-window div.q-buttons-wrapper input.q-button",
          "width:100px;height:22px;cursor:pointer;-moz-border-radius:3px;-webkit-border-radius:3px;border:1px solid #fff;font-size:12px;font-weight:bold;background-color:#ccc;background-image:url(" + Q.imagePath_h + ");background-position:0 -200px;");
        this.addCss("div.q-window input.q-button:hover", "background-color:#999;");
        // next button
        this.addCss(
          "div.q-window div.q-buttons-wrapper input.q-next-button",
          "background-color:#8CC63F;text-shadow:#BFFF5C 0px 1px 0px;color:#111;float:right;margin-right:10px;");
        this.addCss("div.q-window input.q-next-button:hover", "background-color:#67991D;");
        // cancel button
        this.addCss(
          "div.q-window div.q-buttons-wrapper input.q-cancel-button",
          "text-shadow:#fff 0px 1px 0px;color:#333;float:left;margin-left:10px;display:block;");
        this.addCss(
          "div.q-window textarea.q-textarea",
          "width:94%;height:150px;resize:vertical;margin:0 3% 20px 3%;");
      break;
    }
    
    this.cssDeclarations.push(plugin);
  },
  
  // callback
  callback: function(method, self, value, state) {
    // callbacks
    switch(typeof self.options[method]) {
      case 'function':
        if (typeof state != 'undefined')
          self.options[method](value, state, self);
        else if (typeof value != 'undefined')
          self.options[method](value, self);
        else
          self.options[method](self);
      break;
      case 'string':
        (function() {
          eval(self.options[method]);
        }).bind(self)();
      break;
    }
  }
};

// the base class
Q.Base = Class.create({
  initialize: function(input) {
    // define default options
    this.options = {};
    
    // create the main wrapper
    this.createWrapper();
    
    // set variables
    this.is_over = false;
    
    // add instance to Q's buffer
    Q.instances.push(this);
    
    if (input)
      this.input = $(input);
  },
  
  // create a wrapper for all Q descendants
  createWrapper: function() {
    if ($("q_wrapper")) {
      this.div = $("q_wrapper");
    } else {
      this.div = new Element("div", { id: "q_wrapper", "class": "q-wrapper" });
      $(document.body).insert({ bottom: this.div });
    }
  },
  
  // create a holder for a given descendant
  createHolder: function(type) {
    var holder  = this.holder = new Element("div");
    if (this.options.div)
      this.div  = $(this.options.div);
    if (!type)
      this.options.style || "plain";
    holder.
      addClassName("q-holder").
      setStyle(this.options.holderStyle).
      hide();
    
    // insert elements
    holder.background = this.buildBackground(type);
    holder.insert(holder.background);
    this.div.insert(holder);
    if (!this.options.div)
      this.positionHolder();
    
    // apply holder behavior
    this.holder.observe("mouseover", (function() {
      this.is_over = true;
    }).bind(this));
    
    this.holder.observe("mouseout", (function() {
      if (this.is_over)
        this.input.focus();
      this.is_over = false;
    }).bind(this));
    
    // apply input behavior
    this.input.observe("focus", (function() {
      this.show();
    }).bind(this));
    
    this.input.observe("blur", (function() {
      if (!this.is_over) this.hide();
    }).bind(this));
    
    return holder;
  },
  
  // build background
  buildBackground: function(type) {
    var table = new Element("table", { "class": "q-background" }),
        c = Q.imageTypes[type || "plain"], // color / type
        s = 24, // grid size for background images
        div, center;
    
    div = new Element("div")
      .addClassName("q-background q-" + type);
    
    // left top corner
    div.insert(new Element("div")
      .addClassName("q-corner")
      .setStyle({ left: 0, top: 0, backgroundImage: "url(" + Q.imagePath_h + ")", backgroundPosition: -(c * s) + "px -144px" }));
    // center bottom spacer
    div.insert(new Element("div")
      .addClassName("q-edge-spacer"));
    // right top corner
    div.insert(new Element("div")
      .addClassName("q-corner")
      .setStyle({ right: 0, top: 0, backgroundImage: "url(" + Q.imagePath_h + ")", backgroundPosition: -(c * s + 12) + "px -144px" }));
    
    // center
    div.center = new Element("div")
      .addClassName("q-content");
      
    div.insert(center = new Element("div")
      .addClassName("q-center")
      .setStyle({ backgroundImage: "url(" + Q["filler_path_" + type] + ")" })
      // border left
      .insert(new Element("div")
        .addClassName("q-border")
        .setStyle({ left: "-12px", top: "0px", backgroundImage: "url(" + Q.imagePath_v + ")", backgroundPosition: -(c * s) + "px 0" }))
      // border right
      .insert(new Element("div")
        .addClassName("q-border")
        .setStyle({ right: "-12px", top: "0px", backgroundImage: "url(" + Q.imagePath_v + ")", backgroundPosition: -(c * s + 12) + "px 0" }))
      // edge top
      .insert(new Element("div")
        .addClassName("q-edge")
        .setStyle({ top: "-12px", backgroundImage: "url(" + Q.imagePath_h + ")", backgroundPosition: "0 " + -(c * s) + "px" }))
      // edge bottom
      .insert(new Element("div")
        .addClassName("q-edge")
        .setStyle({ bottom: "-12px", backgroundImage: "url(" + Q.imagePath_h + ")", backgroundPosition: "0 " + -(c * s + 11) + "px" }))
      .insert(new Element("div")
        .addClassName("q-top-spacer")));
    
    // visual IE hack
    if (Prototype.Browser.IE)
      center
        .insert(new Element("div")
          .addClassName("q-top-spacer"))
    
    center
      .insert(div.center)
    
    // left bottom corner
    div.insert(new Element("div")
      .addClassName("q-corner")
      .setStyle({ left: 0, bottom: 0, backgroundImage: "url(" + Q.imagePath_h + ")", backgroundPosition: -(c * s) + "px -155px" }));
    // center bottom spacer
    div.insert(new Element("div")
      .addClassName("q-edge-spacer"));
    // right bottom corner
    div.insert(new Element("div")
      .addClassName("q-corner")
      .setStyle({ right: 0, bottom: 0, backgroundImage: "url(" + Q.imagePath_h + ")", backgroundPosition: -(c * s + 12) + "px -155px" }));
    
    // add some methods
    div.insert = function(content, options) {
      this.center.insert(content, options);
      return this; }
    
    div.update = function(content) {
      this.center.update(content);
      return this; }
    
    return div;
  },
  
  // place the q-holder visually
  positionHolder: function() {
    if (this.holder && typeof this.input != "undefined") {
      var pos = this.input.cumulativeOffset(),
          dim = this.input.getDimensions(),
          doc = document.viewport.getDimensions(),
          left = pos[0],
          top = pos[1] + dim.height,
          x = this.options.left,
          y = this.options.top;
      
      if (this.options.axis == "vertical") {
        left = pos[0] + dim.width;
        top = pos[1]; }
      
      // define horizontal position
      if (x == 0 || parseInt(x))
        left += parseInt(x);
      if (left + this.holder.getWidth() > doc.width)
        left = doc.width - this.holder.getWidth() - 5;
      
      // define vertical position
      if (y == 0 || parseInt(y))
        top += parseInt(y);
      
      // set the values
      this.holder.setStyle({
        left: left + "px",
        top:  top + "px"
      });
    }
  },
  
  // show holder
  show: function(force) {
    if (Q.active != this || force) {
      this.positionHolder();
      
      if (typeof this.setValue == "function" && this.input)
        this.setValue(this.input.value);
      
      Q.callback('onShow', this);
      
      Q.active = this;
      this.holder.appear({ duration: 0.1 });
    }
  },
  
  // hide holder
  hide: function(force) {
    if (Q.active || force) {
      Q.active = false;
      
      if (force) {
        this.is_over = false;
        this.holder.hide();
      } else {
        this.holder.fade({ duration: 0.05 });
      }
      
      if (this.input)
        this.input.blur();
      
      Q.callback('onHide', this);
    }
  },
  
  // force hide holder
  close: function() {
    this.hide(true);
    
    Q.callback('onClose', this);
  }
});

/*
 * Q.Cookies - Based on CookieJar by Lalit Patel - http://www.lalit.org/lab/jsoncookies
 */

Q.Cookies = Class.create({
  initialize: function(options) {
    this.options = {
      expires:  3600,
      path:     '',
      domain:   '',   
      secure:   false,
      prefix:   'Q_' };
    $H(this.options).merge(options || {}).toObject();

    if (this.options.expires != '') {
      var date = new Date();
      date = new Date(date.getTime() + (this.options.expires * 1000));
      this.options.expires = '; expires=' + date.toGMTString();
    }
    if (this.options.path != '')
      this.options.path = '; path=' + escape(this.options.path);
    
    if (this.options.domain != '')
      this.options.domain = '; domain=' + escape(this.options.domain);
    
    if (this.options.secure == true)
      this.options.secure = '; secure';
    else
      this.options.secure = '';
  },
  
  // create a new cookie
  create: function(name, value) {
    var cookie_string,
        cookie = this.options;
    name = this.options.prefix + name;
    switch(typeof value) {
      case 'undefined':
      case 'function' :
      case 'unknown'  : return false;
      case 'boolean'  : 
      case 'string'   : 
      case 'number'   : value = String(value.toString());
    }
    cookie_string = name + "=" + escape(Object.toJSON(value));
    try {
      document.cookie = cookie_string + cookie.expires + cookie.path + cookie.domain + cookie.secure;
    } catch (e) {
      return false;
    }
    return true;
  },
  
  // remove a cookie by it's name
  remove: function(name) {
    var cookie = this.options,
        date, expires;
    name = this.options.prefix + name;
    try {
      date = new Date();
      date.setTime(date.getTime() - (3600 * 1000));
      expires = '; expires=' + date.toGMTString();
      document.cookie = name + "=" + expires + cookie.path + cookie.domain + cookie.secure;
    } catch (e) {
      return false;
    }
    return true;
  },
  
  // get a cookie by it's name
  get: function(name) {
    name = this.options.prefix + name;
    var cookies = document.cookie.match(name + '=(.*?)(;|$)');
    if (cookies) {
      return (unescape(cookies[1])).evalJSON();
    } else {
      return null;
    }
  },
  
  // delete all cookies
  clear: function() {
    this.names().each((function(key) {
      this.remove(key);
    }).bind(this));
  },
  
  // get all cookies as an object
  all: function() {
    var cookies = {};
    this.names().each((function(key, i) {
      cookies[key] = this.get(key);
    }).bind(this));
    return cookies;
  },
  
  // get all existing keys
  names: function() {
    var keys        = [],
        key_format  = /[^=; ]+(?=\=)/g,
        raw_string  = document.cookie,
        reg_exp     = new RegExp("^" + this.options.prefix);
    while((match = key_format.exec(raw_string)) != undefined) {
      if (reg_exp.test(match[0].strip()))
        keys.push(match[0].strip().gsub("^" + this.options.prefix, ""));
    }
    return keys;
  }
});

/*
 * Q.I18n - Inspired by Rails' locale management
 */

Q.I18n = {
  // base variables
  locale: "en",
  locales: {},
  // add locales
  add: function(locales) {
    if (typeof locales == "string" && locales.isJSON())
      locales = locales.evalJSON();
    
    this.locales = $H(this.locales)
      .merge(locales)
      .toObject();
  },
  // get the translation
  t: function(key, interpolations) {
    var loc = this.locales,
        list;
    
    // find translation
    key.split(".").each((function(k) {
      if (loc[k])
        loc = loc[k];
    }).bind(this));
    
    // return translation if found
    if (typeof loc == 'object') {
      
      if (interpolations && interpolations.fallback) {
        return interpolations.fallback;
      } else {
        list = key.split(".");
        list.unshift(this.locale);

        return "translation missing: " + list.join(", ");
      }
      
    } else if (typeof loc == "string" && typeof interpolations == "object") {
      
      $H(interpolations).each(function(pair) {
        loc = loc.gsub(new RegExp("\{\{([ ]+)?" + pair.key + "([ ]+)?\}\}"), pair.value)
      });
      
      return loc;
    } else {
      
      return loc;
    }
  }
}

/*
 * Extending Prototype
 */

Object.extend(window, {
  observe:       Element.Methods.observe.methodize(),
  stopObserving: Element.Methods.stopObserving.methodize()
});

(document.onresize ? document : window).observe("resize", function() {
  if (!document.viewport.is_resized) {
    
    document.viewport.is_resized = true;
    document.fire("resize:start");
    
    var resizeEnd = (function() {
      
      document.viewport.is_resized = false;
      document.fire("resize:end");
      
      Event.stopObserving(document, "mousemove", resizeEnd);
      
    }).bind(this);
    
    document.observe("mousemove", resizeEnd);
  }
});

// extend string class
Object.extend(String.prototype, {
  // md5 hash from string
  toMD5: function () {
    var string = this;
    
    function RotateLeft(lValue, iShiftBits) {
      return (lValue<<iShiftBits) | (lValue>>>(32-iShiftBits));
    }
    
    function AddUnsigned(lX,lY) {
      var lX4,lY4,lX8,lY8,lResult;
      lX8 = (lX & 0x80000000);
      lY8 = (lY & 0x80000000);
      lX4 = (lX & 0x40000000);
      lY4 = (lY & 0x40000000);
      lResult = (lX & 0x3FFFFFFF)+(lY & 0x3FFFFFFF);
      if (lX4 & lY4) {
        return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
      }
      if (lX4 | lY4) {
        if (lResult & 0x40000000) {
          return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
        } else {
          return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
        }
      } else {
        return (lResult ^ lX8 ^ lY8);
      }
    }

    function F(x,y,z) { return (x & y) | ((~x) & z); }
    function G(x,y,z) { return (x & z) | (y & (~z)); }
    function H(x,y,z) { return (x ^ y ^ z); }
    function I(x,y,z) { return (y ^ (x | (~z))); }

    function FF(a,b,c,d,x,s,ac) {
      a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
      return AddUnsigned(RotateLeft(a, s), b);
    };

    function GG(a,b,c,d,x,s,ac) {
      a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
      return AddUnsigned(RotateLeft(a, s), b);
    };

    function HH(a,b,c,d,x,s,ac) {
      a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
      return AddUnsigned(RotateLeft(a, s), b);
    };

    function II(a,b,c,d,x,s,ac) {
      a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
      return AddUnsigned(RotateLeft(a, s), b);
    };

    function ConvertToWordArray(string) {
      var lWordCount;
      var lMessageLength = string.length;
      var lNumberOfWords_temp1=lMessageLength + 8;
      var lNumberOfWords_temp2=(lNumberOfWords_temp1-(lNumberOfWords_temp1 % 64))/64;
      var lNumberOfWords = (lNumberOfWords_temp2+1)*16;
      var lWordArray=Array(lNumberOfWords-1);
      var lBytePosition = 0;
      var lByteCount = 0;
      while ( lByteCount < lMessageLength ) {
        lWordCount = (lByteCount-(lByteCount % 4))/4;
        lBytePosition = (lByteCount % 4)*8;
        lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount)<<lBytePosition));
        lByteCount++;
      }
      lWordCount = (lByteCount-(lByteCount % 4))/4;
      lBytePosition = (lByteCount % 4)*8;
      lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80<<lBytePosition);
      lWordArray[lNumberOfWords-2] = lMessageLength<<3;
      lWordArray[lNumberOfWords-1] = lMessageLength>>>29;
      return lWordArray;
    };

    function WordToHex(lValue) {
      var WordToHexValue="",WordToHexValue_temp="",lByte,lCount;
      for (lCount = 0;lCount<=3;lCount++) {
        lByte = (lValue>>>(lCount*8)) & 255;
        WordToHexValue_temp = "0" + lByte.toString(16);
        WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length-2,2);
      }
      return WordToHexValue;
    };

    function Utf8Encode(string) {
      string = string.replace(/\r\n/g,"\n");
      var utftext = "";

      for (var n = 0; n < string.length; n++) {

        var c = string.charCodeAt(n);

        if (c < 128) {
          utftext += String.fromCharCode(c);
        }
        else if((c > 127) && (c < 2048)) {
          utftext += String.fromCharCode((c >> 6) | 192);
          utftext += String.fromCharCode((c & 63) | 128);
        }
        else {
          utftext += String.fromCharCode((c >> 12) | 224);
          utftext += String.fromCharCode(((c >> 6) & 63) | 128);
          utftext += String.fromCharCode((c & 63) | 128);
        }

      }

      return utftext;
    };

    var x=Array();
    var k,AA,BB,CC,DD,a,b,c,d;
    var S11=7, S12=12, S13=17, S14=22;
    var S21=5, S22=9 , S23=14, S24=20;
    var S31=4, S32=11, S33=16, S34=23;
    var S41=6, S42=10, S43=15, S44=21;

    string = Utf8Encode(string);

    x = ConvertToWordArray(string);

    a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;

    for (k=0;k<x.length;k+=16) {
      AA=a; BB=b; CC=c; DD=d;
      a=FF(a,b,c,d,x[k+0], S11,0xD76AA478);
      d=FF(d,a,b,c,x[k+1], S12,0xE8C7B756);
      c=FF(c,d,a,b,x[k+2], S13,0x242070DB);
      b=FF(b,c,d,a,x[k+3], S14,0xC1BDCEEE);
      a=FF(a,b,c,d,x[k+4], S11,0xF57C0FAF);
      d=FF(d,a,b,c,x[k+5], S12,0x4787C62A);
      c=FF(c,d,a,b,x[k+6], S13,0xA8304613);
      b=FF(b,c,d,a,x[k+7], S14,0xFD469501);
      a=FF(a,b,c,d,x[k+8], S11,0x698098D8);
      d=FF(d,a,b,c,x[k+9], S12,0x8B44F7AF);
      c=FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1);
      b=FF(b,c,d,a,x[k+11],S14,0x895CD7BE);
      a=FF(a,b,c,d,x[k+12],S11,0x6B901122);
      d=FF(d,a,b,c,x[k+13],S12,0xFD987193);
      c=FF(c,d,a,b,x[k+14],S13,0xA679438E);
      b=FF(b,c,d,a,x[k+15],S14,0x49B40821);
      a=GG(a,b,c,d,x[k+1], S21,0xF61E2562);
      d=GG(d,a,b,c,x[k+6], S22,0xC040B340);
      c=GG(c,d,a,b,x[k+11],S23,0x265E5A51);
      b=GG(b,c,d,a,x[k+0], S24,0xE9B6C7AA);
      a=GG(a,b,c,d,x[k+5], S21,0xD62F105D);
      d=GG(d,a,b,c,x[k+10],S22,0x2441453);
      c=GG(c,d,a,b,x[k+15],S23,0xD8A1E681);
      b=GG(b,c,d,a,x[k+4], S24,0xE7D3FBC8);
      a=GG(a,b,c,d,x[k+9], S21,0x21E1CDE6);
      d=GG(d,a,b,c,x[k+14],S22,0xC33707D6);
      c=GG(c,d,a,b,x[k+3], S23,0xF4D50D87);
      b=GG(b,c,d,a,x[k+8], S24,0x455A14ED);
      a=GG(a,b,c,d,x[k+13],S21,0xA9E3E905);
      d=GG(d,a,b,c,x[k+2], S22,0xFCEFA3F8);
      c=GG(c,d,a,b,x[k+7], S23,0x676F02D9);
      b=GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A);
      a=HH(a,b,c,d,x[k+5], S31,0xFFFA3942);
      d=HH(d,a,b,c,x[k+8], S32,0x8771F681);
      c=HH(c,d,a,b,x[k+11],S33,0x6D9D6122);
      b=HH(b,c,d,a,x[k+14],S34,0xFDE5380C);
      a=HH(a,b,c,d,x[k+1], S31,0xA4BEEA44);
      d=HH(d,a,b,c,x[k+4], S32,0x4BDECFA9);
      c=HH(c,d,a,b,x[k+7], S33,0xF6BB4B60);
      b=HH(b,c,d,a,x[k+10],S34,0xBEBFBC70);
      a=HH(a,b,c,d,x[k+13],S31,0x289B7EC6);
      d=HH(d,a,b,c,x[k+0], S32,0xEAA127FA);
      c=HH(c,d,a,b,x[k+3], S33,0xD4EF3085);
      b=HH(b,c,d,a,x[k+6], S34,0x4881D05);
      a=HH(a,b,c,d,x[k+9], S31,0xD9D4D039);
      d=HH(d,a,b,c,x[k+12],S32,0xE6DB99E5);
      c=HH(c,d,a,b,x[k+15],S33,0x1FA27CF8);
      b=HH(b,c,d,a,x[k+2], S34,0xC4AC5665);
      a=II(a,b,c,d,x[k+0], S41,0xF4292244);
      d=II(d,a,b,c,x[k+7], S42,0x432AFF97);
      c=II(c,d,a,b,x[k+14],S43,0xAB9423A7);
      b=II(b,c,d,a,x[k+5], S44,0xFC93A039);
      a=II(a,b,c,d,x[k+12],S41,0x655B59C3);
      d=II(d,a,b,c,x[k+3], S42,0x8F0CCC92);
      c=II(c,d,a,b,x[k+10],S43,0xFFEFF47D);
      b=II(b,c,d,a,x[k+1], S44,0x85845DD1);
      a=II(a,b,c,d,x[k+8], S41,0x6FA87E4F);
      d=II(d,a,b,c,x[k+15],S42,0xFE2CE6E0);
      c=II(c,d,a,b,x[k+6], S43,0xA3014314);
      b=II(b,c,d,a,x[k+13],S44,0x4E0811A1);
      a=II(a,b,c,d,x[k+4], S41,0xF7537E82);
      d=II(d,a,b,c,x[k+11],S42,0xBD3AF235);
      c=II(c,d,a,b,x[k+2], S43,0x2AD7D2BB);
      b=II(b,c,d,a,x[k+9], S44,0xEB86D391);
      a=AddUnsigned(a,AA);
      b=AddUnsigned(b,BB);
      c=AddUnsigned(c,CC);
      d=AddUnsigned(d,DD);
    }

    var temp = WordToHex(a)+WordToHex(b)+WordToHex(c)+WordToHex(d);

    return temp.toLowerCase();
  },
  
  // html encode delicate entities
  HTMLencode: function() {
    var str = this.replace(/&/g, "&amp;");
    str = str.replace(/>/g, "&gt;");
    str = str.replace(/</g, "&lt;");
    str = str.replace(/"/g, "&quot;");
    str = str.replace(/'/g, "&#039;");
    return str;
  },
  
  // html decode delicate entities
  HTMLdecode: function() {
    var str = this.replace(/&amp;/g, "&");
    str = str.replace(/&gt;/g, ">");
    str = str.replace(/&lt;/g, "<");
    str = str.replace(/&quot;/g, "\"");
    str = str.replace(/&#039;/g, "'");
    return str;
  },
  
  // humanize, like rails
  humanize: function() {
    return this.
      underscore().
      capitalize().
      gsub(/(_id)|\-|\.|_/, ' ');
  }
});

// extend number class
Object.extend(Number.prototype, {
  toMD5: function() {
    return this.toString().toMD5();
  },
  
  withFormat: function(options) {
    var prefix    = options.prefix    || '',
        delimiter = options.delimiter || '',
        separator = options.separator || '',
        suffix    = options.suffix    || '',
        precision = options.precision,
        parts, number = this;
    
    if (typeof precision == 'number')
      number = number.toFixed(precision);
    
    parts = number.toString().split('.');
    parts[0] = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1" + delimiter);
    
    return prefix + parts.join(separator) + suffix;
  }
});

/*
 * Add dynamic stylesheet functionality
 */

Q.addDynamicStylesheetMethodsTo = function(doc) {
  if (typeof doc.createStyleSheet == 'undefined') {
    doc.createStyleSheet = (function() {
      
      function createStyleSheet(href) {
        if (typeof href !== 'undefined') {
          var element = doc.createElement('link');
          element.type = 'text/css';
          element.rel = 'stylesheet';
          element.href = href;
        }
        else {
          var element = doc.createElement('style');
          element.type = 'text/css';
        }
        doc.getElementsByTagName('head')[0].appendChild(element);
        var sheet = doc.styleSheets[doc.styleSheets.length - 1];
        if (typeof sheet.addRule === 'undefined')
          sheet.addRule = addRule;
        if (typeof sheet.removeRule === 'undefined')
          sheet.removeRule = sheet.deleteRule;
        return sheet;
      }
      
      function addRule(selectorText, cssText, index) {
        if (typeof index === 'undefined')
          index = this.cssRules.length;
        this.insertRule(selectorText + ' {' + cssText + '}', index);
      }
      
      return createStyleSheet;
    })();
  }
}

// setup and activate Q

document.observe("dom:loaded", function() {
  // Add more detailed events to window resize
  document.observe("resize:start", function() {
    Q.hide();
  });
  document.observe("resize:end", function() {
    Q.reposition();
  });
  
  // setup Q
  Q.setup();
});