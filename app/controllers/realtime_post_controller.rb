class RealtimePostController < FayeRails::Controller
  channel '/posts' do
    filter :in do
      if subscribing?
        pass
      elsif data[:post_key] == Post.post_key
        new_message = message.dup
        new_message['data'].delete :post_key
        modify new_message
      else
        drop
      end
    end
  end
end
