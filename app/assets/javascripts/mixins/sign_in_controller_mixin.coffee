App.SignInControllerMixin = Em.Mixin.create
  needs: ['application']
  sessionTokenBinding: 'controllers.application.model'

  init: ->
    @_super()
    @send('reset')

  username:   null
  password:   null
  errors:     null
  rememberMe: false

  hasUsername: Em.computed.bool('username')
  hasPassword: Em.computed.bool('password')
  signInButtonEnabled:  Em.computed.and('hasUsername', 'hasPassword')
  signInButtonDisabled: Em.computed.not('signInButtonEnabled')

  actions:
    reset: ->
      @setProperties(username: null, password: null, errors: null, rememberMe: false)

    attemptSignIn: ->
      onSuccess = (token)=>
        token.get('user').then (user)=>
          user.get('session').refresh(user).then =>
            @send('authenticationDidSucceed', user)

      onFailure = (token)=>
        @send('authenticationFailed')

      username = @get('username')
      password = @get('password')
      @get('sessionToken').authenticate(username, password).then(onSuccess,onFailure)

    authenticationDidSucceed: (user)->
      @send('storeApiSecret', user) if @get('rememberMe')
      @send('reset')
      @transitionToRoute('user.index', user)

    authenticationFailed: ->
      @set('errors', Em.Object.create(password: ['Authentication failed']))

    storeApiSecret: (user)->
      if user.get('hasApiSecret')
        localStorage['api_username'] = user.get('username')
        localStorage['api_secret']   = user.get('apiSecret')
