App.ApplicationController = Em.ArrayController.extend
  init: ->
    @_super()
    @set('nickname', localStorage.nickname)

  hasNickname: Em.computed.bool('nickname')
  nickname: null
  sortProperties: ['createdAt']
  sortAscending:  false

  postDisabled: (-> Em.isEmpty(@get('newBody'))).property('newBody')

  actions:
    useNickname: ->
      newNickname = @get('newNickname')
      localStorage.nickname = newNickname
      @set('nickname', newNickname)
      false

    createPost: ->
      return if Em.isEmpty(@get('newBody'))
      App.Post.add
        nickname: @get('nickname')
        body: @get('newBody')

      .then =>
        @set('newBody', null)

    logout: ->
      @set('nickname', null)
      localStorage.clear()
      false
