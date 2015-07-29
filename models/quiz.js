// Definición del modelo de Quiz

module.exports = function(sequelize, DataTypes){
  return sequelize.define(
    'Quiz',
    {pregunta: {
      type: DataTypes.STRING,
      validate: {notEmpty: {msg: "-> Falta Pregunta"},
                 notIn: {args: [['Pregunta','Respuesta']],
                         msg: "-> Falta Pregunta"}
                }
     },
     respuesta: {
      type: DataTypes.STRING,
      validate: {notEmpty: {msg: "-> Falta Respuesta"},
                 notIn: {args: [['Pregunta','Respuesta']],
                         msg: "-> Falta Respuesta"}
                }
     },
     categoria: {
      type: DataTypes.STRING,
      validate: {notEmpty: {msg: "-> Falta Categoria"}}
     }
    });
}
