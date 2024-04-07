var express = require('express')
var app = express()

const fs = require('fs').promises;
const USERS_FILE_PATH = 'users.json';
const APPS_FILE_PATH = 'apps.json';

app.use(express.urlencoded({ extended: true}))
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); 
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

let users = []; 
let apps = [];
loadUsersFromFile()
loadAppsFromFile()

async function loadUsersFromFile() {
  try {
    const data = await fs.readFile(USERS_FILE_PATH);
    users = JSON.parse(data); 
    console.log('Usuários carregados do arquivo.');
  } catch (error) {
    console.error('Erro ao carregar usuários do arquivo:', error);
  }
}

async function loadAppsFromFile() {
  try {
   const data = await fs.readFile(APPS_FILE_PATH);
   apps = JSON.parse(data)
   console.log('Aplicativos carregados no do arquivo')
  } catch (error) {
    console.error('Erro ao carregar apps do arquivo\n', error)
   }
}


async function saveUsersToFile() {
  try {
    await fs.writeFile(USERS_FILE_PATH, JSON.stringify(users, null, 2));
    console.log('Usuários salvos no arquivo.');
  } catch (error) {
    console.error('Erro ao salvar usuários no arquivo:', error);
  }
}

async function saveAppsToFile() {
   try{
     await fs.writeFile(APPS_FILE_PATH, JSON.stringify(apps, null, 2))
     console.log('Aplicativos  salvos no arquivo.')
     } catch (error) {
     console.error('Erro ao salvar apps no arquivo: ', error)
   }
}

app.post('/newuser', async (req, res) => {
  const newUser = req.body;
  const userId = newUser.uid; // 
  users.PiotAccounts = users.PiotAccounts || {};
  users.PiotAccounts[userId] = {
    name: newUser.name,
    email: newUser.email,
    password: newUser.password,
    profile_icon: newUser.profile_icon,
    uid: newUser.uid,
    dateBirth: newUser.dateBirth
  };
  await saveUsersToFile();
  res.status(201).json(newUser);
});

app.post('/newapp', async (req, res) => {
  const newApp = req.body;
  const appID = newApp.appUid; // 
  apps.Apps = apps.Apps || {};
  apps.Apps[appUid] = {
    appName: newApp.appName,
    appPackage: newApp.appPackage,
    appUid: newApp.appUid,
    appURL: newApp.appURL,
    appOnwer: newApp.appOnwer
  };
  await saveAppsToFile();
  res.status(201).json(newApp);
});

app.get('/user/:uid', (req, res) =>{
  const userId = req.params.uid;
  const user = users.PiotAccounts[userId];
  if (user) {
     res.status(200).json(user);
  } else {
    res.status(404).send('<b>Piot User</b> not found');
  }
});


app.get('/app/:uid', (req, res) =>{
  const appUID = req.params.uid;
  const appData = apps.Apps[appID];
  if (appData) {
     res.status(200).json(appData);
  } else {
    res.status(404).send('<b>Piot User</b> not found');
  }
});


app.get('/', function (req, res){
  var data = {
    "message": "Hello World"
  }
  res.send(data)
})

app.get('/users', function (req, res){
  res.json(users)
})

app.get('/apps', function (req, res){
  res.json(apps)
})

app.delete('/user/:uid', (req, res) =>{
  const userId = req.params.uid;
  delete users.PiotAccounts[userId];
  saveUsersToFile();
  res.status(200).send('User deleted successfully');
});

app.listen(3000, function (){
  console.log('Piot Account is running')
})