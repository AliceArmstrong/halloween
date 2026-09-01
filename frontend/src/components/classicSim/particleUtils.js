import { CLASSIC_SIM_CONFIG } from "./simulationConfig";

export function getVoteCount(votes, optionKey) {
  return votes.find((item) => item.option === optionKey)?.count || 0;
}

export function scaleParticleCounts(leftVotes, rightVotes) {
  const total = leftVotes + rightVotes;

  if (total === 0) {
    return { leftParticles: 0, rightParticles: 0 };
  }

  const max = CLASSIC_SIM_CONFIG.particles.maxRendered;

  if (total <= max) {
    return { leftParticles: leftVotes, rightParticles: rightVotes };
  }

  const leftParticles = Math.max(1, Math.round((leftVotes / total) * max));
  const rightParticles = Math.max(1, max - leftParticles);

  return { leftParticles, rightParticles };
}

export function createParticleDescriptors({ count, type, jarX }) {
  const descriptors = [];
  const cfg = CLASSIC_SIM_CONFIG.particles;

  for (let index = 0; index < count; index += 1) {
    const normalized = count > 1 ? index / (count - 1) : 0;

    descriptors.push({
      key: `${type}-${index}`,
      type,
      radius: cfg.radiusMin + Math.random() * (cfg.radiusMax - cfg.radiusMin),
      position: [
        jarX + (Math.random() - 0.5) * cfg.spawnJitterX,
        cfg.spawnTopY + normalized * cfg.spawnJitterY + Math.random() * 0.25,
        (Math.random() - 0.5) * cfg.spawnJitterZ,
      ],
    });
  }

  return descriptors;
}
