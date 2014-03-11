class Post < ActiveRecord::Base
  after_create do |post|
    RealtimePostController.publish '/posts', post.attributes.merge(post_key: Post.post_key)
  end

  def self.post_key
    @key ||= MicroToken.generate(128)
  end
end
