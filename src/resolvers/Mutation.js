const { createWriteStream, unlink } = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const getUserId = require('../utils/getUserId');
const { hashPassword, comparePassword } = require('../utils/hashPassword');

const jwtSecret = 'somesecret';

const Mutation = {
    async createUser(parent, { data }, { prisma }, info){
        if(data.password.length < 8) throw new Error('Password length must be at least 8');
        data.password = await hashPassword(data.password);
        const user = await prisma.users.create({ data });
        const token = jwt.sign({ id: user.id }, jwtSecret);
        return { user, token };
    },
    async loginUser(parent, { data }, { prisma }, info){
        const user = await prisma.users.findUnique({ where:{ email: data.email } });
        if(!user) throw new Error('Email doesn\'t exist');
        const isMatch = await comparePassword(data.password, user.password);
        if(!isMatch) throw new Error('Incorrect password');
        const token = jwt.sign({ id: user.id }, jwtSecret);
        return { user, token };
    },
    async updateUser(parent, { data }, { prisma, req }, info){
        const userId = getUserId(req);
        const user = await prisma.users.findUnique({ where: { id: Number(userId) } });
        if(!user) throw new Error('User not found');
        if(data.password) data.password = await hashPassword(data.password);
        const updatedUser = await prisma.users.update({ where: { id: Number(userId) }, data });
        return updatedUser;
    },
    async createProduct(parent, { data }, { prisma, req }, info){
        const userId = getUserId(req);
        const product = await prisma.products.create({ data: {...data, posterId: userId} });
        return product;
    },
    singleUpload: async (parent, { file }) => {
        const { createReadStream, filename, mimetype, encoding } = await file;  
        const stream = createReadStream();
        const filelocation = path.join(__dirname, `/../images/${filename}`);
        await new Promise((resolve, reject) => {
            const writeStream = createWriteStream(filelocation);
            writeStream.on('finish', resolve);
            writeStream.on('error', (error) => {
              unlink(filelocation, () => {
                reject(error);
              });
            });
            stream.on('error', (error) => writeStream.destroy(error));
            stream.pipe(writeStream);
        });  
        return { filename, mimetype, encoding, filelocation };
    },
};

module.exports = Mutation;
