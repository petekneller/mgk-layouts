import obstacle from '../obstacles';
import { Segment, Stage3Segment } from './types';

const calculateSegment = function(segment: Stage3Segment): Segment {

  const boundary1 = segment.boundaryCircle1;
  const boundary2 = segment.boundaryCircle2;

  const o12 = boundary2.origin.clone().subtract(boundary1.origin);
  const r12 = boundary1.exit === boundary2.entry ?
        Math.abs(boundary1.radius - boundary2.radius) :
       (boundary1.radius + boundary2.radius);
  const t12 = Math.sqrt(Math.pow(o12.magnitude(), 2) - Math.pow(r12, 2));
  const beta = Math.atan2(t12, r12);

  let exitTheta, entryTheta;
  if (boundary1.exit !== boundary2.entry) {
    exitTheta = (boundary1.exit === obstacle.LEFT) ?
      beta :
      -1 * beta;

    entryTheta = (boundary2.entry === obstacle.LEFT) ?
      (Math.PI - beta) :
      (Math.PI + beta);
  } else if (boundary1.radius >= boundary2.radius) {
    entryTheta = exitTheta = (boundary1.exit === obstacle.LEFT) ?
      beta :
      -1 * beta;
  } else {
    entryTheta = exitTheta = Math.PI +
      ((boundary1.exit === obstacle.RIGHT) ?
        beta :
        -1 * beta);
  }

  const exit = o12.
        clone().
        normalize().
        multiplyScalar(boundary1.radius).
        rotate(exitTheta);

  const entry = o12.
        clone().
        normalize().
        multiplyScalar(boundary2.radius).
        rotate(entryTheta);

  return {
    ...segment,
    o12,
    beta,
    exit,
    entry
  };
};

export default calculateSegment;
