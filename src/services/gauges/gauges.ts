export async function runGaugeSetup() {
  // await initGaugeAuthItems()
}

export async function giveGaugeAuthorizationForMethod() {
  // one off's if needed for other accounts or migrations, etc.
}

export async function initGaugeAuthItems() {
  /**
   * Set items globally/everywhere for gauge instances,
   * so setting per address is not needed (will map to the same action id for all regardless)
   */
  //
  // auth to add_gauge, add_reward
  // on gauges (use template address?) auth to set fee/withdraw fee, to withdraw fees, add_reward, etc
  // these need to go through the entrypoint authorizer due to the vyper thing
  // save off action id's for convenience
}

export async function addGaugeTypes() {}

export async function addConfigPoolGauges() {
  // veBAL gauge types (can be voted for)
}

export async function addMainPoolGauge() {
  // SingleRecipientGauge type (can not be voted for)
}
