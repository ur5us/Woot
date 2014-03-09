allPosts = []

App.Post = Em.Object.extend
  nickname: null
  body:     null

  createdAt: (->
    new Date(@get('created_at'))
  ).property('created_at')

  updatedAt: (->
    new Date(@get('updated_at'))
  ).property('updated_at')

App.Post.reopenClass
  all: ->
    Em.run =>
      new Em.RSVP.Promise (resolve,reject)=>
        $.ajax
          dataType: 'json'
          url:      '/posts'
          type:     'GET'
          success:  (data)=>
            for post in data.posts
              continue if allPosts.anyBy('id', post.posts.id)
              newPost = App.Post.create()
              newPost.setProperties post.posts
              allPosts.pushObject(newPost)
            resolve(allPosts)

          error:   (xhr,status,err)=>
            console.log xhr,status,err
            reject (err)

  add: (opts={})->
    Em.run =>
      new Em.RSVP.Promise (resolve,reject)=>
        $.ajax
          dataType: 'json'
          data:     {post: opts}
          url:      '/posts'
          type:     'POST'
          success:  (data)=>
            newPost = App.Post.create()
            newPost.setProperties data
            allPosts.pushObject(newPost)
            resolve(newPost)

          error:   (xhr,status,err)=>
            console.log xhr,status,err
            reject (err)

