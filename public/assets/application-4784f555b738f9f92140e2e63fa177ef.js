(function() {
  this.App = Ember.Application.create({
    clock: 0,
    LOG_TRANSITIONS: true,
    LOG_TRANSITIONS_INTERNAL: true,
    ready: function() {
      return this.scheduleClockUpdate();
    },
    scheduleClockUpdate: function() {
      return Em.run.later(this, this.updateGlobalClock, 5000);
    },
    updateGlobalClock: function() {
      this.incrementProperty('clock');
      Em.run.once(function() {
        return App.Post.all();
      });
      return this.scheduleClockUpdate();
    }
  });

}).call(this);
(function() {
  App.ForgotPasswordControllerMixin = Em.Mixin.create({
    actions: {
      resetPassword: function() {
        var promise;
        this.set('isRequesting', true);
        promise = this.get('model').request();
        promise.then((function(_this) {
          return function() {
            _this.send('reset');
            _this.set('isRequesting', false);
            return _this.transitionToRoute('forgot_password.success');
          };
        })(this));
        return promise["catch"]((function(_this) {
          return function(error) {
            var message;
            message = (error = 'Unprocessable Entity') ? 'No new password given' : 'Unknown token supplied';
            App.Alert.add({
              message: message,
              severity: 'error'
            });
            return _this.set('isRequesting', false);
          };
        })(this));
      },
      reset: function() {
        return this.setProperties({
          token: null,
          newPassword: null
        });
      }
    }
  });

}).call(this);
(function() {
  App.ProtectedRouteMixin = Em.Mixin.create({
    beforeModel: function() {
      var token;
      token = this.modelFor('application');
      if (!token.get('hasUser')) {
        return this.transitionTo('users.signIn');
      }
    }
  });

}).call(this);
(function() {
  App.ProtectedUserRouteMixin = Em.Mixin.create({
    model: function() {
      return this.modelFor('user');
    },
    afterModel: function(model) {
      var token;
      token = this.modelFor('application');
      if (model.get('id') !== token.get('user.id')) {
        return this.transitionTo('index');
      }
    }
  });

}).call(this);
(function() {
  App.SignInControllerMixin = Em.Mixin.create({
    needs: ['application'],
    sessionTokenBinding: 'controllers.application.model',
    init: function() {
      this._super();
      return this.send('reset');
    },
    username: null,
    password: null,
    errors: null,
    rememberMe: false,
    hasUsername: Em.computed.bool('username'),
    hasPassword: Em.computed.bool('password'),
    signInButtonEnabled: Em.computed.and('hasUsername', 'hasPassword'),
    signInButtonDisabled: Em.computed.not('signInButtonEnabled'),
    actions: {
      reset: function() {
        return this.setProperties({
          username: null,
          password: null,
          errors: null,
          rememberMe: false
        });
      },
      attemptSignIn: function() {
        var onFailure, onSuccess, password, username;
        onSuccess = (function(_this) {
          return function(token) {
            return token.get('user').then(function(user) {
              return user.get('session').refresh(user).then(function() {
                return _this.send('authenticationDidSucceed', user);
              });
            });
          };
        })(this);
        onFailure = (function(_this) {
          return function(token) {
            return _this.send('authenticationFailed');
          };
        })(this);
        username = this.get('username');
        password = this.get('password');
        return this.get('sessionToken').authenticate(username, password).then(onSuccess, onFailure);
      },
      authenticationDidSucceed: function(user) {
        if (this.get('rememberMe')) {
          this.send('storeApiSecret', user);
        }
        this.send('reset');
        return this.transitionToRoute('user.index', user);
      },
      authenticationFailed: function() {
        return this.set('errors', Em.Object.create({
          password: ['Authentication failed']
        }));
      },
      storeApiSecret: function(user) {
        if (user.get('hasApiSecret')) {
          localStorage['api_username'] = user.get('username');
          return localStorage['api_secret'] = user.get('apiSecret');
        }
      }
    }
  });

}).call(this);
(function() {
  var allPosts;

  allPosts = [];

  App.Post = Em.Object.extend({
    nickname: null,
    body: null,
    createdAt: (function() {
      return new Date(this.get('created_at'));
    }).property('created_at'),
    updatedAt: (function() {
      return new Date(this.get('updated_at'));
    }).property('updated_at')
  });

  App.Post.reopenClass({
    all: function() {
      return Em.run((function(_this) {
        return function() {
          return new Em.RSVP.Promise(function(resolve, reject) {
            return $.ajax({
              dataType: 'json',
              url: '/posts',
              type: 'GET',
              success: function(data) {
                var newPost, post, _i, _len, _ref;
                _ref = data.posts;
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                  post = _ref[_i];
                  if (allPosts.anyBy('id', post.posts.id)) {
                    continue;
                  }
                  newPost = App.Post.create();
                  newPost.setProperties(post.posts);
                  allPosts.pushObject(newPost);
                }
                return resolve(allPosts);
              },
              error: function(xhr, status, err) {
                console.log(xhr, status, err);
                return reject(err);
              }
            });
          });
        };
      })(this));
    },
    add: function(opts) {
      if (opts == null) {
        opts = {};
      }
      return Em.run((function(_this) {
        return function() {
          return new Em.RSVP.Promise(function(resolve, reject) {
            return $.ajax({
              dataType: 'json',
              data: {
                post: opts
              },
              url: '/posts',
              type: 'POST',
              success: function(data) {
                var newPost;
                newPost = App.Post.create();
                newPost.setProperties(data);
                allPosts.pushObject(newPost);
                return resolve(newPost);
              },
              error: function(xhr, status, err) {
                console.log(xhr, status, err);
                return reject(err);
              }
            });
          });
        };
      })(this));
    }
  });

}).call(this);
(function() {
  App.ApplicationController = Em.ArrayController.extend({
    init: function() {
      this._super();
      return this.set('nickname', localStorage.nickname);
    },
    hasNickname: Em.computed.bool('nickname'),
    nickname: null,
    sortProperties: ['createdAt'],
    sortAscending: false,
    postDisabled: (function() {
      return Em.isEmpty(this.get('newBody'));
    }).property('newBody'),
    actions: {
      useNickname: function() {
        var newNickname;
        newNickname = this.get('newNickname');
        localStorage.nickname = newNickname;
        this.set('nickname', newNickname);
        return false;
      },
      createPost: function() {
        if (Em.isEmpty(this.get('newBody'))) {
          return;
        }
        return App.Post.add({
          nickname: this.get('nickname'),
          body: this.get('newBody')
        }).then((function(_this) {
          return function() {
            return _this.set('newBody', null);
          };
        })(this));
      }
    }
  });

}).call(this);
(function() {
  App.PostController = Em.ObjectController.extend({
    needs: ['application'],
    mentionsMe: (function() {
      var body;
      body = this.get('body');
      return body.search("@" + localStorage.nickname) > 0;
    }).property('body'),
    actions: {
      reply: function() {
        this.set('controllers.application.newBody', "@" + (this.get('nickname')) + " ");
        return $('input[name="post"]').focus();
      }
    }
  });

}).call(this);
(function() {
  App.PostsController = Em.ArrayController.extend();

}).call(this);
(function() {
  App.UserQueryController = Em.ObjectController.extend({
    needs: 'application',
    contentBinding: 'controllers.application'
  });

}).call(this);
(function() {
  var dateSpan;

  dateSpan = function(content, title) {
    if (title == null) {
      title = void 0;
    }
    if (Em.isEmpty(title)) {
      return ("<span class=\"date\">" + content + "</span>").htmlSafe();
    } else {
      return ("<span class=\"date\" title=\"" + title + "\">" + content + "</span>").htmlSafe();
    }
  };

  Em.Handlebars.helper('timeAgo', function(value, clock, options) {
    var m;
    m = moment(value);
    return dateSpan(m.fromNow(), m.format('Mo of MMMM YYYY at H:mm:ss a'));
  });

  Em.Handlebars.helper('dateAgo', function(value, clock, options) {
    var calendar, m;
    m = moment(value);
    calendar = m.calendar().split(' at')[0].toLowerCase();
    return dateSpan(calendar, m.format('dddd Mo of MMMM YYYY'));
  });

  Em.Handlebars.helper('dateWithYear', function(value) {
    var m;
    m = moment(value);
    return dateSpan(m.format('MMMM Do YYYY'), m.format('dddd Mo of MMMM YYYY'));
  });

}).call(this);
Ember.TEMPLATES["application"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, self=this;

function program1(depth0,data) {
  
  var buffer = '', helper, options;
  data.buffer.push("<form ");
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "createPost", {hash:{
    'on': ("submit")
  },hashTypes:{'on': "STRING"},hashContexts:{'on': depth0},contexts:[depth0],types:["STRING"],data:data})));
  data.buffer.push(" class='panel new-post'>\n      <div class='row'>\n        <div class='small-12 large-12 columns'>\n          ");
  data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
    'type': ("text"),
    'name': ("post"),
    'value': ("newBody")
  },hashTypes:{'type': "ID",'name': "STRING",'value': "ID"},hashContexts:{'type': depth0,'name': depth0,'value': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("\n        </div>\n      </div>\n      <div class='row'>\n        <div class='small-12 large-12 columns'>\n          <button ");
  data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
    'disabled': ("postDisabled")
  },hashTypes:{'disabled': "STRING"},hashContexts:{'disabled': depth0},contexts:[],types:[],data:data})));
  data.buffer.push(" ");
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "createPost", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
  data.buffer.push(" class='postfix'>\n            W00t!\n          </button>\n        </div>\n      </div>\n    </form>\n    ");
  data.buffer.push(escapeExpression((helper = helpers.render || (depth0 && depth0.render),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","ID"],data:data},helper ? helper.call(depth0, "posts", "arrangedContent", options) : helperMissing.call(depth0, "render", "posts", "arrangedContent", options))));
  data.buffer.push("\n    ");
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = '', helper, options;
  data.buffer.push("\n    ");
  data.buffer.push(escapeExpression((helper = helpers.render || (depth0 && depth0.render),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "userQuery", options) : helperMissing.call(depth0, "render", "userQuery", options))));
  return buffer;
  }

  data.buffer.push("<div class='container'>\n  <div class='row large-12 small-12 large-centred columns'>\n    <h1>W00t!</h1>\n    ");
  stack1 = helpers['if'].call(depth0, "hasNickname", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n  </div>\n</div>\n");
  return buffer;
  
});
Ember.TEMPLATES["posts"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, self=this;

function program1(depth0,data) {
  
  var buffer = '', stack1, helper, options;
  data.buffer.push("<div ");
  data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
    'class': (":panel :post mentionsMe:callout::")
  },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
  data.buffer.push(">\n  <div class='row'>\n    <div class='small-8 large-8 columns nickname'>\n      @");
  stack1 = helpers._triageMustache.call(depth0, "post.nickname", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n    </div>\n    <div class='small-4 large-4 columns time-ago'>\n      ");
  data.buffer.push(escapeExpression((helper = helpers.timeAgo || (depth0 && depth0.timeAgo),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["ID","ID"],data:data},helper ? helper.call(depth0, "post.createdAt", "App.clock", options) : helperMissing.call(depth0, "timeAgo", "post.createdAt", "App.clock", options))));
  data.buffer.push("\n    </div>\n  </div>\n  <div class='row'>\n    <div class='small-12 large-12 columns body'>\n      ");
  stack1 = helpers._triageMustache.call(depth0, "post.body", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n    </div>\n  </div>\n  <div class='row'>\n    <div class='small-12 large-12 columns'>\n      <button ");
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "reply", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
  data.buffer.push(" class='tiny right'>Reply</button>\n    </div>\n  </div>\n</div>");
  return buffer;
  }

  stack1 = helpers.each.call(depth0, "post", "in", "controller", {hash:{
    'itemController': ("post")
  },hashTypes:{'itemController': "STRING"},hashContexts:{'itemController': depth0},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n");
  return buffer;
  
});
Ember.TEMPLATES["user_query"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', helper, options, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing;


  data.buffer.push("<div class='nickname-entry'>\n  <h1>Enter your nickname</h1>\n  <form ");
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "useNickname", {hash:{
    'on': ("submit")
  },hashTypes:{'on': "ID"},hashContexts:{'on': depth0},contexts:[depth0],types:["STRING"],data:data})));
  data.buffer.push(">\n    ");
  data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
    'type': ("text"),
    'name': ("nickname"),
    'value': ("newNickname")
  },hashTypes:{'type': "ID",'name': "STRING",'value': "ID"},hashContexts:{'type': depth0,'name': depth0,'value': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("\n  </form>\n</div>\n");
  return buffer;
  
});
(function() {
  App.ApplicationRoute = Em.Route.extend({
    model: function() {
      return App.Post.all();
    }
  });

}).call(this);
