Rails.application.routes.draw do
  devise_for :users
  root to: "pages#root"

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  namespace :api do
    resources :users do
      collection do
        post :login
        post :admin_login
        post :view
        post :review
      end
    end
    resources :applications
    resources :products
    resources :photos
    resources :brands
    resources :user_views
    resources :chains do
      collection do
        get :app_index
      end
    end
  end

  get '*path', to: "application#fallback_index_html", constraints: ->(request) do
    !request.xhr? && request.format.html?
  end
end
