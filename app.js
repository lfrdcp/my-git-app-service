const express = require('express');
const simpleGit = require('simple-git');

const app = express();
const port = process.env.PORT || 3000;

app.get('/git-history-dev', (req, res) => {
  const git = simpleGit(); // Opcionalmente, puedes especificar la ruta de tu repositorio como argumento.

  git.log((err, log) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error al obtener el historial de Git.' });
    }

    res.json(log.all);
  });
});

app.get('/git-branches-dev', (req, res) => {
    const git = simpleGit(); // Opcionalmente, puedes especificar la ruta de tu repositorio como argumento.
  
    git.branch((err, branches) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error al obtener la lista de ramas de Git.' });
      }
  
      const branchList = branches.all.map((branch) => branch.replace('*', '').trim());
      res.json(branchList);
    });
  });
  
app.listen(port, () => {
  console.log(`Servidor backend en ejecución en el puerto ${port}`);
});
