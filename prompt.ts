const DEFAULT_HINT = "Matching skill → MUST read `skill://<name>` first.";
const CUSTOM_HINT = "If a skill applies, you MUST read `skill://<name>` before proceeding.";
const GLOSSARY_HINT = "- `skill://<name>`: instructions; `/<path>`: its file";

const DEFAULT_REPLACEMENT =
	"Matching skill → MUST call the Skill tool with that name first. After it loads, follow the body. Use `read skill://<name>/…` only for sibling files in the skill directory.";
const CUSTOM_REPLACEMENT =
	"If a skill applies, you MUST call the Skill tool with that name before proceeding.";
const GLOSSARY_REPLACEMENT =
	"- `skill://<name>`: use the Skill tool for the body; `/<path>`: sibling file via `read skill://<name>/…`";

export function rewriteSkillCatalogHint(chunks: string[]): string[] {
	return chunks.map(chunk =>
		chunk
			.replaceAll(DEFAULT_HINT, DEFAULT_REPLACEMENT)
			.replaceAll(CUSTOM_HINT, CUSTOM_REPLACEMENT)
			.replaceAll(GLOSSARY_HINT, GLOSSARY_REPLACEMENT),
	);
}
