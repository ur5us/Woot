Ember.TEMPLATES.application=Ember.Handlebars.template(function(s,e,a,t,n){function r(s,e){var t,n,r="";return e.buffer.push("<form "),e.buffer.push(p(a.action.call(s,"createPost",{hash:{on:"submit"},hashTypes:{on:"STRING"},hashContexts:{on:s},contexts:[s],types:["STRING"],data:e}))),e.buffer.push(" class='panel new-post'>\n      <div class='row'>\n        <div class='small-12 large-12 columns'>\n          "),e.buffer.push(p((t=a.input||s&&s.input,n={hash:{type:"text",name:"post",value:"newBody"},hashTypes:{type:"ID",name:"STRING",value:"ID"},hashContexts:{type:s,name:s,value:s},contexts:[],types:[],data:e},t?t.call(s,n):o.call(s,"input",n)))),e.buffer.push("\n        </div>\n      </div>\n      <div class='row'>\n        <div class='small-12 large-12 columns'>\n          <button "),e.buffer.push(p(a["bind-attr"].call(s,{hash:{disabled:"postDisabled"},hashTypes:{disabled:"STRING"},hashContexts:{disabled:s},contexts:[],types:[],data:e}))),e.buffer.push(" "),e.buffer.push(p(a.action.call(s,"createPost",{hash:{},hashTypes:{},hashContexts:{},contexts:[s],types:["STRING"],data:e}))),e.buffer.push(" class='postfix'>\n            W00t!\n          </button>\n        </div>\n      </div>\n    </form>\n    "),e.buffer.push(p((t=a.render||s&&s.render,n={hash:{},hashTypes:{},hashContexts:{},contexts:[s,s],types:["STRING","ID"],data:e},t?t.call(s,"posts","arrangedContent",n):o.call(s,"render","posts","arrangedContent",n)))),e.buffer.push("\n    "),r}function h(s,e){var t,n,r="";return e.buffer.push("\n    "),e.buffer.push(p((t=a.render||s&&s.render,n={hash:{},hashTypes:{},hashContexts:{},contexts:[s],types:["STRING"],data:e},t?t.call(s,"userQuery",n):o.call(s,"render","userQuery",n)))),r}this.compilerInfo=[4,">= 1.0.0"],a=this.merge(a,Ember.Handlebars.helpers),n=n||{};var l,u="",p=this.escapeExpression,o=a.helperMissing,c=this;return n.buffer.push("<div class='container'>\n  <div class='row large-12 small-12 large-centred columns'>\n    <h1>W00t!</h1>\n    "),l=a["if"].call(e,"hasNickname",{hash:{},hashTypes:{},hashContexts:{},inverse:c.program(3,h,n),fn:c.program(1,r,n),contexts:[e],types:["ID"],data:n}),(l||0===l)&&n.buffer.push(l),n.buffer.push("\n  </div>\n</div>\n"),u});