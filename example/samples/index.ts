import typescript from './typescript';
import scheme from './scheme';
import abap from './abap';
import { quickbasic } from './quickbasic';
import { plaintext } from './plaintext';

const SAMPLES: Record<string, string> = {
  typescript: typescript,
  javascript: typescript,
  scheme: scheme,
  abap: abap,
  quickbasic: quickbasic,
  plaintext: plaintext,
};

export default SAMPLES;
