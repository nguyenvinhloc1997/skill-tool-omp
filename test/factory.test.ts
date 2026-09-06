import { describe, expect, test } from "bun:test";
import type { ExtensionAPI } from "@oh-my-pi/pi-coding-agent";
import skillToolOmp from "../index.ts";

function zodString() {
	const schema = {
		describe() {
			return schema;
		},
		optional() {
			return schema;
		},
	};
	return schema;
}

function createApi() {
	const tools: Array<{
		name: string;
		label: string;
		loadMode?: string;
		approval?: string;
		mergeCallAndResult?: boolean;
		renderCall?: unknown;
		renderResult?: unknown;
		execute: (...args: unknown[]) => unknown;
	}> = [];
	const handlers = new Map<string, (event: unknown) => unknown>();
	const api = {
		setLabel() {},
		zod: {
			object: (shape: unknown) => shape,
			string: zodString,
		},
		registerTool(tool: (typeof tools)[number]) {
			tools.push(tool);
		},
		on(event: string, handler: (event: unknown) => unknown) {
			handlers.set(event, handler);
		},
	};
	return { api: api as unknown as ExtensionAPI, tools, handlers };
}

describe("skillToolOmp factory", () => {
	test("registers an essential read-only Skill tool", () => {
		const { api, tools } = createApi();
		skillToolOmp(api);
		expect(tools).toHaveLength(1);
		expect(tools[0]?.name).toBe("Skill");
		expect(tools[0]?.label).toBe("Skill");
		expect(tools[0]?.loadMode).toBe("essential");
		expect(tools[0]?.approval).toBe("read");
		expect(tools[0]?.mergeCallAndResult).toBe(true);
		expect(typeof tools[0]?.renderCall).toBe("function");
		expect(typeof tools[0]?.renderResult).toBe("function");
	});

	test("rewrites the catalog hint on before_agent_start", () => {
		const { api, handlers } = createApi();
		skillToolOmp(api);
		const handler = handlers.get("before_agent_start");
		expect(handler).toBeDefined();
		const result = handler?.({
			type: "before_agent_start",
			prompt: "hi",
			systemPrompt: ["Matching skill → MUST read `skill://<name>` first."],
		}) as { systemPrompt?: string[] } | undefined;
		expect(result?.systemPrompt?.[0]).toContain("MUST call the Skill tool");
	});

	test("does not replace an unchanged system prompt", () => {
		const { api, handlers } = createApi();
		skillToolOmp(api);
		const result = handlers.get("before_agent_start")?.({
			type: "before_agent_start",
			prompt: "hi",
			systemPrompt: ["# Personality"],
		});
		expect(result).toBeUndefined();
	});
});
