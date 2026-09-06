# skill-tool-omp

Claude-compatible **Skill** tool for [Oh My Pi (OMP)](https://github.com/can1357/oh-my-pi).

OMP already lists skills (name + description) and can inject a body via `/skill:<name>` or `read skill://<name>`. Ported Claude / Superpowers skills tell the model to call a `Skill` tool. That tool does not exist in OMP. This plugin adds it.

The factory is a stub until the tool is implemented. Link it now so the plugin is in your set; restart OMP after the tool lands.

## Install

This repo **is** the plugin:

```bash
omp plugin link /path/to/skill-tool-omp
# later:
omp plugin install github:nguyenvinhloc1997/skill-tool-omp
omp plugin list
```

To update a linked checkout, pull and restart OMP. For a git/npm install:

```bash
omp plugin upgrade skill-tool-omp
```

## Layout

```
package.json    # name + omp.extensions
index.ts        # extension factory
```

No skills or agents. Those stay in `superpowers-omp` or project `.omp/skills/`.

## License

MIT © 2026 nguyenvinhloc1997. See [LICENSE](LICENSE).
