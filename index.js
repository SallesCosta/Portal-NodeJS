const express = require('express');
const  bodyParser = require('body-parser');
const path = require('path');

const app = express();

app.use( bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use('/public',express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, '/pages'));


app.get('/',(req,res)=>{
    console.log(req.query)
    if(req.query.novapagina == null){
        res.render('home', {});
    }else{
        res.send('Você buscou: '+req.query.novapagina);
        /* http://localhost:5000/?novapagina=id3 */
    }
})

app.get('/:slug',(req,res)=>{
//Aula `Seu primeiro projeto NodeJS
    res.send(req.params.slug);  /* localhost:5000/pagina2    sera renderizado pagina2 no html*/
})

app.listen(5000,()=>{
    console.log('servidando FakanaKavera')
}) 