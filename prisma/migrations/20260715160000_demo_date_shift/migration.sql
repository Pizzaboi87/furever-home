-- CreateTable
CREATE TABLE "DemoDateShiftRun" (
    "id" TEXT NOT NULL,
    "runDate" DATE NOT NULL,
    "shiftedDays" INTEGER NOT NULL DEFAULT 1,
    "shiftedRows" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DemoDateShiftRun_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DemoDateShiftRun_runDate_key" ON "DemoDateShiftRun"("runDate");

-- CreateIndex
CREATE INDEX "DemoDateShiftRun_createdAt_idx" ON "DemoDateShiftRun"("createdAt");

-- Recursively advances date-like strings inside dashboard JSON records.
-- Full dates and ISO timestamps move every run. Month-only labels move on
-- the first UTC day of each month so dashboard month buckets stay current.
CREATE OR REPLACE FUNCTION shift_demo_json_dates_by_one_day(
    input_value JSONB,
    shift_month_labels BOOLEAN
)
RETURNS JSONB
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
    value_type TEXT;
    text_value TEXT;
    shifted_prefix TEXT;
BEGIN
    IF input_value IS NULL THEN
        RETURN NULL;
    END IF;

    value_type := jsonb_typeof(input_value);

    IF value_type = 'object' THEN
        RETURN COALESCE(
            (
                SELECT jsonb_object_agg(
                    entry.key,
                    shift_demo_json_dates_by_one_day(entry.value, shift_month_labels)
                )
                FROM jsonb_each(input_value) AS entry
            ),
            '{}'::jsonb
        );
    END IF;

    IF value_type = 'array' THEN
        RETURN COALESCE(
            (
                SELECT jsonb_agg(
                    shift_demo_json_dates_by_one_day(entry.value, shift_month_labels)
                    ORDER BY entry.ordinality
                )
                FROM jsonb_array_elements(input_value) WITH ORDINALITY AS entry(value, ordinality)
            ),
            '[]'::jsonb
        );
    END IF;

    IF value_type = 'string' THEN
        text_value := input_value #>> '{}';

        IF text_value ~ '^\d{4}-\d{2}-\d{2}([T ].*)?$' THEN
            shifted_prefix := to_char(
                substring(text_value FROM 1 FOR 10)::date + INTERVAL '1 day',
                'YYYY-MM-DD'
            );

            RETURN to_jsonb(shifted_prefix || substring(text_value FROM 11));
        END IF;

        IF shift_month_labels AND text_value ~ '^\d{4}-\d{2}$' THEN
            RETURN to_jsonb(
                to_char(
                    (text_value || '-01')::date + INTERVAL '1 month',
                    'YYYY-MM'
                )
            );
        END IF;
    END IF;

    RETURN input_value;
END;
$$;
