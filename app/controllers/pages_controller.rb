class PagesController < ApplicationController
  def root
    render file: 'public/index.html'
  end
end
