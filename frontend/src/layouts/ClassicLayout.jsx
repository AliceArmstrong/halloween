import VoteForm from "../components/VoteForm";
import ClassicJarSimulation from "../components/ClassicJarSimulation";

export default function ClassicLayout({
  options,
  selected,
  setSelected,
  name,
  setName,
  submitSelectedVote,
  saving,
  total,
  status,
  votes,
  getOptionLabel,
}) {
  return (
    <div className="layout layout-classic">
      <section className="panel">
        <h1>Shared Vote Board</h1>
        <p>Total votes: {total}</p>

        <VoteForm
          options={options}
          selected={selected}
          setSelected={setSelected}
          name={name}
          setName={setName}
          onSubmit={submitSelectedVote}
          saving={saving}
        />

        <p className="status" aria-live="polite">
          {status}
        </p>
      </section>

      <section className="panel chart-panel">
        <h2>Physics Vote Flow</h2>
        <p>
          Water drops into the left jar for {getOptionLabel(options[0]?.key)}. Sand drops into
          the right jar for {getOptionLabel(options[1]?.key)}.
        </p>
        <ClassicJarSimulation options={options} votes={votes} />
      </section>
    </div>
  );
}
