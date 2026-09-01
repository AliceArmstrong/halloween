export default function VoteForm({
  options,
  selected,
  setSelected,
  name,
  setName,
  onSubmit,
  saving,
}) {
  return (
    <form onSubmit={onSubmit} className="vote-form">
      {/* <label htmlFor="name">Name (optional)</label> */}
      <input
        id="name"
        type="text"
        value={name}
        placeholder="Name (optional)"
        onChange={(event) => setName(event.target.value)}
        disabled={saving}
      />
      {/* <label htmlFor="option">Pick an option</label> */}
      <select
        id="option"
        value={selected}
        onChange={(event) => setSelected(event.target.value)}
        disabled={saving}
      >
        {options.map((choice) => (
          <option key={choice.key} value={choice.key}>
            {choice.label}
          </option>
        ))}
      </select>
      <button type="submit" disabled={saving}>
        {saving ? "Saving..." : "Submit Vote"}
      </button>
    </form>
  );
}
