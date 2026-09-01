import { useEffect, useMemo, useState } from "react";
import { VOTE_OPTION_KEYS } from "../config/voteOptions";
import {
  clearVotes,
  createEmptyVotes,
  fetchVotes,
  submitVote,
} from "../services/votesService";

export function useVotes() {
  const [selected, setSelected] = useState(VOTE_OPTION_KEYS[0]);
  const [name, setName] = useState("");
  const [votes, setVotes] = useState(() => createEmptyVotes());
  const [status, setStatus] = useState("Loading votes...");
  const [saving, setSaving] = useState(false);
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    let active = true;

    fetchVotes()
      .then((data) => {
        if (!active) {
          return;
        }

        setVotes(data);
        setStatus("Live vote totals loaded.");
      })
      .catch((error) => {
        if (!active) {
          return;
        }

        setStatus(error.message);
      });

    return () => {
      active = false;
    };
  }, []);

  const total = useMemo(
    () => votes.reduce((sum, item) => sum + item.count, 0),
    [votes]
  );

  async function submitSelectedVote(event) {
    event.preventDefault();
    if (clearing) {
      return;
    }

    setSaving(true);
    setStatus("Submitting vote...");

    try {
      const updated = await submitVote(selected, name);
      setVotes(updated);
      setStatus("Vote recorded.");
    } catch (error) {
      setStatus(error.message);
    } finally {
      setSaving(false);
    }
  }

  async function clearAllVotes() {
    if (saving || clearing) {
      return;
    }

    setClearing(true);
    setStatus("Clearing votes...");

    try {
      const updated = await clearVotes();
      setVotes(updated);
      setStatus("All votes cleared.");
    } catch (error) {
      setStatus(error.message);
    } finally {
      setClearing(false);
    }
  }

  return {
    selected,
    setSelected,
    name,
    setName,
    votes,
    total,
    status,
    saving,
    clearing,
    submitSelectedVote,
    clearAllVotes,
  };
}
