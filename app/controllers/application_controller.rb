class ApplicationController < ActionController::Base
	protect_from_forgery

  def render_admin
    render file: 'public/admin/index.html', layout: false
  end

  def fallback_index_html
    render :file => 'public/index.html', layout: false
  end
end
