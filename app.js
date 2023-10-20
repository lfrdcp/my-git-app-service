const express = require("express");
const simpleGit = require("simple-git");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;
// Habilitar CORS para todas las rutas
app.use(cors());

app.get("/git-history-dev-test", (req, res) => {
  const git = simpleGit(); // Opcionalmente, puedes especificar la ruta de tu repositorio como argumento.

  git.log(
    ["--graph", "--oneline", "--decorate", "--all", "--branches"],
    (err, log) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .json({ error: "Error al obtener el historial de Git." });
      }

      res.json(log.all);
    }
  );
});

app.get("/git-branches-dev-test", (req, res) => {
  const git = simpleGit(); // Opcionalmente, puedes especificar la ruta de tu repositorio como argumento.

  git.branch((err, branches) => {
    if (err) {
      console.error(err);
      return res
        .status(500)
        .json({ error: "Error al obtener la lista de ramas de Git." });
    }

    const branchList = branches.all.map((branch) =>
      branch.replace("*", "").trim()
    );
    res.json(branchList);
  });
});

app.get("/branch-commits", async (req, res) => {
  const branchName = req.query.branchName; // Obtén el nombre de la rama desde el parámetro de consulta.
  const git = simpleGit(); // Puedes especificar la ruta de tu repositorio aquí si es necesario.

  try {
    // Obtén los últimos 10 commits de la rama especificada.
    const commits = await git.log({
      from: `remotes/origin/${branchName}`,
    });

    // Obtén las ramas que contienen cada uno de esos commits.
    const branchInfo = await Promise.all(
      commits.all.map(async (commit) => {
        const commitHash = commit.hash;
        const branchInfo = await git.branch([
          "--contains",
          commitHash,
          branchName,
          commit,
        ]);
        return { branches: branchInfo.all, commit };
      })
    );

    res.json(branchInfo);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Error al obtener información de las ramas y commits." });
  }
});

app.listen(port, () => {
  console.log(`Servidor backend en ejecución en el puerto ${port}`);
});
