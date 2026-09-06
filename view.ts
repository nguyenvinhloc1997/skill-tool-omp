import * as os from "node:os";
import * as path from "node:path";
import type { SkillToolDetails } from "./run.ts";

export type SkillCallView = {
	name: string;
	args: string;
};

export type SkillResultView =
	| { kind: "error"; text: string }
	| {
			kind: "chip";
			name: string;
			args: string;
			path: string;
			displayPath: string;
			lineCount: number;
			body: string;
	  };

export function skillCallView(params: { skill?: string; args?: string }): SkillCallView {
	const trimmed = (params.skill ?? "").trim();
	const name = trimmed.startsWith("skill:") ? trimmed.slice("skill:".length).trim() : trimmed;
	return {
		name: name || "unknown",
		args: (params.args ?? "").replace(/\s+/g, " ").trim(),
	};
}

export function skillResultView(
	result: {
		isError?: boolean;
		content?: Array<{ type: string; text?: string }>;
		details?: SkillToolDetails;
	},
	homeDir: string = os.homedir(),
): SkillResultView {
	const text = result.content?.find(block => block.type === "text")?.text ?? "";
	if (result.isError || !result.details) {
		return { kind: "error", text: text || "Skill failed" };
	}
	return {
		kind: "chip",
		name: result.details.name,
		args: (result.details.args ?? "").replace(/\s+/g, " ").trim(),
		path: result.details.path,
		displayPath: shortenHomePath(result.details.path, homeDir),
		lineCount: result.details.lineCount,
		body: result.details.body,
	};
}

export function shortenHomePath(filePath: string, homeDir: string = os.homedir()): string {
	if (!homeDir || !filePath.startsWith(homeDir)) return filePath;
	const suffix = filePath.slice(homeDir.length);
	if (suffix !== "" && !suffix.startsWith(path.posix.sep) && !suffix.startsWith(path.win32.sep)) {
		return filePath;
	}
	return `~${suffix.replaceAll(path.win32.sep, path.posix.sep)}`;
}
