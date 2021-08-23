// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;



import mongoose from 'mongoose';
const { Schema } = mongoose


const postSchema = new Schema({
    titulo: String,
    imagem: String,
    categoria: String,
    conteudo: String,
    slug: String,
    autor: String,
    views: Number,
},{collection: 'posts'})//este postes é o nome da collection que criei no mongodb

var Posts = mongoose.model("Posts",postSchema);
export default Posts
// module.exports = Posts;