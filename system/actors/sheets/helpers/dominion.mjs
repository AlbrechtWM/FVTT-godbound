/**
 * Calculates remaining dominion points
 * @param {Object} context - actor context
 */
const calculateDominionPointsRemaining = (context) => {
    context.system.dominion.free = context.system.dominion.total - context.system.dominion.spent;
  }

export default { calculateDominionPointsRemaining };