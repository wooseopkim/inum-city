import type { PostgrestError } from '@supabase/supabase-js';

export function isUniqueViolation(error: PostgrestError) {
	return error.code === '23505';
}
