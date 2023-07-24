import type { IActivityHandler } from "@vertigis/workflow";
import Ajv from "ajv";

interface ValidateJsonSchemaInputs {
    /**
     * Data in JSON format that to validated against the schema.
     * @required
     */
    data: unknown;

    /**
     * The JSON schema to validate the data against.
     * @required
     */
    schema: object;
}

interface ValidateJsonSchemaOutputs {
    /**
     * @description Whether the data is valid according to the schema.
     */
    isValid: boolean;

    /**
     * @description The schema validation errors.
     */
    errors?: {
        keyword: string;
        instancePath: string;
        schemaPath: string;
        params: Record<string, any>;
        propertyName?: string;
        message?: string;
        schema?: unknown;
        parentSchema?: any;
        data?: unknown;
    }[];
}

/**
 * @displayName Validate JSON Schema
 * @defaultName jsonSchema
 * @category JSON Schema
 * @description Validates JSON data against a provided JSON schema.
 */
export default class ValidateJsonSchema implements IActivityHandler {
    execute(inputs: ValidateJsonSchemaInputs): ValidateJsonSchemaOutputs {
        const { data, schema } = inputs;
        if (!data) {
            throw new Error("data is required");
        }
        if (!schema) {
            throw new Error("schema is required");
        }

        const ajv = new Ajv();
        const validate = ajv.compile(schema);
        const isValid = validate(data);
        
        return {
            isValid,
            errors: validate.errors ? validate.errors: undefined,
        };
    }
}
