import mongoose from 'mongoose';

const dbConnect = async () => {

  mongoose.set('strictQuery', false);
  mongoose.connect('mongodb://0.0.0.0:27017/constructionManagement', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // replicaSet: {} 
  })
  const db = mongoose.connection;
  db.once('open', () => {
    console.log('Connection Successful...');
  });
  db.on('error', console.error.bind(console, 'connection error.'));

};

export default dbConnect;