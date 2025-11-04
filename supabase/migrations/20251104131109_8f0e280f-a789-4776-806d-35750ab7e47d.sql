-- Add restrictive RLS policies to credit_transactions table
-- Only service role (backend) can INSERT, no one can UPDATE or DELETE

-- Explicitly deny INSERT for authenticated users
-- (Service role bypasses RLS, so webhook can still insert)
CREATE POLICY "Prevent direct transaction insertion"
ON public.credit_transactions
FOR INSERT
TO authenticated
WITH CHECK (false);

-- Prevent all updates (transactions are immutable)
CREATE POLICY "Transactions are immutable"
ON public.credit_transactions
FOR UPDATE
TO authenticated
USING (false);

-- Prevent all deletes (preserve audit trail)
CREATE POLICY "Preserve transaction audit trail"
ON public.credit_transactions
FOR DELETE
TO authenticated
USING (false);