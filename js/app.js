var app = new Framework7({
    // App root element
    root: '#app',
    // App Name
    name: 'Meu primeiro App',
    // App id
    id: 'gmail.com@marciolourens',
    // Enable swipe panel
    panel: {
      swipe: 'left',
    },
    // Add default routes
    routes: [
      {
        path: '/home/',
        url: 'index.html',
      },
      {
        path: '/cadastro/',
        url: 'cadastro.html',
        on:{
          pageInit:function(){
            pageCadastro();
          },
        },
      },
    ],
    // ... other parameters
  });

//Vamos criar uma variavel global para criar as Visões
var mainView = app.views.create('.view-main');

// Criando Banco de dados
if(window.openDatabase){
  // Criando banco de dados
  db = openDatabase("DB_CADASTROS","0.1","Base de dados local", 5*1021*1024);

  // Criando tabela tarefas
  db.transaction(function(query){
    query.executeSql("CREATE TABLE IF NOT EXISTS cadastro (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT, email TEXT, usuario TEXT, senha TEXT)");
  });
}

// Inicianco Javascript do cadastro
function pageCadastro(){
  
    $(document).ready(function(){
      $('#capturar').on('click',cameraApp);

      function cameraApp(){
          navigator.camera.getPicture(onSuccess, onFail,{
              quality:100,
              destinationType:Camera.DestinationType.FILE_URI,
              saveToPhotoAlbum:true,  // bolean
              sourceType:Camera.PictureSourceType.CAMERA,
              mediaType:Camera.MediaType.PICTURE,	
              encodingType:Camera.EncodingType.JPEG,
              targetWidth:300,
              targetHeight:300,
              allowEdit:true,
          });
      }
      
      function onSuccess(imgURI) {
          $('#imagem').attr('src',imgURI);
      }
      
      function onFail(message) {
          alert('Erro ao capturar a imagem: ' + message);
      }
      // Fim Capturar Foto

        $('#galeria').on('click',galeria);
  
        function galeria(){
            navigator.camera.getPicture(onSuccess, onFail,{
                quality:100,
                destinationType:Camera.DestinationType.FILE_URI,
                sourceType:Camera.PictureSourceType.PHOTOLIBRARY,
                mediaType:Camera.MediaType.PICTURE,	
                targetWidth:300,
                targetHeight:300,
                allowEdit:true,
            });
        }
        
        function onSuccess(imgURI) {
            $('#imagem').attr('src',imgURI);
        }
        
        function onFail(message) {
            alert('Erro ao capturar a imagem: ' + message);
        }

        $("#gravar").click(function(){

          var nome = $("#nome").val();
          var email = $("#email").val();
          var usuario = $("#usuario_c").val();
          var senha = $("#senha_c").val();

          if(nome.length < 5 || nome.trim() == ""){
            app.dialog.alert("Preencha com nome e sobrenome","AVISO");
            return false;
          }
          if(email.length < 5 || email.length > 40 || email.trim() == ""){
            app.dialog.alert("Preencha o email corretamente","AVISO");
            return false;
          }
          if(usuario.length < 3 || usuario.length > 12 || usuario.trim() == ""){
            app.dialog.alert("Preencha usuário corretamente","AVISO");
            return false;
          }
          if(senha.length < 6 || senha.length > 12 || senha.trim() == ""){
            app.dialog.alert("Preencha a senha corretamente (min:6 | max:12 caracteres)","AVISO");
            return false;
          }
    
          var notification = app.notification.create({
            title:'Cadastro',
            text:'Cadastro realizado com sucesso.',
            closeTimeout:3000,
          });

          // Inserindo as informações no banco
          db.transaction(function(query){
            query.executeSql("INSERT INTO cadastro (nome,email,usuario,senha) VALUES (?,?,?,?)",[nome,email,usuario,senha]);
            notification.open();
            $("#nome").val("");
            $("#email").val("");
            $("#usuario_c").val("");
            $("#senha_c").val("");
          });
          
        });

  });// Fim da função ready
  
} // Fim pageCadastro

// Login
$(document).ready(function(){
  $("#entrar").click(function(){
    var usuario_login = $("#usuario_l").val();
    var senha_login = $("#senha_l").val();
    db.transaction(function(query){
      query.executeSql("SELECT usuario,senha FROM cadastro WHERE usuario=? and senha=?",[usuario_login,senha_login],
      function(query,result){
        rows = result.rows;
        dados = (rows.length);
        if(dados > 0){
          app.dialog.alert("Bem vindo "+usuario_login);
        }else{
          app.dialog.alert("Usuário e(ou) senha incorretos.","AVISO");
        }
      });
    });
  });
});







