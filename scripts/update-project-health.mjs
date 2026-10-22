import { writeFile } from "node:fs/promises";

const owner = "AmilcarGit";
const repositories = [
  "AMILCAR-AI",
  "AmilcarTools",
  "YuiBot-MD",
  "S7-Bot-OFC",
  "BaseBot",
  "YuiBoost",
  "FamilyBot-MD1",
  "TheEly-MD",
  "yuianon"
];
const token = process.env.GITHUB_TOKEN;

async function api(path) {
  const response = await fetch(`https://api.github.com${path}`, {
    headers: {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  });
  if (!response.ok) {
    if (response.status === 404) return null;
    throw new Error(`GitHub API ${response.status} for ${path}`);
  }
  return response.json();
}

function yesNo(value) {
  return value ? "Sí" : "No";
}

function workflowStatus(run) {
  if (!run) return "Sin ejecución registrada";
  if (run.status !== "completed") return `En curso: ${run.status}`;
  return run.conclusion === "success"
    ? "Correcto"
    : `Revisar: ${run.conclusion || "sin conclusión"}`;
}

const rows = [];
for (const name of repositories) {
  const repo = await api(`/repos/${owner}/${name}`);
  if (!repo) {
    rows.push({ name, missing: true });
    continue;
  }

  const root = await api(`/repos/${owner}/${name}/contents?ref=${encodeURIComponent(repo.default_branch)}`);
  const entries = Array.isArray(root) ? root : [];
  const names = new Set(entries.map(entry => entry.name));
  const manifestEntry = entries.find(entry => entry.name === "package.json" && entry.type === "file");
  let hasTests = false;
  if (manifestEntry) {
    const manifest = await api(`/repos/${owner}/${name}/contents/package.json?ref=${encodeURIComponent(repo.default_branch)}`);
    if (manifest?.content) {
      try {
        const json = JSON.parse(Buffer.from(manifest.content, "base64").toString("utf8"));
        hasTests = Boolean(json.scripts && (json.scripts.test || json.scripts.check || json.scripts["check:local"] || json.scripts.smoke));
      } catch {}
    }
  }

  const workflowDir = await api(`/repos/${owner}/${name}/contents/.github/workflows?ref=${encodeURIComponent(repo.default_branch)}`);
  const workflowFiles = Array.isArray(workflowDir) ? workflowDir.filter(file => file.type === "file" && /\.(yml|yaml)$/i.test(file.name)) : [];
  let latestRun = null;
  if (workflowFiles.length) {
    const runs = await api(`/repos/${owner}/${name}/actions/runs?per_page=1`);
    latestRun = runs?.workflow_runs?.[0] || null;
  }

  rows.push({
    name,
    url: repo.html_url,
    branch: repo.default_branch,
    pushedAt: repo.pushed_at,
    readme: names.has("README.md") || names.has("readme.md"),
    license: Boolean(repo.license),
    manifest: Boolean(manifestEntry),
    hasTests,
    workflowFiles: workflowFiles.length,
    workflow: workflowStatus(latestRun),
    workflowUrl: latestRun?.html_url || `https://github.com/${owner}/${name}/actions`
  });
}

const date = new Date().toISOString().slice(0, 10);
const lines = [
  "# Panel de salud de proyectos",
  "",
  `Última actualización automática: **${date}**. Este informe consulta metadatos públicos de GitHub; no sustituye una revisión de código, una auditoría de seguridad ni la ejecución local de todas las pruebas.`,
  "",
  "## Resumen",
  "",
  "| Repositorio | README | Licencia detectada | package.json | Script de prueba/comprobación | Workflows | Último resultado de Actions | Última actividad (push) |",
  "|---|---:|---:|---:|---:|---:|---|---|"
];

for (const row of rows) {
  if (row.missing) {
    lines.push(`| [${row.name}](https://github.com/${owner}/${row.name}) | No encontrado | — | — | — | — | No disponible | — |`);
    continue;
  }
  const lastPush = row.pushedAt ? row.pushedAt.slice(0, 10) : "Sin dato";
  lines.push(`| [${row.name}](${row.url}) | ${yesNo(row.readme)} | ${yesNo(row.license)} | ${yesNo(row.manifest)} | ${row.manifest ? yesNo(row.hasTests) : "No aplica"} | ${row.workflowFiles} | [${row.workflow}](${row.workflowUrl}) | ${lastPush} |`);
}

lines.push(
  "",
  "## Cómo interpretar este panel",
  "",
  "- **Licencia detectada** usa los metadatos de licencia que informa GitHub; no valida legalmente su contenido.",
  "- **Script de prueba/comprobación** indica si el `package.json` declara al menos un script habitual de test o check; no significa que haya pasado.",
  "- **Workflows** cuenta archivos YAML bajo `.github/workflows`. El último resultado puede estar vacío si Actions no se ha ejecutado.",
  "- La última actividad es la fecha de último push reportada por GitHub, no una medida de calidad.",
  "",
  "## Enlaces de revisión",
  "",
  ...repositories.map(name => `- [${name}: Actions](https://github.com/${owner}/${name}/actions) · [Issues](https://github.com/${owner}/${name}/issues)`),
  "",
  "Este archivo se regenera semanalmente y se puede actualizar manualmente desde la pestaña Actions del repositorio de perfil.",
  ""
);

await writeFile("PROJECT_HEALTH.md", lines.join("\n"), "utf8");
