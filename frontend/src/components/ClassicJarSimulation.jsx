import ClassicJarThreeScene from "./classicSim/ClassicJarThreeScene";

export default function ClassicJarSimulation({ options, votes }) {
  // This wrapper keeps layout components lightweight while the 3D logic
  // lives in isolated files under src/components/classicSim.
  return (
    <div className="classic-jar-viz">
      <div className="classic-jar-canvas">
        <ClassicJarThreeScene options={options} votes={votes} />
      </div>
    </div>
  );
}
