App.ApplicationRoute = Em.Route.extend
  model: ->
    App.Post.all()
