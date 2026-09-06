import type { ExtensionAPI } from "@oh-my-pi/pi-coding-agent";
import { getActiveSkills } from "@oh-my-pi/pi-coding-agent/extensibility/skills";
import { rewriteSkillCatalogHint } from "./prompt.ts";
import { renderSkillCall, renderSkillResult } from "./render.ts";
import { runSkillTool } from "./run.ts";

const TOOL_DESCRIPTION = [
	"Load a skill's full instructions by name from the session skill catalog.",
	"Call this when a listed skill matches the current task.",
	"Do not read SKILL.md with the read tool — this tool expands the body.",
	"After it loads, follow the body.",
	"Use read skill://<name>/… only for sibling files in the skill directory.",
].join(" ");

export default function skillToolOmp(pi: ExtensionAPI): void {
	pi.setLabel("Skill tool");
	pi.registerTool({
		name: "Skill",
		label: "Skill",
		description: TOOL_DESCRIPTION,
		parameters: pi.zod.object({
			skill: pi.zod.string().describe("Skill name from the catalog"),
			args: pi.zod.string().optional().describe("Optional arguments forwarded into the skill body"),
		}),
		loadMode: "essential",
		approval: "read",
		mergeCallAndResult: true,
		renderCall: renderSkillCall,
		renderResult: renderSkillResult,
		async execute(_toolCallId, params) {
			return runSkillTool(params, getActiveSkills(), path => Bun.file(path).text());
		},
	});

	pi.on("before_agent_start", event => {
		const systemPrompt = rewriteSkillCatalogHint(event.systemPrompt);
		if (systemPrompt.some((chunk, index) => chunk !== event.systemPrompt[index])) {
			return { systemPrompt };
		}
	});
}
