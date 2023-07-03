# Link Memo
## Introduction

This API provides functionalities for recording and summarizing blog articles, generating short URLs and QR codes for easy sharing. Includes user authentication with login and register capabilities, allowing users to update personal and article information, can explore articles shared by others, follow users, and save articles. Additionally, features for password reset and user deactivation offer flexibility in user management.

***

## Features
* Provides user registration and login functionality
* Ability to update and deactivate user status
* Records blog article URLs and generates corresponding short URLs and QR codes
* Automatically generates AI summaries
* Allows manual addition of notes
* Categorizes articles using custom or default tags
* Browses articles and content saved by other users
* Follows other users and bookmarks articles of interest
  
***

## API documents

***

## Installation

```
# Clone this repository
$ git clone https://github.com/Noelle-KH/link-memo.git

# Confirmed the terminal is at the project
cd link-memo

# Project setup & Install nodemon
$ npm install

# Set environment variables in .env file according to .env.example
touch .env

# Create default tags
$ npm run seed

# Start the server
npm run dev

# Execute successfully if seeing following message
Server running on 8000

# To stop the project
ctrl + c
```

***

## Prerequisites
* node.js
* express
* mongoose
* http-errors
* validator
* cloudinary
* nodemailer
* multer