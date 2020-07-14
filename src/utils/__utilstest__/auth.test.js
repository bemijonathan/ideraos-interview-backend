import *as auth from '../auth'
import jwt from 'jsonwebtoken'

const user = {
    id:"owr345ee",
    email:"john@g.com",
    password:"324ewwrhfverjhwe345"
}

test("generate auth token", () => {
    const token = auth.newToken(user)
    expect(user.id).toBe(jwt.decode(token).id)
})