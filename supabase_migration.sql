-- Migration script to add increment_amount column to financial_goals table

-- First, check if the column already exists
DO $$
DECLARE
    column_exists BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'financial_goals'
        AND column_name = 'increment_amount'
    ) INTO column_exists;

    -- If the column doesn't exist, add it
    IF NOT column_exists THEN
        ALTER TABLE financial_goals
        ADD COLUMN increment_amount NUMERIC DEFAULT 100 NOT NULL;
        
        RAISE NOTICE 'Added increment_amount column to financial_goals table';
    ELSE
        RAISE NOTICE 'increment_amount column already exists in financial_goals table';
    END IF;
END $$;

-- Verify the column was added
SELECT column_name, data_type, column_default, is_nullable
FROM information_schema.columns
WHERE table_name = 'financial_goals'
ORDER BY ordinal_position;
