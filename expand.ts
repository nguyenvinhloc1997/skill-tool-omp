import type { SkillRef } from "./lookup.ts";

const FRONTMATTER = /^---\n[\s\S]*?\n---\n/;

export function stripFrontmatter(raw: string): string {
	return raw.replace(FRONTMATTER, "").trim();
}

export function expandSkillContent(skill: SkillRef, raw: string, args: string): string {
	const body = stripFrontmatter(raw);
	const trimmedArgs = args.trim();
	const lines = [
		`[Skill: ${skill.name}]`,
		"",
		body,
		"",
		"---",
		`[Skill directory: ${skill.baseDir}]`,
		"Resolve relative paths in this skill against this directory (read skill://<name>/… or the absolute path).",
	];
	if (trimmedArgs) {
		lines.push(`Args: ${trimmedArgs}`);
	}
	return lines.join("\n");
}
