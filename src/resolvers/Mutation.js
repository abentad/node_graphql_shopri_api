// const { finished } = require('stream/promises');
const { createWriteStream, unlink } = require('fs');
const path = require('path');

const Mutation = {
    async createUser(parent, { data }, { prisma }, info){
        return await prisma.users.create({ data });
    },
    singleUpload: async (parent, { file }) => {
        const { createReadStream, filename, mimetype, encoding } = await file;  
        const stream = createReadStream();
        const filelocation = path.join(__dirname, `/../images/${filename}`);
        await new Promise((resolve, reject) => {
            // Create a stream to which the upload will be written.
            const writeStream = createWriteStream(filelocation);
            // When the upload is fully written, resolve the promise.
            writeStream.on('finish', resolve);
            // If there's an error writing the file, remove the partially written file
            // and reject the promise.
            writeStream.on('error', (error) => {
              unlink(filelocation, () => {
                reject(error);
              });
            });
            // In Node.js <= v13, errors are not automatically propagated between piped
            // streams. If there is an error receiving the upload, destroy the write
            // stream with the corresponding error.
            stream.on('error', (error) => writeStream.destroy(error));
            // Pipe the upload into the write stream.
            stream.pipe(writeStream);
        });  
        return { filename, mimetype, encoding, filelocation };
    },
};

module.exports = Mutation;
