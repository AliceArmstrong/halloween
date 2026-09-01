import { supabase } from "../supabaseClient";
import { VOTE_OPTION_KEYS } from "../config/voteOptions";

function normalizeVotes(votes) {
  const baseline = VOTE_OPTION_KEYS.map((option) => ({ option, count: 0 }));
  const map = new Map(votes.map((item) => [item.option, item.count]));

  return baseline.map((item) => ({ ...item, count: map.get(item.option) || 0 }));
}

function summarizeVoteRows(rows) {
  const tally = rows.reduce((map, row) => {
    const next = (map.get(row.option) || 0) + 1;
    map.set(row.option, next);
    return map;
  }, new Map());

  return normalizeVotes(
    Array.from(tally.entries()).map(([option, count]) => ({ option, count }))
  );
}

function requireSupabase() {
  if (!supabase) {
    throw new Error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY");
  }

  return supabase;
}

export async function fetchVotes() {
  const client = requireSupabase();
  const { data, error } = await client.from("votes").select("option");

  if (error) {
    throw new Error(`Failed to fetch votes: ${error.message}`);
  }

  return summarizeVoteRows(data || []);
}

export async function submitVote(option, name) {
  const client = requireSupabase();
  const trimmedName = name.trim();
  const { error } = await client
    .from("votes")
    .insert({ option, name: trimmedName || null });

  if (error) {
    throw new Error(`Failed to submit vote: ${error.message}`);
  }

  return fetchVotes();
}

export async function clearVotes() {
  const client = requireSupabase();
  const { error } = await client.from("votes").delete().gt("id", 0);

  if (error) {
    throw new Error(`Failed to clear votes: ${error.message}`);
  }

  return fetchVotes();
}

export function createEmptyVotes() {
  return normalizeVotes([]);
}
