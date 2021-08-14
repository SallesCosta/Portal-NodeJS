// yarn add express ejs mongoose    
const express = require('express');
const mongoose = require('mongoose');
var bodyParser = require('body-parser')

const path = require('path');

const app = express();

const Posts = require('./Posts.js');

const mdpDB = 'sgiNHFdvvO5FmZz7';
const nomeDB = 'node';

mongoose.connect('mongodb+srv://root:' + mdpDB + '@cluster0.wkubl.mongodb.net/' + nomeDB + '?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
    })
    .then(()=> {
    console.log('Conectado com DB');
}).catch((err)=> {
    console.log(err.message);
})

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use('/public', express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, '/pages'));

app.get('/', (req, res) => {
    if (req.query.busca == null) {
        Posts.find({}).sort({ '_id': -1 }).exec((err, posts)=> {
        posts = posts.map((val)=> {
                return {
                    titulo: val.titulo,
                    conteudo: val.conteudo,
                    descricaoCurta: val.conteudo.substr(0, 100),
                    imagem: val.imagem,
                    slug: val.slug,
                    categoria: val.categoria
                }
            })
            Posts.find({}).sort({ 'views': -1 }).limit(3).exec((err, postsTop)=> {
                 console.log(posts[0]);
                postsTop = postsTop.map((val)=> {
                    return {
                        titulo: val.titulo,
                        conteudo: val.conteudo,
                        descricaoCurta: val.conteudo.substr(0, 100),
                        imagem: val.imagem,
                        slug: val.slug,
                        categoria: val.categoria,
                        views: val.views
                    }
                })
                res.render('home', { posts: posts, postsTop: postsTop });
            }) 
        })
    } else {
        Posts.find({ titulo: { $regex: req.query.busca, $options: "i" } }, function (err, posts) {
            console.log(posts);
            posts = posts.map(function (val) {
                return {
                    titulo: val.titulo,
                    conteudo: val.conteudo,
                    descricaoCurta: val.conteudo.substr(0, 100),
                    imagem: val.imagem,
                    slug: val.slug,
                    categoria: val.categoria,
                    views: val.views
                }
            })
            res.render('busca', { posts: posts, contagem: posts.length });
        })
    }
});

app.get('/:slug', (req, res) => {
    //res.send(req.params.slug);
    Posts.findOneAndUpdate({ slug: req.params.slug }, { $inc: { views: 1 } }, { new: true }, function (err, resposta) {
        // console.log(resposta);
        if (resposta != null) {
            Posts.find({}).sort({ 'views': -1 }).limit(3).exec(function (err, postsTop) {
                // console.log(posts[0])
                postsTop = postsTop.map((val)=> {
                    return {
                        titulo: val.titulo,
                        conteudo: val.conteudo,
                        descricaoCurta: val.conteudo.substr(0, 100),
                        imagem: val.imagem,
                        slug: val.slug,
                        categoria: val.categoria,
                        views: val.views
                    }
                })
                res.render('single', { noticia: resposta, postsTop: postsTop });
            })
        } else {
            res.redirect('/');
        }
    })
})
const porta = 5000;
app.listen(porta, () => {
    console.log('server rodando!');
    console.log('http://localhost:'+porta);
})