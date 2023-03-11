/**
 * Calculates remaining dominion points
 * @param {Object} system - actor system object
 */
const calculateDominionPointsRemaining = (system) => {
  system.dominion.free = system.dominion.total - system.dominion.spent;
}

export default { calculateDominionPointsRemaining };