import VoteForm from "../components/VoteForm";
import SpotlightBattleViz from "../components/SpotlightBattleViz";
import leftFighterImage from "../assets/voting1.png";
import rightFighterImage from "../assets/voting2.png";
import leftNameImage from "../assets/halloween-logos-td.png";
import rightNameImage from "../assets/halloween-logos-wwmh.png";
import titleImage from "../assets/halloween-title.png";

export default function SpotlightLayout({
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
  const leftOption = options[0];
  const rightOption = options[1];

  if (!leftOption || !rightOption) {
    return null;
  }

  return (
    <div className="layout layout-spotlight">
      <section className="panel spotlight-arena">
      <header className="header">
        <img src={titleImage} alt="Halloween Title" className="title-image" />
        <p>Saturday 31st October<br />1 York Lane, CR4 1GX</p>
      </header>
      <div className="arena-controls">
        <VoteForm
          options={options.map((option) => ({
            ...option,
            label: getOptionLabel(option.key),
          }))}
          selected={selected}
          setSelected={setSelected}
          name={name}
          setName={setName}
          onSubmit={submitSelectedVote}
          saving={saving}
        />
      </div>
        <div className="arena-grid">
          <aside className="fighter-column fighter-left" aria-label={`${leftOption.label} side`}>
            <div className="image-placeholder">
              <img
                src={leftFighterImage}
                alt={`${leftOption.label} fighter artwork`}
                className="fighter-image"
              />
              <div className="fighter-name">
                <img
                  src={leftNameImage}
                  alt={`${leftOption.label}`}
                  className="name-image"
                />
                <p className="fighter-score">{votes.find((item) => item.option === leftOption.key)?.count || 0}</p>
              </div>
            </div>
          </aside>

          <div className="battle-center">
            <SpotlightBattleViz
              leftOption={leftOption}
              rightOption={rightOption}
              votes={votes}
            />
          </div>

          <aside
            className="fighter-column fighter-right"
            aria-label={`${rightOption.label} side`}
          >
            <div className="image-placeholder">
              <img
                src={rightFighterImage}
                alt={`${rightOption.label} fighter artwork`}
                className="fighter-image"
              />
              <div className="fighter-name">
                <p className="fighter-score">{votes.find((item) => item.option === rightOption.key)?.count || 0}</p>
                <img
                  src={rightNameImage}
                  alt={`${rightOption.label}`}
                  className="name-image"
                />
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
