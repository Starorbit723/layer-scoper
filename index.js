import * as core from './plugin/layerScoper.js';
import * as scrollView from './plugin/LayerScoperScrollView.js';

// preserve default export for backward compatibility
export const LayerScoper = core.LayerScoper;
export default LayerScoper;

// re-export all named exports from plugins so consumers can import them from package root
export * from './plugin/layerScoper.js';
export * from './plugin/LayerScoperScrollView.js';

// also provide grouped exports if desired
export const plugins = {
  ...core,
  ...scrollView,
};
