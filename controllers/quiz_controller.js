var models = require('../models/models.js');

// Autoload - factoriza el código si ruta incluye :quizId
exports.load = function(req, res, next, quizId){
  models.Quiz.find(quizId).then(
    function(quiz){
      if(quiz){
        req.quiz = quiz;
        next();
      } else {next(new Error('No existe quizId=' + quizId));}
    }
  ).catch(function(error){next(error);});
}

// GET/quizes
exports.index = function(req, res){
  // Si no viene parámetro searchText, hay que mostrarlas todas
  if(req.query.searchText === undefined){
    models.Quiz.findAll().then(
      function(quizes){
        res.render('quizes/index', {quizes: quizes, errors: []});
      }
    ).catch(function(error){next(error);})
  }
  // En otro caso, es decir, si viene parámetro searchText, se hace la búsqueda
  else
  {
    // se hace la búsqueda como nos indican en la tarea pedida, es decir, siguiendo
    // el formato findAll({where: ["pregunta like ?", search]}], delimitando search con el
    // comodín % antes y después, y cambiando los espacios por %. Además se usa la opción
    // order para que las entradas encontradas vengan ordenadas en orden ascendente.
    models.Quiz.findAll({where: ["pregunta like ?","%" + req.query.searchText.replace(" ","%") + "%"],
                                order:'pregunta ASC'}).then(function(quizes) {
      res.render('quizes/index', { quizes: quizes, errors: []});
   }).catch(function(error) { next(error); })
  }
};

// GET /quizes/:id
exports.show = function(req, res){
  res.render('quizes/show', {quiz: req.quiz, errors: []});
};

// GET /quizes/:id/answer
exports.answer = function(req, res){
  var resultado = 'Incorrecto';
  if(req.query.respuesta === req.quiz.respuesta){
    resultado = 'Correcto';
  }
  res.render('quizes/answer', {quiz: req.quiz,
                               respuesta: resultado,
                               errors: []});
};

// GET /quizes/new
exports.new = function(req, res){
  var quiz = models.Quiz.build( // crea objeto quiz
    {pregunta: "Pregunta", respuesta: "Respuesta"}
  );

  res.render('quizes/new', {quiz: quiz, errors: []});
}

// POST /quizes/create
exports.create = function(req, res){
  var quiz = models.Quiz.build(req.body.quiz);

  quiz.validate()
  .then(
    function(err){
      if(err){
        res.render('quizes/new', {quiz: quiz, errors: err.errors});
      } else {
        // guarda en BBDD los campos pregunta y respuesta de quiz
        quiz.save({fields: ["pregunta", "respuesta"]}).then(function(){
          res.redirect('/quizes');
        })    // Redirección HTTP (URL relativo) lista de preguntas
      }
    })
}
