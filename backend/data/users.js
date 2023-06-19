import bcrypt from 'bcryptjs'


const users = [
    {
        name: 'Admin User',
        email: 'admin@example.com',
        password: bcrypt.hashSync('123456', 10),
        isAdmin: true,
    },
    {
        name: 'Ritik Baisla',
        email: 'ritik@example.com',
        password: bcrypt.hashSync('123456', 10),
    },
    {
        name: 'Pushpi',
        email: 'pushpi@example.com',
        password: bcrypt.hashSync('123456', 10),
    },
]

export default users
