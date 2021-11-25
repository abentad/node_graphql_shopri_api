const Query = {
    async user(parent, { id }, { prisma }, info){
        const user = await prisma.users.findUnique({ where:{ id: Number(id) } });
        if(!user) throw new Error('User not found');
        return user;
    },
    async users(parent, args, { prisma }, info){
        const users = await prisma.users.findMany();
        return users;
    },
    async product(parent, { id }, { prisma }, info){
        const product = await prisma.products.findUnique({ where:{ id: Number(id) } });
        if(!product) throw new Error('Product not found');
        return product;
    },
    async products(parent, { page, take}, { prisma }, info){
        //TODO: Sort it
        const products = await prisma.products.findMany({ skip: page * take, take });
        return products;
    },
}

module.exports = Query;