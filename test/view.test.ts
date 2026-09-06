import { describe, expect, test } from "bun:test";
import { skillCallView, skillResultView } from "../view.ts";

describe("skillCallView", () => {
	test("uses the skill name and collapses args", () => {
		expect(skillCallView({ skill: "test-driven-development", args: "focus\non  auth" })).toEqual({
			name: "test-driven-development",
			args: "focus on auth",
		});
	});

	test("strips a skill: prefix", () => {
		expect(skillCallView({ skill: "  skill:brainstorming  " }).name).toBe("brainstorming");
	});

	test("falls back to unknown when the name is empty", () => {
		expect(skillCallView({ skill: "   " }).name).toBe("unknown");
	});
});

describe("skillResultView", () => {
	test("builds a collapsed chip from details, not the tool-result dump", () => {
		const view = skillResultView(
			{
				content: [{ type: "text", text: "[Skill: brainstorming]\n\n# Brainstorm\n" }],
				details: {
					name: "brainstorming",
					path: "/home/leo/.omp/skills/brainstorming/SKILL.md",
					args: "auth",
					lineCount: 2,
					body: "# Brainstorm\nAsk one question.",
				},
			},
			"/home/leo",
		);
		expect(view).toEqual({
			kind: "chip",
			name: "brainstorming",
			args: "auth",
			path: "/home/leo/.omp/skills/brainstorming/SKILL.md",
			displayPath: "~/.omp/skills/brainstorming/SKILL.md",
			lineCount: 2,
			body: "# Brainstorm\nAsk one question.",
		});
	});

	test("surfaces errors instead of a chip", () => {
		const view = skillResultView({
			isError: true,
			content: [{ type: "text", text: "Unknown skill \"nope\"" }],
		});
		expect(view).toEqual({ kind: "error", text: 'Unknown skill "nope"' });
	});
});
