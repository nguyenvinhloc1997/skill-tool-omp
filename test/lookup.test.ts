import { describe, expect, test } from "bun:test";
import { resolveSkill, type SkillRef } from "../lookup.ts";

const skills: SkillRef[] = [
	{ name: "brainstorming", filePath: "/s/brainstorming/SKILL.md", baseDir: "/s/brainstorming" },
	{
		name: "secret",
		filePath: "/s/secret/SKILL.md",
		baseDir: "/s/secret",
		hide: true,
	},
];

describe("resolveSkill", () => {
	test("finds an exact name", () => {
		const result = resolveSkill(skills, "brainstorming");
		expect(result.ok).toBe(true);
		if (result.ok) expect(result.skill.name).toBe("brainstorming");
	});

	test("strips a skill: prefix and whitespace", () => {
		const result = resolveSkill(skills, "  skill:brainstorming  ");
		expect(result.ok).toBe(true);
		if (result.ok) expect(result.skill.name).toBe("brainstorming");
	});

	test("rejects an empty name", () => {
		const result = resolveSkill(skills, "   ");
		expect(result.ok).toBe(false);
		if (!result.ok) expect(result.reason).toBe("invalid");
	});

	test("rejects an unknown name and lists invocable skills", () => {
		const result = resolveSkill(skills, "nope");
		expect(result.ok).toBe(false);
		if (!result.ok) {
			expect(result.reason).toBe("unknown");
			expect(result.message).toContain("brainstorming");
			expect(result.message).not.toContain("secret");
		}
	});

	test("rejects a hidden skill", () => {
		const result = resolveSkill(skills, "secret");
		expect(result.ok).toBe(false);
		if (!result.ok) {
			expect(result.reason).toBe("hidden");
			expect(result.message).toContain("/skill:secret");
		}
	});
});
