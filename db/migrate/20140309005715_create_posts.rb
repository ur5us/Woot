class CreatePosts < ActiveRecord::Migration
  def change
    create_table :posts do |t|
      t.string :nickname
      t.string :body

      t.timestamps
    end
  end
end
