const normalizeAngle = function(angle: number): number {
  if (angle < (2 * Math.PI) && angle >= 0)
    return angle;

  if (angle >= (2 * Math.PI))
    angle = angle - (2 * Math.PI);
  if (angle < 0)
    angle = angle + (2 * Math.PI);
  return normalizeAngle(angle);
};

export {
  normalizeAngle
}
