const Query = {
    async user(parent, { id }, { prisma }, info){
        const user = await prisma.users.findUnique({
            where:{
                id: Number(id)
            }
        });
        if(!user) throw new Error('User not found');
        return user;
    },
    async users(parent, args, { prisma }, info){
        const users = await prisma.users.findMany();
        return users;
    },
    async product(parent, { id }, { prisma }, info){
        const product = await prisma.products.findUnique({
            where:{
                id: Number(id)
            }
        });
        if(!product) throw new Error('Product not found');
        return product;
    },
    async products(parent, args, { prisma }, info){
        //TODO: paginate this query
        const products = await prisma.products.findMany();
        return products;
    },
}

module.exports = Query;