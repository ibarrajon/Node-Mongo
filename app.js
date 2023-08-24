//------------------SECTOR VARIABLES
const express = require('express'),
      app = express(),
      mongoose = require('mongoose'), //conexion entre el proyecto de node y mongodb
      passport = require('passport'), //permite definir estraegias de autenticación
      bodyParser = require('body-parser'), //asegurarse de que la info del body sea correcta
      localStrategy = require('passport-local'), //buscar los datos de manera local
      session = require('express-session'), //para la sesion del usuario (logueado, en linea, etc)
      user = require('./model/user.js'); //importamos el modelo del archivo creado, la "coleccion" 

//------------------CONECTING DATABSE
mongoose.connect('mongodb://localhost:27017/prueba'); //URL del mongo compass - despues de la barra creamos la base de datos

//------------------MOTOR DE PLANTILLAS
app.set('view engine','ejs');

//------------------TOMAR LA INFO DEL BODY
app.use(bodyParser.urlencoded({extended:true})); //validar la info del input

//------------------ARCHIVOS ESTATICOS
app.use(express.static('public'));

//------------------CONFIGURACION DEL PASSPORT
app.use(session(
    {
        secret: "Tuclave", //la clave creada por el usuario (caché)
        resave: true, //controla si se vuelve a guardar
        saveUninitialized: false //evita guardar sesiones vacias
    }
));

//------------------
app.use(passport.initialize()); //inicializa passport y podra trabajar con nuestra aplicacion 
app.use(passport.session()); //se encarga de que passport pueda acceder a las sesiones - para que no se desloguee

//------------------
passport.use(new localStrategy(user.authenticate())); //autenticar el usuario 

passport.serializeUser(user.serializeUser()); //toma la info del usuario y la almacena en algun lugar

passport.deserializeUser(user.deserializeUser());

//------------------RUTAS GET
app.get('/',(req,res)=>{
    res.render('pages/home')
});

app.get('/login',(req,res)=>{
    res.render('pages/login')
});

app.get('/register',(req,res)=>{
    res.render('pages/register')
});

app.get('/profile',(req,res)=>{
    if(req.isAuthenticated()){ //si existe la autenticacion, redirijo al perfil
        res.render('pages/profile')
    }else{ //sino lo redirijo al login
        res.redirect('/login')
    } 
});

//------------------RUTAS POST
app.post('/login',passport.authenticate("local",{ //usuario y clave se van a verificar localmente
    successRedirect: "/profile", //si todo sale bien despues de la autenticacion local, lo dirigimos al perfil
    failureRedirect: "/login" //si todo sale mal lo dirigimos al login nuevamente
}));

app.post('/register',(req,res)=>{
    user.register(new user({
        username: req.body.username,
        phone: req.body.phone,
        telephone: req.body.telephone
    }), req.body.password, function (err, user){
        if (err){
            console.log(err);
            return res.render("register") //si hay un error en la clave va a tener que volver a ingregarla
        }
            passport.authenticate("local")(req,res,function(){ //una vez que se registra lo dirigimos al logueo
            res.redirect("/login")
        })
    })
});

//------------------CONFIGURAR EL PUERTO
app.listen('3037',()=>{
    console.log("servidor en ejecucion")
});
