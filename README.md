# MIXD Blog

# DEMO

[Demo](https://mixd-blog.herokuapp.com/)

# How to use

1. Clone this repository
``` 
https://github.com/mountblue/mbc-js-16-1-blog-Thushar12E45.git
```
2. Install the dependencies
``` 
npm install 
```
3. Crreate a .env file for the data-base connection in the following format
```
DATABASE_URL= 'postgresql://user:password@localhost:5432/blog?schema=public'
```
4. Run the server
``` 
npm run dev
```

# Features

- A user after login can create,edit, and delete his posts.
- Search articles by keyword, or by author.
- Sort by date.
- Role Based Access Control (RBAC)
  - A user with role 'ADMIN' can edit,delete anyone's post. He can change the author of any post.
  - Admin can change role of any user.
  - A user with role 'EDITOR' can edit anyone's post but can delete only his posts.
  - A user with role 'AUTHOR' can edit or delete only his posts.


# Technologies Used
- HTML
- CSS
- Express Js
- Node Js
- Postgres Data Base