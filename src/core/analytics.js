export function track(name, params = {}) {
  // Analytics consent and provider loading will be connected at the deployment Gate.
  window.dispatchEvent(new CustomEvent('game-factory:analytics', { detail: { name, params } }));
}

