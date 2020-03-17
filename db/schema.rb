# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20200317064648) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "brands", force: :cascade do |t|
    t.string "brand_type"
    t.string "name"
    t.string "address"
    t.string "contact_name"
    t.string "contact_title"
    t.string "contact_phone"
    t.string "contact_email"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "user_id"
  end

  create_table "chain_products", force: :cascade do |t|
    t.integer "chain_id"
    t.integer "product_id"
    t.integer "index", default: 1
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["chain_id"], name: "index_chain_products_on_chain_id"
    t.index ["product_id"], name: "index_chain_products_on_product_id"
  end

  create_table "chains", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "photos", force: :cascade do |t|
    t.integer "target_id"
    t.string "target_type"
    t.string "name"
    t.string "file"
    t.string "photo_type"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "products", force: :cascade do |t|
    t.integer "brand_id"
    t.float "wastage_percent"
    t.float "additive_percent"
    t.string "name"
    t.string "model"
    t.string "size"
    t.float "weight"
    t.integer "quantity"
    t.string "material"
    t.string "material_percent"
    t.datetime "send_date"
    t.datetime "deliver_date"
    t.string "pkg_name"
    t.integer "pkg_quantity"
    t.string "sender_name"
    t.string "sender_address"
    t.string "receiver_name"
    t.string "receiver_address"
    t.string "shipping_company"
    t.string "shipping_no"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["brand_id"], name: "index_products_on_brand_id"
  end

  create_table "user_views", force: :cascade do |t|
    t.integer "user_id"
    t.integer "target_id"
    t.string "target_type"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.float "latitude"
    t.float "longitude"
    t.string "address"
    t.string "city"
    t.string "province"
    t.string "district"
    t.string "street"
    t.string "street_no"
    t.index ["target_type", "target_id"], name: "index_user_views_on_target_type_and_target_id"
    t.index ["user_id"], name: "index_user_views_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "nickname"
    t.integer "gender"
    t.string "city"
    t.string "slug"
    t.boolean "admin"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer "sign_in_count", default: 0, null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.inet "current_sign_in_ip"
    t.inet "last_sign_in_ip"
    t.string "openid"
    t.string "authentication_token"
    t.index ["authentication_token"], name: "index_users_on_authentication_token"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
    t.index ["slug"], name: "index_users_on_slug"
  end

end
