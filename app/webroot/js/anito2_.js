var Start = Class.create ({
  initialize: function(el) {
    this.el = el;
  },
  animateTopHeader: function() {
    if(!$('top-header-updater')) return;
    this.toggle();
  },
  toggle: function(cb) {
    if($(this.el)) {
      new Effect.toggle(this.el, 'blind', {
        from: 0,
        to: 1,
        duration: 1.5,
        afterFinish: cb
      });
    }
  }
})

function init() {

}

var MainLogin = Class.create({
  initialize: function(formname) {
    this.form = formname;
  },
  observe: function() {
    $('UserReminder').next('label').observe('click', function(el) {
      this.next('div.sprite').toggleClassName('checked')
    })
  },
  submit: function() {
    var form = $(this.form);
    var onCompleteHandler = function(transport) {
      var redirect_url = base_url;
      var json = transport.responseText.evalJSON();
      if (json.success === true) {
        window.location = redirect_url;
      }
      if (json.success === false) {
        $('UserPassword').clear();
        new Effect.Shake('loginform', {
          duration: 0.2,
          distance: 20
        })
      }
    }
    var onFailureHandler = function(transport) {
      alert(transport.responseText)
    }
    form.request({
      onComplete: onCompleteHandler.bind(this),
      onFailure: onFailureHandler.bind(this)
    });
  }
})


var main_lgn = new MainLogin('UserLoginForm');
var start = new Start('top-header-updater');
document.observe("dom:loaded", function() {
  start.animateTopHeader();
});
