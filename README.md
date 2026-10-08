# skill-tool-omp

Claude-compatible **Skill** tool for [Oh My Pi (OMP)](https://github.com/can1357/oh-my-pi).

OMP lists skills (name + description) and can inject a body via `/skill:<name>` or `read skill://<name>`. Ported Claude / Superpowers skills tell the model to call a `Skill` tool. That tool does not exist in stock OMP. This plugin adds it.

## What it does

- Registers an essential tool named `Skill` with `skill` (required) and `args` (optional).
- Looks up the live session catalog (`getActiveSkills()`).
- Returns the expanded `SKILL.md` body as the tool result (frontmatter stripped, skill directory attached).
- Renders a `/skill:`-style chip in the TUI (name, path, line count; body on expand). The model still gets the full body.
- Refuses `hide` / `disable-model-invocation` skills; those stay `/skill:<name>` only.
- Rewrites the catalog hint and the default Internal URLs glossary from “read `skill://<name>`” to “call the Skill tool first.” Sibling files stay `read skill://<name>/…`.

User `/skill:<name>` is unchanged. Display uses official tool renderers, not TUI patches.

## Install

```bash
omp plugin link /path/to/skill-tool-omp
# or:
omp plugin install github:nguyenvinhloc1997/skill-tool-omp
omp plugin list
```

Restart OMP after linking so the tool is in the session catalog.

To update a linked checkout, pull and restart OMP. For a git/npm install:

```bash
omp plugin upgrade skill-tool-omp
```

## Layout

```
package.json    # name + omp.extensions
index.ts        # registerTool + before_agent_start
lookup.ts       # name → skill
expand.ts       # SKILL.md → tool result
prompt.ts       # catalog hint rewrite
run.ts          # lookup + expand + missing-file errors
view.ts         # chip view-model
render.ts       # TUI chip (renderCall / renderResult)
```

No skills or agents. Those stay in `superpowers-omp` or project `.omp/skills/`.

## Develop

```bash
bun install
bun test
```

Dev-depends on `@oh-my-pi/pi-coding-agent` for types and tests. Runtime imports must use the package root (`@oh-my-pi/pi-coding-agent`, `@oh-my-pi/pi-tui`) so the compiled OMP host can rewrite them; deep subpaths fall through to a local `node_modules` copy and break (`Cannot find package '@oh-my-pi/pi-natives'`).

## License

MIT © 2026 nguyenvinhloc1997. See [LICENSE](LICENSE).
