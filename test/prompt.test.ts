import { describe, expect, test } from "bun:test";
import { rewriteSkillCatalogHint } from "../prompt.ts";

describe("rewriteSkillCatalogHint", () => {
	test("points the catalog line at the Skill tool", () => {
		const chunks = [
			"Matching skill → MUST read `skill://<name>` first.\n<skills>\n- brainstorming: plan\n</skills>\n",
		];
		const out = rewriteSkillCatalogHint(chunks);
		expect(out[0]).toContain("MUST call the Skill tool");
		expect(out[0]).not.toContain("MUST read `skill://<name>` first");
		expect(out[0]).toContain("skill://<name>/");
	});

	test("rewrites the custom-prompt catalog line", () => {
		const chunks = ["If a skill applies, you MUST read `skill://<name>` before proceeding.\n"];
		const out = rewriteSkillCatalogHint(chunks);
		expect(out[0]).toContain("MUST call the Skill tool");
		expect(out[0]).not.toContain("MUST read `skill://<name>` before proceeding");
	});

	test("rewrites the Internal URLs glossary so bare skill:// is not the load path", () => {
		const chunks = [
			"# Internal URLs\n- `skill://<name>`: instructions; `/<path>`: its file\n- `rule://<name>`: details\n",
			"# Personality\npragmatic\n",
		];
		const out = rewriteSkillCatalogHint(chunks);
		expect(out[0]).toContain("Skill tool");
		expect(out[0]).not.toContain("`skill://<name>`: instructions");
		expect(out[0]).toContain("skill://<name>/");
		expect(out[0]).toContain("`rule://<name>`: details");
		expect(out[1]).toBe(chunks[1]);
	});

	test("leaves unrelated chunks unchanged", () => {
		const chunks = ["# Personality\npragmatic\n"];
		expect(rewriteSkillCatalogHint(chunks)).toEqual(chunks);
	});
});
