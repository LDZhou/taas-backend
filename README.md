<h1 align="center"><strong>TaaS Backend</strong></h1>

<br />

![](https://cdn-images-1.medium.com/max/2400/1*gFUhAMO2Ab0MufSyq0BGjw.jpeg)

<div align="center"><strong>TaaS Backend is powered by Ruby on Rails + PostgreSQL</strong></div>

## Requirements

- You need to have [Ruby on Rails](http://installrails.com) and [PostgreSQL Database](https://www.postgresql.org/download) installed:
- Other globally installed modules that are useful on Ubuntu or MacOS: Homebrew

* Ruby version
2.4.5
* Rails version
5.1.6.1
* PostgreSQL version
9.4.18

* Database creation
```
$ psql -p5432
silujia=# CREATE USER taasadmin WITH PASSWORD 'taaspassword';
silujia=# ALTER USER taasadmin WITH SUPERUSER;
silujia=# CREATE DATABASE taas_development;
silujia=# CREATE DATABASE taas_test;
silujia=# GRANT ALL PRIVILEGES ON DATABASE taas_development to taasadmin;
silujia=# GRANT ALL PRIVILEGES ON DATABASE taas_test to taasadmin;
silujia=# ALTER DATABASE taas_development OWNER TO taasadmin;
silujia=# ALTER DATABASE taas_test OWNER TO taasadmin;
silujia=# \q

```
* Project Initiation
```
# Run migrations under project folder
$ bundle exec rake db:migrate

# Start Rails server
$ bundle exec rails s

```
* Deployment instructions

- We use [Heroku](https://www.heroku.com/) for deployment.  
- You need to install [Git CLI](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) and [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli#download-and-install).
```
# Add project to git config
$ heroku git:remote -a taas-backend
$ git checkout master

# Deploy to Heroku
$ git push heroku master

# Run migrations on Heroku
$ heroku run rake db:migrate
```
- Follow this [instruction](https://devcenter.heroku.com/articles/git) for more details.

* Other useful Heroku commands：

```
# Run Rails console on the server
$ heroku run rails console    

# Restart the server
$ heroku restart

# Show server logs
$ heroku logs -t

# Show server configurations
$ heroku config 
```
* Rails console tutorial
```
# Ex. Update a price for a property
# Run a rails console on heroku server
$ heroku run rails console

# 123 is the ID of the property
p = Property.find 123 

# 1234 is the new price
p.price = 1234

# save the data, which will trigger a UPDATE in SQL to update the record in the database
p.save
```
- Follow this [instruction](https://guides.rubyonrails.org/active_record_basics.html) for more info.


## Project structure

![](https://res.cloudinary.com/hyyxofhbh/image/upload/v1561270328/tripalink/assets/tripalink-folders.png)

| File name 　　　　　　　　　　　　　　| Description 　　　　　　　　<br><br>|
| :--  | :--         |
| `├── .env` | Defines environment variables |
| `├── Procfile` | Heroku deployment config file|
| `└── app ` (_directory_) | _Contains all files that are related to the Ruby on Rails server_ |\
| `　　├── controllers ` (_directory_) | _Contains all the API endpoints_ |
| `　　└── models` (_directory_) | _Contains all the models_ |
| `　　└── uploaders` (_directory_) | _Contains photo uploader_ |
