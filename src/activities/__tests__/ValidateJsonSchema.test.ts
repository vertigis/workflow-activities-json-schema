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
        if (result.errors) {
            expect(result.errors[0].params.missingProperty).toBe("foo");
        }
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

    describe("formats", () => {
        const cases = [
            {
                description: "a valid e-mail address",
                input: { data: "joe.bloggs@example.com", schema: { type: "string", format: "email" } },
                expected: true
            },
            {
                description: "an invalid e-mail address",
                input: { data: "2962", schema: { type: "string", format: "email" } },
                expected: false
            },

            {
                description: "valid regex",
                input: { data: "[0-9]", schema: { type: "string", format: "regex" } },
                expected: true
            },
            {
                description: "invalid regex",
                input: { data: "[9-0]", schema: { type: "string", format: "regex" } },
                expected: false
            },
            {
                description: "not string is valid",
                input: { data: 123, schema: { type: "number", format: "regex" } },
                expected: true
            },

            {
                description: "valid uri",
                input: { data: "urn:isbn:978-3-531-18621-4", schema: { type: "string", format: "uri" } },
                expected: true
            },
            {
                description: "invalid relative uri-reference",
                input: { data: "/abc", schema: { type: "string", format: "uri" } },
                expected: false
            },

            {
                description: "valid uri-template",
                input: {
                    data: "http://example.com/dictionary/{term:1}/{term}",
                    schema: { type: "string", format: "uri-template" }
                },
                expected: true
            },
            {
                description: "invalid uri-template",
                input: {
                    data: "http://example.com/dictionary/{term:1}/{term",
                    schema: { type: "string", format: "uri-template" }
                },
                expected: false
            },

            {
                description: "valid hostname",
                input: { data: "123.example.com", schema: { type: "string", format: "hostname" } },
                expected: true
            },

            {
                description: "a valid date string",
                input: { data: "1963-06-19", schema: { type: "string", format: "date" } },
                expected: true
            },
            {
                description: "an invalid date string",
                input: { data: "06/19/1963", schema: { type: "string", format: "date" } },
                expected: false
            },

            {
                description: "a valid uuid",
                input: { data: "f81d4fae-7dec-11d0-a765-00a0c91e6bf6", schema: { type: "string", format: "uuid" } },
                expected: true
            },
            {
                description: "not valid uuid",
                input: { data: "f81d4fae7dec11d0a76500a0c91e6bf6", schema: { type: "string", format: "uuid" } },
                expected: false
            }
        ];


        it.each(cases)("$description", ({ input, expected }) => {
            const activity: ValidateJsonSchema = new ValidateJsonSchema();
            const { isValid, errors } = activity.execute(input);

            expect(typeof isValid).toBe("boolean");

            if (expected) {
                expect(isValid).toBe(true);
                expect(errors).toBeUndefined();
            } else {
                expect(isValid).toBe(false);
                expect(errors).toBeDefined();
                expect(Array.isArray(errors)).toBe(true);
            }
        });
    });

    describe("options", () => {
        const data = {
            bar: "abc",
            foo: "def",
        }

        const schema = {
            type: "object",
            properties: {
                foo: { type: "integer" },
                bar: { type: "integer" },
            }
        }

        it("options are optional", () => {
            const activity = new ValidateJsonSchema();
            const result = activity.execute({ data, schema });
            expect(result.isValid).toBe(false);
            expect(result.errors).toHaveLength(1);
        });

        it("The 'allErrors' option has an effect", () => {
            const activity = new ValidateJsonSchema();
            const result = activity.execute({ data, schema, options: { allErrors: true } });
            expect(result.isValid).toBe(false);
            expect(result.errors).toHaveLength(2);
        });
    });
});
