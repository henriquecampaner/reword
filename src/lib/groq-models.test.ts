import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { parseGroqModels, pickGroqModelId } from './groq-models.ts';

describe('parseGroqModels', () => {
  it('keeps chat models and drops audio, TTS, and guard models', () => {
    const models = parseGroqModels({
      data: [
        { id: 'openai/gpt-oss-120b', active: true },
        { id: 'whisper-large-v3', active: true },
        { id: 'whisper-large-v3-turbo', active: true },
        { id: 'canopylabs/orpheus-v1-english', active: true },
        { id: 'playai-tts', active: true },
        { id: 'meta-llama/llama-prompt-guard-2-22m', active: true },
        { id: 'openai/gpt-oss-safeguard-20b', active: true },
        { id: 'qwen/qwen3.6-27b', active: true },
        { id: 'groq/compound', active: true }
      ]
    });

    assert.deepEqual(
      models.map((model) => model.id),
      ['groq/compound', 'openai/gpt-oss-120b', 'qwen/qwen3.6-27b']
    );
  });

  it('omits inactive models', () => {
    const models = parseGroqModels({
      data: [
        { id: 'openai/gpt-oss-120b', active: false },
        { id: 'openai/gpt-oss-20b' }
      ]
    });

    assert.deepEqual(
      models.map((model) => model.id),
      ['openai/gpt-oss-20b']
    );
  });
});

describe('pickGroqModelId', () => {
  it('keeps a saved model that is still available', () => {
    assert.equal(
      pickGroqModelId(['openai/gpt-oss-20b', 'openai/gpt-oss-120b'], 'openai/gpt-oss-20b'),
      'openai/gpt-oss-20b'
    );
  });

  it('falls back to gpt-oss-120b when the saved model is gone', () => {
    assert.equal(
      pickGroqModelId(['openai/gpt-oss-20b', 'openai/gpt-oss-120b'], 'llama-3.3-70b-versatile'),
      'openai/gpt-oss-120b'
    );
  });

  it('falls back to the first model when the preferred default is missing', () => {
    assert.equal(pickGroqModelId(['qwen/qwen3.6-27b'], ''), 'qwen/qwen3.6-27b');
  });
});
