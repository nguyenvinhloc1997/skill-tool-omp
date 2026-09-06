import { describe, expect, test } from "bun:test";
import type { SkillRef } from "../lookup.ts";
import { runSkillTool } from "../run.ts";

const skills: SkillRef[] = [
	{ name: "brainstorming", filePath: "/s/brainstorming/SKILL.md", baseDir: "/s/brainstorming" },
	{ name: "secret", filePath: "/s/secret/SKILL.md", baseDir: "/s/secret", hide: true },
];

const files: Record<string, string> = {
	"/s/brainstorming/SKILL.md": "---\nname: brainstorming\n---\n\n# Brainstorm\nAsk one question.\n",
};

async function readFile(path: string): Promise<string> {
	const text = files[path];
	if (text === undefined) throw new Error(`ENOENT: ${path}`);
	return text;
}

describe("runSkillTool", () => {
	test("expands a known skill as a tool result", async () => {
		const result = await runSkillTool({ skill: "brainstorming", args: "auth" }, skills, readFile);
		expect(result.isError).toBeUndefined();
		expect(result.content[0]?.text).toContain("[Skill: brainstorming]");
		expect(result.content[0]?.text).toContain("# Brainstorm");
		expect(result.content[0]?.text).toContain("Args: auth");
		expect(result.content[0]?.text).not.toContain("User invoked");
		expect(result.details).toEqual({
			name: "brainstorming",
			path: "/s/brainstorming/SKILL.md",
			args: "auth",
			lineCount: 2,
			body: "# Brainstorm\nAsk one question.",
		});
	});

	test("returns an error for an unknown skill", async () => {
		const result = await runSkillTool({ skill: "nope" }, skills, readFile);
		expect(result.isError).toBe(true);
		expect(result.content[0]?.text).toContain("Unknown skill");
		expect(result.content[0]?.text).toContain("brainstorming");
	});

	test("returns an error for a hidden skill", async () => {
		const result = await runSkillTool({ skill: "secret" }, skills, readFile);
		expect(result.isError).toBe(true);
		expect(result.content[0]?.text).toContain("/skill:secret");
	});

	test("returns an error when the skill file is missing", async () => {
		const missing: SkillRef[] = [
			{ name: "ghost", filePath: "/missing/SKILL.md", baseDir: "/missing" },
		];
		const result = await runSkillTool({ skill: "ghost" }, missing, readFile);
		expect(result.isError).toBe(true);
		expect(result.content[0]?.text).toContain("ghost");
		expect(result.content[0]?.text).toMatch(/missing|ENOENT|not found/i);
	});
});
