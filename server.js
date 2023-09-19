const http = require('http');
const nodegit = require('nodegit');

const port = 3000;

const server = http.createServer(async (req, res) => {
  if (req.method === 'GET' && req.url === '/commits') {
    try {
      const repo = await nodegit.Repository.open('https://github.com/lfrdcp/my-git-app-service.git'); // Reemplaza con la ruta a tu repositorio Git

      const commits = await repo.getMasterCommit(); // Cambia 'master' por la rama que desees
      const history = commits.history(nodegit.Revwalk.SORT.Time);

      const commitList = [];

      history.on('commit', (commit) => {
        commitList.push({
          hash: commit.sha(),
          message: commit.message(),
          author: commit.author().name(),
          date: commit.date(),
        });
      });

      history.on('end', () => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(commitList));
      });

      history.start();
    } catch (error) {
      console.error('Error:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Error al obtener el historial de commits' }));
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Ruta no encontrada');
  }
});

server.listen(port, () => {
  console.log(`Servidor Node.js escuchando en el puerto ${port}`);
});
