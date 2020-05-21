class ApplicationSerializer
  include FastJsonapi::ObjectSerializer
  attributes :id, :name
end
