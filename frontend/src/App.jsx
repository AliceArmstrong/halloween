import { useMemo, useState } from "react";
import InterfaceSwitcher from "./components/InterfaceSwitcher";
import { VOTE_OPTIONS, getOptionLabel } from "./config/voteOptions";
import { DEFAULT_UI_VARIANT } from "./config/uiVariants";
import { useVotes } from "./hooks/useVotes";
import ClassicLayout from "./layouts/ClassicLayout";
import SpotlightLayout from "./layouts/SpotlightLayout";

const layoutByVariant = {
  classic: ClassicLayout,
  spotlight: SpotlightLayout,
};

// For clearing votes
const SHOW_HEADER = false;

export default function App() {
  const [variant, setVariant] = useState(DEFAULT_UI_VARIANT);
  const {
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
  } = useVotes();

  const ActiveLayout = useMemo(
    () => layoutByVariant[variant] || layoutByVariant[DEFAULT_UI_VARIANT],
    [variant]
  );

  async function handleClearVotes() {
    const confirmed = window.confirm(
      "Clear all votes from the shared table? This cannot be undone."
    );

    if (!confirmed) {
      return;
    }

    await clearAllVotes();
  }

  return (
    <main className={`page page-variant-${variant}`}>
      {SHOW_HEADER ? (
        <header className="page-header">
          <button
            type="button"
            className="clear-votes-button"
            onClick={handleClearVotes}
            disabled={saving || clearing}
          >
            {clearing ? "Clearing..." : "Clear All Votes"}
          </button>
          <InterfaceSwitcher selectedVariant={variant} onChange={setVariant} />
        </header>
      ) : null}

      <ActiveLayout
        options={VOTE_OPTIONS}
        selected={selected}
        setSelected={setSelected}
        name={name}
        setName={setName}
        submitSelectedVote={submitSelectedVote}
        saving={saving || clearing}
        total={total}
        status={status}
        votes={votes}
        getOptionLabel={getOptionLabel}
      />
    </main>
  );
}
