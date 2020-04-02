class PagesController < ApplicationController
  def root
    render :nothing => true, :status => 200
  end
end
