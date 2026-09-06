import { expandSkillContent, stripFrontmatter } from "./expand.ts";
import { resolveSkill, type SkillRef } from "./lookup.ts";

export type SkillToolParams = {
	skill: string;
	args?: string;
};

export type SkillToolDetails = {
	name: string;
	path: string;
	args?: string;
	lineCount: number;
	body: string;
};

export type SkillToolResult = {
	content: [{ type: "text"; text: string }];
	details?: SkillToolDetails;
	isError?: boolean;
};

export async function runSkillTool(
	params: SkillToolParams,
	skills: readonly SkillRef[],
	readFile: (path: string) => Promise<string>,
): Promise<SkillToolResult> {
	const resolved = resolveSkill(skills, params.skill);
	if (!resolved.ok) {
		return error(resolved.message);
	}

	try {
		const raw = await readFile(resolved.skill.filePath);
		const body = stripFrontmatter(raw);
		const args = params.args?.trim() || undefined;
		return {
			content: [{ type: "text", text: expandSkillContent(resolved.skill, raw, params.args ?? "") }],
			details: {
				name: resolved.skill.name,
				path: resolved.skill.filePath,
				...(args ? { args } : {}),
				lineCount: body ? body.split("\n").length : 0,
				body,
			},
		};
	} catch (cause) {
		const detail = cause instanceof Error ? cause.message : String(cause);
		return error(`Could not read skill "${resolved.skill.name}" at ${resolved.skill.filePath}: ${detail}`);
	}
}

function error(text: string): SkillToolResult {
	return { content: [{ type: "text", text }], isError: true };
}
