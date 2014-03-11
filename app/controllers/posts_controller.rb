# Just ensure that our RT controller is ready.
RealtimePostController

class PostsController < ApplicationController
  respond_to :json

  def index
    respond_with Post.order('created_at DESC').limit(30)
  end

  def create
    respond_with Post.create(post_create_params)
  end

  def show
    respond_with Post.find(params[:id])
  end

  private

  def post_create_params
    params.require(:post).permit(:nickname, :body)
  end
end
