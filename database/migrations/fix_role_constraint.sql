-- Fix role constraint to ensure 'builder' is allowed
-- This migration updates the CHECK constraint on the users.role column

-- Drop the old constraint
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;

-- Add the new constraint with all allowed roles
ALTER TABLE users ADD CONSTRAINT users_role_check 
  CHECK (role IN ('user', 'builder', 'early_adopter', 'investor', 'influencer', 'admin'));

-- Verify the constraint
SELECT conname, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conrelid = 'users'::regclass AND conname = 'users_role_check';

