Rails.application.routes.draw do
  root "visitors#index"
  get 'visitors/index'
  resources :events
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
