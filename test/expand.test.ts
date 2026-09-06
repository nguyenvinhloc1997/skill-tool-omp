import { describe, expect, test } from "bun:test";
import { expandSkillContent } from "../expand.ts";

const skill = {
	name: "brainstorming",
	filePath: "/s/brainstorming/SKILL.md",
	baseDir: "/s/brainstorming",
};

describe("expandSkillContent", () => {
	test("strips frontmatter and does not claim the user invoked the skill", () => {
		const text = expandSkillContent(
			skill,
			"---\nname: brainstorming\ndescription: x\n---\n\n# Brainstorm\nAsk one question.\n",
			"",
		);
		expect(text).toContain("[Skill: brainstorming]");
		expect(text).toContain("# Brainstorm");
		expect(text).toContain("Ask one question.");
		expect(text).toContain("[Skill directory: /s/brainstorming]");
		expect(text).not.toContain("User invoked");
		expect(text).not.toContain("name: brainstorming");
	});

	test("appends args when present", () => {
		const text = expandSkillContent(skill, "Body only.\n", "focus on auth");
		expect(text).toContain("Args: focus on auth");
	});

	test("omits the args line when empty", () => {
		const text = expandSkillContent(skill, "Body only.\n", "  ");
		expect(text).not.toContain("Args:");
	});
});
