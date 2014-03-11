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

  mergePost: (attributes)->
    return if allPosts.anyBy('id', attributes.id)
    newPost = App.Post.create()
    newPost.setProperties attributes
    allPosts.pushObject(newPost)

  all: ->
    Em.run =>
      new Em.RSVP.Promise (resolve,reject)=>
        $.ajax
          dataType: 'json'
          url:      '/posts'
          type:     'GET'
          success:  (data)=>
            for post in data.posts
              @mergePost(post.posts)
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
            resolve @mergePost(data)

          error:   (xhr,status,err)=>
            console.log xhr,status,err
            reject (err)

