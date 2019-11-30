## Testing REST API requests

curl -H "Content-Type: application/json" --data '{"displayName":"Nikita", "email":"test@mail.ru"}' -X POST localhost:3000/users

curl -X GET localhost:3000/users
