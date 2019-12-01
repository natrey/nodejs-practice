## Testing REST API requests
```
curl -X GET localhost:3000/users
```
```
curl -H "Content-Type: application/json" -d '{"displayName":"Nikita", "email":"test@mail.ru"}' -X POST localhost:3000/users
```
```
curl -X PATCH localhost:3000/users/5de36a9e9748320e53374b50
```
```
curl -X DELETE localhost:3000/users/100
```

