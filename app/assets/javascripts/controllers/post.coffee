App.PostController = Em.ObjectController.extend
  needs: ['application']

  mentionsMe: (->
    body = @get('body')
    body.search("@#{localStorage.nickname}") >= 0
  ).property('body')

  actions:
    reply: ->
      @set('controllers.application.newBody', "@#{@get('nickname')} ")
      $('input[name="post"]').focus()

    rewoot: ->
      @set('controllers.application.newBody', "RW @#{@get('nickname')} \"#{@get('body')}\"")
      @send('createPost')
