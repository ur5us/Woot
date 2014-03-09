App.ProtectedUserRouteMixin = Em.Mixin.create
  model: ->
    @modelFor('user')

  afterModel: (model)->
    token = @modelFor('application')
    unless model.get('id') == token.get('user.id')
      @transitionTo('index')

