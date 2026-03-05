import { describe, it, expect } from "vitest";

describe("Database Migration Verification", () => {
	it("should have mongoose installed and functional", async () => {
		const mongoose = await import("mongoose");
		expect(mongoose).toBeDefined();
		expect(mongoose.Schema).toBeDefined();
	});

	it("should map models correctly", async () => {
		const models = await import("../src/lib/models");
		expect(models.Project).toBeDefined();
		expect(models.Client).toBeDefined();
		expect(models.Todo).toBeDefined();
		expect(models.Personnel).toBeDefined();
		expect(models.Activity).toBeDefined();
		expect(models.Transaction).toBeDefined();
		expect(models.ProjectDocument).toBeDefined();
	});
});
