# Media Manager
#### A Place to store and sort your shared media through SMB, works best with docker.

Check out this [repo](https://github.com/tinker-id/laravel-fpm-docker) for running this in docker, use Dockerfile.83.

> Run in docker, link your media file to storage/app/media folder, copy .env.example to .env, fill in the `SMB_HOST` and `SMB_PATH`, create file called database.sqlite in database folder. If you want, you can use MySQL or any other database that supported by Laravel.

#### Background:
So, I started making some video on youtube with davinci resolve. I frequently switch between my laptop and PC and store my media files in SMB Shared folder on my raspberry pi 4. I quickly found while working on more than 1 project I started to struggle finding the same footage I want to re-use from old project. So I built this app based on Laravel for easy development and deployment.

> Features:
- Search by title and tag
- Media info
- Click to copy share location (Make sure you fill in the `SMB_HOST` and `SMB_PATH` in .env)
