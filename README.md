# Teamwork
Teamwork is an internal social network for employees of an organization. The goal of this application is to facilitate more interaction between colleagues and promote team bonding.

# Projects setup 
```
npm install
```
Rename the `/.env.example` to `/.env`,
then edit the `/.env` file to configure your DB credentials

## Run 
npm run start

| Method | Endpoint           | Description                    |
| -------|:------------------:|:-------------------------------|
| GET    | /api/v1/users      | To get details of all users    |
| POST   | /api/v1/users      | To create a new user           |
| POST   | /api/v1/auth/login | To login an Admin/Employee     |

## Deployment
The app was deployed to render