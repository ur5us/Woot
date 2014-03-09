App.ApplicationController = Em.ArrayController.extend
  init: ->
    @_super()
    @set('nickname', localStorage.nickname)

  hasNickname: Em.computed.bool('nickname')
  nickname: null
  sortProperties: ['createdAt']
  sortAscending:  false
  postingStatus: false

  newPostIsEmpty: (-> Em.isEmpty(@get('newBody'))).property('newBody')
  postDisabled: Em.computed.or('newPostIsEmpty', 'postingStatus')
  newPostInputDisabled: Em.computed.bool('postingStatus')

  isParndt: (->
    n = @getWithDefault('newNickname', '')
    (n.match /parndt/i) || (n.match /president/i)
  ).property('newNickname')

  actions:
    useNickname: ->
      newNickname = @get('newNickname')
      localStorage.nickname = newNickname
      @set('nickname', newNickname)
      false

    createPost: ->
      return if Em.isEmpty(@get('newBody'))
      @set('postingStatus', true)
      App.Post.add
        nickname: @get('nickname')
        body: @get('newBody')

      .then =>
        @set('postingStatus', false)
        @set('newBody', null)

      .catch (err...)=>
        @set('postingStatus', false)
        console.log err...

    logout: ->
      @set('nickname', null)
      localStorage.clear()
      false
