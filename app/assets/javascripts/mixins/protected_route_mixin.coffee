App.ProtectedRouteMixin = Em.Mixin.create
  beforeModel: ->
    token = @modelFor('application')
    @transitionTo('users.signIn') unless token.get('hasUser')
