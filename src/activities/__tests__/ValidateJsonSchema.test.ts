import ValidateJsonSchema from "../ValidateJsonSchema";

describe("ValidateJsonSchema", () => {
    it("validates the data against the schema", () => {
        const data = {
            foo: 1,
            bar: "abc",
        }
        const schema = {
            type: "object",
            properties: {
                foo: { type: "integer" },
                bar: { type: "string" },
            },
            required: ["foo"],
            additionalProperties: false,
        }
        const activity = new ValidateJsonSchema();
        const result = activity.execute({ data, schema });
        expect(result.isValid).toBe(true);
        expect(result.errors).toBeUndefined();
    });
    it("returns errors when the data does not match the schema", () => {
        const data = {
            bar: "abc",
        }
        const schema = {
            type: "object",
            properties: {
                foo: { type: "integer" },
                bar: { type: "string" },
            },
            required: ["foo"],
            additionalProperties: false,
        }
        const activity = new ValidateJsonSchema();
        const result = activity.execute({ data, schema });
        expect(result.isValid).toBe(false);
        expect(result.errors).toBeDefined();
        expect(result.errors![0].params.missingProperty).toBe("foo");
    });
    it("throws if data input missing", () => {
        const activity = new ValidateJsonSchema();
        expect(() => activity.execute({ data: undefined, schema: {} })).toThrow(
            "data is required"
        );
    });
    it("throws if schema input missing", () => {
        const activity = new ValidateJsonSchema();
        expect(() => activity.execute({ data: {}, schema: undefined as any })).toThrow(
            "schema is required"
        );
    });
});
