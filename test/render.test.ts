import { beforeAll, describe, expect, test } from "bun:test";
import { initTheme, theme } from "@oh-my-pi/pi-coding-agent/modes/theme/theme";
import { renderSkillCall, renderSkillResult } from "../render.ts";

function painted(component: { render: (width: number) => string[] }): string {
	return Bun.stripANSI(component.render(80).join("\n"));
}

beforeAll(async () => {
	await initTheme(false);
});

describe("skill chip renderers", () => {
	test("call line is the native-style skill header", () => {
		const text = painted(renderSkillCall({ skill: "test-driven-development", args: "auth" }, { expanded: false }, theme));
		expect(text).toContain("skill");
		expect(text).toContain("test-driven-development");
		expect(text).toContain("auth");
		expect(text).not.toContain('skill="');
	});

	test("collapsed result hides the body dump", () => {
		const text = painted(
			renderSkillResult(
				{
					content: [{ type: "text", text: "[Skill: brainstorming]\n\n# Brainstorm\nAsk one question.\n" }],
					details: {
						name: "brainstorming",
						path: "/s/brainstorming/SKILL.md",
						lineCount: 2,
						body: "# Brainstorm\nAsk one question.",
					},
				},
				{ expanded: false },
				theme,
			),
		);
		expect(text).toContain("skill");
		expect(text).toContain("brainstorming");
		expect(text).toContain("2 lines");
		expect(text).toContain("/s/brainstorming/SKILL.md");
		expect(text).not.toContain("Ask one question");
		expect(text).not.toContain("[Skill: brainstorming]");
	});

	test("expanded result shows the skill body", () => {
		const text = painted(
			renderSkillResult(
				{
					content: [{ type: "text", text: "[Skill: brainstorming]\n\n# Brainstorm\n" }],
					details: {
						name: "brainstorming",
						path: "/s/brainstorming/SKILL.md",
						lineCount: 1,
						body: "# Brainstorm\nAsk one question.",
					},
				},
				{ expanded: true },
				theme,
			),
		);
		expect(text).toContain("Ask one question");
		expect(text).toContain("prompt");
	});
});
