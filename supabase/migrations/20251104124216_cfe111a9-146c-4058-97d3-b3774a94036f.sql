-- Add credits tracking to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS credits INTEGER DEFAULT 1000 NOT NULL;

-- Create credit_transactions table to log all credit purchases and usage
CREATE TABLE IF NOT EXISTS public.credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  amount INTEGER NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('purchase', 'usage', 'refund')),
  stripe_payment_intent_id TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Enable RLS on credit_transactions
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;

-- Users can view their own transactions
CREATE POLICY "Users can view their own transactions"
ON public.credit_transactions
FOR SELECT
USING (auth.uid() = user_id);

-- Only system can insert transactions (via edge functions with service role)
-- No policy needed as edge functions use service role

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_credit_transactions_user_id ON public.credit_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_created_at ON public.credit_transactions(created_at DESC);