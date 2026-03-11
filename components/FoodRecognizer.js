// FoodRecognizer.js
// Lightweight wrapper showing how to load a TensorFlow.js EfficientNet model
// in React Native using @tensorflow/tfjs and @tensorflow/tfjs-react-native.
// NOTE: This file is a template. You must install native dependencies and
// provide a converted TFJS model (graph/model.json + shard files) hosted
// locally in the app bundle or on a remote URL.

import * as tf from '@tensorflow/tfjs';
import * as tfn from '@tensorflow/tfjs-react-native';
import { bundleResourceIO } from '@tensorflow/tfjs-react-native';

/**
 * Usage:
 *  - call initialize() once (e.g. app start) to init the TF backend
 *  - call loadModel(modelInfo) to load the converted model
 *  - call classify(imageUri) with a local file URI to get predictions
 */

const state = {
  ready: false,
  model: null,
};

export async function initialize() {
  if (state.ready) return;
  await tfn.ready();
  // choose backend: 'rn-webgl' (recommended) or 'cpu'
  try {
    await tfn.setBackend('rn-webgl');
  } catch (e) {
    console.warn('Failed to set rn-webgl backend, falling back to cpu', e);
    await tfn.setBackend('cpu');
  }
  state.ready = true;
}

/**
 * Load a TFJS graph model.
 * modelInfo options:
 *  - {type: 'remote', url: 'https://.../model.json'}
 *  - {type: 'bundle', modelJson: require('../assets/model/model.json'), weights: [require(...), ...]}
 */
export async function loadModel(modelInfo) {
  if (!state.ready) await initialize();

  if (modelInfo.type === 'remote') {
    state.model = await tf.loadGraphModel(modelInfo.url);
  } else if (modelInfo.type === 'bundle') {
    // bundleResourceIO requires model.json and weight files included as require(...)
    const modelJson = modelInfo.modelJson;
    const weightFiles = modelInfo.weights || [];
    const ioHandler = bundleResourceIO(modelJson, weightFiles);
    state.model = await tf.loadGraphModel(ioHandler);
  } else {
    throw new Error('Unsupported modelInfo.type');
  }

  return state.model;
}

/**
 * Classify an image at `uri` (local file URI). Returns model output tensor data.
 * The caller should convert model outputs to human labels using a labels file.
 */
export async function classify(imageUri, options = { inputSize: 224 }) {
  if (!state.model) throw new Error('Model not loaded');
  // Load image as tensor using tfn.decodeJpeg in react-native environment
  const response = await fetch(imageUri, {}, { isBinary: true });
  const rawArray = await response.arrayBuffer();
  const u8 = new Uint8Array(rawArray);

  // decodeJpeg expects Uint8Array and returns a rank-3 tensor [h,w,3]
  let imageTensor = tfn.decodeJpeg(u8);

  // Resize to model input and normalize (depending on model requirements)
  const resized = tf.image.resizeBilinear(imageTensor, [options.inputSize, options.inputSize]);
  // EfficientNet typically expects inputs scaled to [0,1] or [-1,1] depending on conversion.
  const normalized = tf.div(resized, 255.0);
  const batched = normalized.expandDims(0);

  const output = await state.model.predict(batched);
  // output may be a tensor or an object; convert to array
  let predictions;
  if (Array.isArray(output)) {
    predictions = await Promise.all(output.map((t) => t.data()));
  } else if (output.data) {
    predictions = await output.data();
  } else {
    predictions = output;
  }

  // Cleanup tensors
  imageTensor.dispose();
  resized.dispose();
  normalized.dispose();
  batched.dispose();
  if (Array.isArray(output)) output.forEach((t) => t.dispose && t.dispose());
  else output.dispose && output.dispose();

  return predictions;
}

export function getModel() {
  return state.model;
}
