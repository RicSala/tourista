import { Actor, StateMachine } from '@tinystack/machine';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { generateTourMachine } from '../src/helpers/tourMachineGenerator';
import {
  BaseTourEvent,
  TourConfig,
  TourContext,
  TourStep,
} from '../src/types';

type TestEvent = BaseTourEvent | { type: string; tourId: string; page?: string };
type TestContext = TourContext & {
  lastEvent?: TestEvent | null;
};

type AsyncStep = Extract<TourStep, { type: 'async' }>;
type SyncStep = Exclude<TourStep, AsyncStep>;

const makeSyncStep = (
  id: string,
  overrides: Partial<SyncStep> = {}
): SyncStep => ({
  id,
  page: `/${id}`,
  title: `${id} title`,
  content: `${id} content`,
  targetElement: `[data-tour="${id}"]`,
  ...overrides,
});

const makeAsyncStep = (
  id: string,
  overrides: Partial<AsyncStep> = {}
): AsyncStep => ({
  id,
  type: 'async',
  page: `/${id}`,
  content: {
    pending: {
      targetElement: `[data-tour="${id}-pending"]`,
      title: `${id} pending title`,
      content: `${id} pending content`,
    },
    processing: {
      targetElement: `[data-tour="${id}-processing"]`,
      title: `${id} processing title`,
      content: `${id} processing content`,
    },
    success: {
      targetElement: `[data-tour="${id}-success"]`,
      title: `${id} success title`,
      content: `${id} success content`,
    },
  },
  ...overrides,
});

const makeTour = (
  steps: TourStep[],
  overrides: Partial<TourConfig> = {}
): TourConfig => ({
  id: 'test-tour',
  allowSkip: true,
  steps,
  ...overrides,
});

const createActor = (config: TourConfig) => {
  const machine = new StateMachine<TestContext, TestEvent, string>(
    generateTourMachine<TestContext, TestEvent>(config)
  );
  const actor = new Actor(machine);
  actor.start();
  return actor;
};

const trackStates = (actor: Actor<TestContext, TestEvent, string>) => {
  const trace = [actor.getSnapshot().value];
  const unsubscribe = actor.subscribe((snapshot) => {
    if (trace[trace.length - 1] !== snapshot.value) {
      trace.push(snapshot.value);
    }
  });

  return {
    trace,
    unsubscribe,
  };
};

const enterFirstStep = (actor: Actor<TestContext, TestEvent, string>, config: TourConfig) => {
  actor.send({ type: 'START_TOUR', tourId: config.id });

  const firstStep = config.steps[0];
  if (firstStep) {
    actor.send({
      type: 'PAGE_CHANGED',
      page: firstStep.page,
      tourId: config.id,
    });
  }
};

const getLastEventType = (actor: Actor<TestContext, TestEvent, string>) =>
  actor.getSnapshot().context.lastEvent?.type;

afterEach(() => {
  vi.clearAllTimers();
  vi.useRealTimers();
});

describe('generateTourMachine', () => {
  describe('machine shape', () => {
    it('expands sync and async steps into the expected states', () => {
      const config = makeTour([
        makeSyncStep('intro', { page: '/welcome' }),
        makeAsyncStep('upload', { page: '/upload' }),
        makeAsyncStep('review', {
          page: '/review',
          content: {
            pending: {
              targetElement: '[data-tour="review-pending"]',
              title: 'review pending title',
              content: 'review pending content',
            },
            success: {
              targetElement: '[data-tour="review-success"]',
              title: 'review success title',
              content: 'review success content',
            },
          },
        }),
      ]);

      const machine = generateTourMachine<TestContext, TestEvent>(config);

      expect(Object.keys(machine.states)).toEqual(
        expect.arrayContaining([
          'idle',
          'completed',
          'skipped',
          'navigatingTo_intro',
          'intro',
          'navigatingTo_upload_pending',
          'upload_pending',
          'upload_processing',
          'upload_success',
          'navigatingTo_review_pending',
          'review_pending',
          'review_success',
        ])
      );
      expect(machine.states).not.toHaveProperty('review_processing');
    });
  });

  describe('state traces', () => {
    it('records the expected state sequence for a cross-page NEXT flow', () => {
      const config = makeTour([
        makeSyncStep('intro', { page: '/home' }),
        makeSyncStep('checkout', { page: '/checkout' }),
      ]);
      const actor = createActor(config);
      const { trace, unsubscribe } = trackStates(actor);

      actor.send({ type: 'START_TOUR', tourId: config.id });
      actor.send({ type: 'PAGE_CHANGED', page: '/home', tourId: config.id });
      actor.send({ type: 'NEXT', tourId: config.id });
      actor.send({
        type: 'PAGE_CHANGED',
        page: '/checkout',
        tourId: config.id,
      });
      actor.send({ type: 'NEXT', tourId: config.id });

      unsubscribe();

      expect(trace).toEqual([
        'idle',
        'navigatingTo_intro',
        'intro',
        'navigatingTo_checkout',
        'checkout',
        'completed',
      ]);
    });

    it('records the expected state sequence for a cross-page PREV flow', () => {
      const config = makeTour([
        makeSyncStep('intro', { page: '/home' }),
        makeSyncStep('checkout', { page: '/checkout' }),
      ]);
      const actor = createActor(config);
      const { trace, unsubscribe } = trackStates(actor);

      actor.send({ type: 'START_TOUR', tourId: config.id });
      actor.send({ type: 'PAGE_CHANGED', page: '/home', tourId: config.id });
      actor.send({ type: 'NEXT', tourId: config.id });
      actor.send({
        type: 'PAGE_CHANGED',
        page: '/checkout',
        tourId: config.id,
      });
      actor.send({ type: 'PREV', tourId: config.id });
      actor.send({ type: 'PAGE_CHANGED', page: '/home', tourId: config.id });

      unsubscribe();

      expect(trace).toEqual([
        'idle',
        'navigatingTo_intro',
        'intro',
        'navigatingTo_checkout',
        'checkout',
        'navigatingTo_intro',
        'intro',
      ]);
    });

    it('records the expected state sequence for an async cross-page flow', () => {
      const config = makeTour([
        makeAsyncStep('upload', { page: '/upload' }),
        makeSyncStep('done', { page: '/done' }),
      ]);
      const actor = createActor(config);
      const { trace, unsubscribe } = trackStates(actor);

      actor.send({ type: 'START_TOUR', tourId: config.id });
      actor.send({
        type: 'PAGE_CHANGED',
        page: '/upload',
        tourId: config.id,
      });
      actor.send({ type: 'START_UPLOAD', tourId: config.id });
      actor.send({ type: 'UPLOAD_SUCCESS', tourId: config.id });
      actor.send({ type: 'NEXT', tourId: config.id });
      actor.send({ type: 'PAGE_CHANGED', page: '/done', tourId: config.id });

      unsubscribe();

      expect(trace).toEqual([
        'idle',
        'navigatingTo_upload_pending',
        'upload_pending',
        'upload_processing',
        'upload_success',
        'navigatingTo_done',
        'done',
      ]);
    });
  });

  describe('sync steps', () => {
    it('completes immediately when the tour has no steps', () => {
      const config = makeTour([]);
      const actor = createActor(config);

      actor.send({ type: 'START_TOUR', tourId: config.id });

      expect(actor.getSnapshot().value).toBe('completed');
      expect(actor.getSnapshot().context.currentPage).toBe('');
      expect(getLastEventType(actor)).toBe('START_TOUR');
    });

    it('starts in the first navigation state and lands on the first step after PAGE_CHANGED', () => {
      const config = makeTour([
        makeSyncStep('hero', {
          page: '/home',
          viewportId: 'main-viewport',
        }),
      ]);
      const actor = createActor(config);

      actor.send({ type: 'START_TOUR', tourId: config.id });

      expect(actor.getSnapshot().value).toBe('navigatingTo_hero');
      expect(actor.getSnapshot().context).toMatchObject({
        tourId: config.id,
        currentPage: '/home',
        targetElement: '[data-tour="hero"]',
        title: 'hero title',
        content: 'hero content',
        viewportId: 'main-viewport',
      });

      actor.send({ type: 'PAGE_CHANGED', page: '/home', tourId: config.id });

      expect(actor.getSnapshot().value).toBe('hero');
      expect(getLastEventType(actor)).toBe('PAGE_CHANGED');
    });

    it('moves directly to the next step when both sync steps share a page', () => {
      const config = makeTour([
        makeSyncStep('intro', { page: '/home' }),
        makeSyncStep('details', { page: '/home' }),
      ]);
      const actor = createActor(config);

      enterFirstStep(actor, config);
      actor.send({ type: 'NEXT', tourId: config.id });

      expect(actor.getSnapshot().value).toBe('details');
      expect(actor.getSnapshot().context).toMatchObject({
        currentPage: '/home',
        targetElement: '[data-tour="details"]',
        title: 'details title',
        content: 'details content',
      });
      expect(getLastEventType(actor)).toBe('NEXT');
    });

    it('moves through a navigation state when NEXT crosses pages', () => {
      const config = makeTour([
        makeSyncStep('hero', { page: '/home' }),
        makeSyncStep('checkout', { page: '/checkout' }),
      ]);
      const actor = createActor(config);

      enterFirstStep(actor, config);
      actor.send({ type: 'NEXT', tourId: config.id });

      expect(actor.getSnapshot().value).toBe('navigatingTo_checkout');
      expect(actor.getSnapshot().context).toMatchObject({
        currentPage: '/checkout',
        targetElement: '[data-tour="checkout"]',
        title: 'checkout title',
        content: 'checkout content',
      });

      actor.send({
        type: 'PAGE_CHANGED',
        page: '/checkout',
        tourId: config.id,
      });

      expect(actor.getSnapshot().value).toBe('checkout');
    });

    it('moves directly backwards on the same page', () => {
      const config = makeTour([
        makeSyncStep('intro', { page: '/home' }),
        makeSyncStep('details', { page: '/home' }),
      ]);
      const actor = createActor(config);

      enterFirstStep(actor, config);
      actor.send({ type: 'NEXT', tourId: config.id });
      actor.send({ type: 'PREV', tourId: config.id });

      expect(actor.getSnapshot().value).toBe('intro');
    });

    it('moves through a backward navigation state when PREV crosses pages', () => {
      const config = makeTour([
        makeSyncStep('intro', { page: '/home' }),
        makeSyncStep('billing', { page: '/billing' }),
      ]);
      const actor = createActor(config);

      enterFirstStep(actor, config);
      actor.send({ type: 'NEXT', tourId: config.id });
      actor.send({
        type: 'PAGE_CHANGED',
        page: '/billing',
        tourId: config.id,
      });
      actor.send({ type: 'PREV', tourId: config.id });

      expect(actor.getSnapshot().value).toBe('navigatingTo_intro');
      expect(actor.getSnapshot().context.currentPage).toBe('/home');

      actor.send({ type: 'PAGE_CHANGED', page: '/home', tourId: config.id });

      expect(actor.getSnapshot().value).toBe('intro');
    });

    it('blocks NEXT when canNext is false', () => {
      const config = makeTour([
        makeSyncStep('intro', { canNext: false }),
        makeSyncStep('details'),
      ]);
      const actor = createActor(config);

      enterFirstStep(actor, config);

      expect(actor.can({ type: 'NEXT', tourId: config.id })).toBe(false);

      actor.send({ type: 'NEXT', tourId: config.id });

      expect(actor.getSnapshot().value).toBe('intro');
    });

    it('blocks PREV when canPrev is false', () => {
      const config = makeTour([
        makeSyncStep('intro', { page: '/home' }),
        makeSyncStep('details', { page: '/home', canPrev: false }),
      ]);
      const actor = createActor(config);

      enterFirstStep(actor, config);
      actor.send({ type: 'NEXT', tourId: config.id });

      expect(actor.can({ type: 'PREV', tourId: config.id })).toBe(false);

      actor.send({ type: 'PREV', tourId: config.id });

      expect(actor.getSnapshot().value).toBe('details');
    });

    it('completes from the last sync step on NEXT', () => {
      const config = makeTour([makeSyncStep('final')]);
      const actor = createActor(config);

      enterFirstStep(actor, config);
      actor.send({ type: 'NEXT', tourId: config.id });

      expect(actor.getSnapshot().value).toBe('completed');
      expect(actor.getSnapshot().context).toMatchObject({
        currentPage: '',
        targetElement: '',
        title: '',
        content: '',
      });
    });
  });

  describe('skip and completion', () => {
    it('allows skipping from the initial navigation state when skipping is enabled', () => {
      const config = makeTour([makeSyncStep('intro')], { allowSkip: true });
      const actor = createActor(config);

      actor.send({ type: 'START_TOUR', tourId: config.id });
      actor.send({ type: 'SKIP_TOUR', tourId: config.id });

      expect(actor.getSnapshot().value).toBe('skipped');
      expect(actor.getSnapshot().context).toMatchObject({
        currentPage: '',
        targetElement: '',
        title: '',
        content: '',
      });
    });

    it('disables skipping entirely when allowSkip is false', () => {
      const config = makeTour([makeSyncStep('intro')], { allowSkip: false });
      const actor = createActor(config);

      enterFirstStep(actor, config);

      expect(actor.can({ type: 'SKIP_TOUR', tourId: config.id })).toBe(false);

      actor.send({ type: 'SKIP_TOUR', tourId: config.id });

      expect(actor.getSnapshot().value).toBe('intro');
    });

    it('disables skipping for a step when canSkip is false', () => {
      const config = makeTour([makeSyncStep('intro', { canSkip: false })], {
        allowSkip: true,
      });
      const actor = createActor(config);

      enterFirstStep(actor, config);

      expect(actor.can({ type: 'SKIP_TOUR', tourId: config.id })).toBe(false);
    });

    it('uses the current step canSkip setting for forward navigation states', () => {
      const blockedConfig = makeTour(
        [
          makeSyncStep('intro', { page: '/home', canSkip: false }),
          makeSyncStep('checkout', { page: '/checkout', canSkip: true }),
        ],
        { allowSkip: true }
      );
      const blockedActor = createActor(blockedConfig);

      enterFirstStep(blockedActor, blockedConfig);
      blockedActor.send({ type: 'NEXT', tourId: blockedConfig.id });

      expect(
        blockedActor.can({ type: 'SKIP_TOUR', tourId: blockedConfig.id })
      ).toBe(false);

      const allowedConfig = makeTour(
        [
          makeSyncStep('intro', { page: '/home', canSkip: true }),
          makeSyncStep('checkout', { page: '/checkout', canSkip: false }),
        ],
        { allowSkip: true }
      );
      const allowedActor = createActor(allowedConfig);

      enterFirstStep(allowedActor, allowedConfig);
      allowedActor.send({ type: 'NEXT', tourId: allowedConfig.id });

      expect(
        allowedActor.can({ type: 'SKIP_TOUR', tourId: allowedConfig.id })
      ).toBe(true);
    });

    it('completes from navigation states and clears display context', () => {
      const config = makeTour([
        makeSyncStep('intro', { page: '/home' }),
        makeSyncStep('checkout', { page: '/checkout' }),
      ]);
      const actor = createActor(config);

      enterFirstStep(actor, config);
      actor.send({ type: 'NEXT', tourId: config.id });
      actor.send({ type: 'END_TOUR', tourId: config.id });

      expect(actor.getSnapshot().value).toBe('completed');
      expect(actor.getSnapshot().context).toMatchObject({
        currentPage: '',
        targetElement: '',
        title: '',
        content: '',
      });
    });
  });

  describe('async steps', () => {
    it('moves through pending, processing, and success states with processing content', () => {
      const config = makeTour([makeAsyncStep('upload')]);
      const actor = createActor(config);

      enterFirstStep(actor, config);

      expect(actor.getSnapshot().value).toBe('upload_pending');
      expect(actor.getSnapshot().context).toMatchObject({
        title: 'upload pending title',
        content: 'upload pending content',
        targetElement: '[data-tour="upload-pending"]',
      });

      actor.send({ type: 'START_UPLOAD', tourId: config.id });

      expect(actor.getSnapshot().value).toBe('upload_processing');
      expect(actor.getSnapshot().context).toMatchObject({
        title: 'upload processing title',
        content: 'upload processing content',
        targetElement: '[data-tour="upload-processing"]',
      });

      actor.send({ type: 'UPLOAD_SUCCESS', tourId: config.id });

      expect(actor.getSnapshot().value).toBe('upload_success');
      expect(actor.getSnapshot().context).toMatchObject({
        title: 'upload success title',
        content: 'upload success content',
        targetElement: '[data-tour="upload-success"]',
      });
    });

    it('jumps directly from pending to success when processing content is omitted', () => {
      const config = makeTour([
        makeAsyncStep('review', {
          content: {
            pending: {
              targetElement: '[data-tour="review-pending"]',
              title: 'review pending title',
              content: 'review pending content',
            },
            success: {
              targetElement: '[data-tour="review-success"]',
              title: 'review success title',
              content: 'review success content',
            },
          },
        }),
      ]);
      const actor = createActor(config);

      enterFirstStep(actor, config);
      actor.send({ type: 'REVIEW_SUCCESS', tourId: config.id });

      expect(actor.getSnapshot().value).toBe('review_success');
      expect(actor.getSnapshot().context.title).toBe('review success title');
    });

    it('returns to pending on FAILED from processing and stays pending on FAILED from pending', () => {
      const config = makeTour([makeAsyncStep('upload')]);
      const actor = createActor(config);

      enterFirstStep(actor, config);
      actor.send({ type: 'START_UPLOAD', tourId: config.id });
      actor.send({ type: 'UPLOAD_FAILED', tourId: config.id });

      expect(actor.getSnapshot().value).toBe('upload_pending');

      actor.send({ type: 'UPLOAD_FAILED', tourId: config.id });

      expect(actor.getSnapshot().value).toBe('upload_pending');
    });

    it('advances from async success to the next step and completes when it is the final step', () => {
      const multiStepConfig = makeTour([
        makeAsyncStep('upload', { page: '/upload' }),
        makeSyncStep('done', { page: '/done' }),
      ]);
      const multiStepActor = createActor(multiStepConfig);

      enterFirstStep(multiStepActor, multiStepConfig);
      multiStepActor.send({ type: 'START_UPLOAD', tourId: multiStepConfig.id });
      multiStepActor.send({
        type: 'UPLOAD_SUCCESS',
        tourId: multiStepConfig.id,
      });
      multiStepActor.send({ type: 'NEXT', tourId: multiStepConfig.id });

      expect(multiStepActor.getSnapshot().value).toBe('navigatingTo_done');

      const finalConfig = makeTour([makeAsyncStep('upload')]);
      const finalActor = createActor(finalConfig);

      enterFirstStep(finalActor, finalConfig);
      finalActor.send({ type: 'START_UPLOAD', tourId: finalConfig.id });
      finalActor.send({ type: 'UPLOAD_SUCCESS', tourId: finalConfig.id });
      finalActor.send({ type: 'NEXT', tourId: finalConfig.id });

      expect(finalActor.getSnapshot().value).toBe('completed');
    });

    it('allows PREV from pending but not from processing or success', () => {
      const config = makeTour([
        makeSyncStep('intro', { page: '/home' }),
        makeAsyncStep('upload', { page: '/upload' }),
      ]);
      const actor = createActor(config);

      enterFirstStep(actor, config);
      actor.send({ type: 'NEXT', tourId: config.id });
      actor.send({
        type: 'PAGE_CHANGED',
        page: '/upload',
        tourId: config.id,
      });

      expect(actor.can({ type: 'PREV', tourId: config.id })).toBe(true);

      actor.send({ type: 'PREV', tourId: config.id });

      expect(actor.getSnapshot().value).toBe('navigatingTo_intro');

      actor.send({ type: 'PAGE_CHANGED', page: '/home', tourId: config.id });
      actor.send({ type: 'NEXT', tourId: config.id });
      actor.send({
        type: 'PAGE_CHANGED',
        page: '/upload',
        tourId: config.id,
      });
      actor.send({ type: 'START_UPLOAD', tourId: config.id });

      expect(actor.can({ type: 'PREV', tourId: config.id })).toBe(false);

      actor.send({ type: 'UPLOAD_SUCCESS', tourId: config.id });

      expect(actor.can({ type: 'PREV', tourId: config.id })).toBe(false);
    });

    it('honors async canPrev, canNext, and canSkip flags on the relevant substates', () => {
      const prevConfig = makeTour([
        makeSyncStep('intro', { page: '/home' }),
        makeAsyncStep('upload', { page: '/upload', canPrev: false }),
      ]);
      const prevActor = createActor(prevConfig);

      enterFirstStep(prevActor, prevConfig);
      prevActor.send({ type: 'NEXT', tourId: prevConfig.id });
      prevActor.send({
        type: 'PAGE_CHANGED',
        page: '/upload',
        tourId: prevConfig.id,
      });

      expect(prevActor.can({ type: 'PREV', tourId: prevConfig.id })).toBe(
        false
      );

      const nextConfig = makeTour([
        makeAsyncStep('upload', { canNext: false }),
        makeSyncStep('done'),
      ]);
      const nextActor = createActor(nextConfig);

      enterFirstStep(nextActor, nextConfig);
      nextActor.send({ type: 'START_UPLOAD', tourId: nextConfig.id });
      nextActor.send({ type: 'UPLOAD_SUCCESS', tourId: nextConfig.id });

      expect(nextActor.can({ type: 'NEXT', tourId: nextConfig.id })).toBe(
        false
      );

      nextActor.send({ type: 'NEXT', tourId: nextConfig.id });

      expect(nextActor.getSnapshot().value).toBe('upload_success');

      const skipConfig = makeTour(
        [makeAsyncStep('upload', { canSkip: false })],
        { allowSkip: true }
      );
      const skipActor = createActor(skipConfig);

      enterFirstStep(skipActor, skipConfig);
      expect(skipActor.can({ type: 'SKIP_TOUR', tourId: skipConfig.id })).toBe(
        false
      );

      skipActor.send({ type: 'START_UPLOAD', tourId: skipConfig.id });
      expect(skipActor.can({ type: 'SKIP_TOUR', tourId: skipConfig.id })).toBe(
        false
      );

      skipActor.send({ type: 'UPLOAD_SUCCESS', tourId: skipConfig.id });
      expect(skipActor.can({ type: 'SKIP_TOUR', tourId: skipConfig.id })).toBe(
        false
      );
    });

    it('uses custom async event names instead of the defaults', () => {
      const config = makeTour([
        makeAsyncStep('upload', {
          events: {
            start: 'BEGIN_UPLOAD',
            success: 'FINISH_UPLOAD',
            failed: 'RESET_UPLOAD',
          },
        }),
      ]);
      const actor = createActor(config);

      enterFirstStep(actor, config);
      actor.send({ type: 'START_UPLOAD', tourId: config.id });

      expect(actor.getSnapshot().value).toBe('upload_pending');

      actor.send({ type: 'BEGIN_UPLOAD', tourId: config.id });

      expect(actor.getSnapshot().value).toBe('upload_processing');

      actor.send({ type: 'RESET_UPLOAD', tourId: config.id });

      expect(actor.getSnapshot().value).toBe('upload_pending');

      actor.send({ type: 'FINISH_UPLOAD', tourId: config.id });

      expect(actor.getSnapshot().value).toBe('upload_success');
    });

    it('auto-advances from async success when PAGE_CHANGED reaches the next page', () => {
      const config = makeTour([
        makeAsyncStep('upload', { page: '/login' }),
        makeSyncStep('dashboard', { page: '/dashboard' }),
      ]);
      const actor = createActor(config);

      enterFirstStep(actor, config);
      actor.send({ type: 'START_UPLOAD', tourId: config.id });
      actor.send({ type: 'UPLOAD_SUCCESS', tourId: config.id });

      actor.send({
        type: 'PAGE_CHANGED',
        page: '/dashboard',
        tourId: config.id,
      });

      expect(actor.getSnapshot().value).toBe('dashboard');
      expect(actor.getSnapshot().context).toMatchObject({
        currentPage: '/dashboard',
        targetElement: '[data-tour="dashboard"]',
        title: 'dashboard title',
        content: 'dashboard content',
      });
    });

    it('navigates from async success into the next async pending state across pages', () => {
      const config = makeTour([
        makeAsyncStep('upload', { page: '/upload' }),
        makeAsyncStep('review', { page: '/review' }),
      ]);
      const actor = createActor(config);

      enterFirstStep(actor, config);
      actor.send({ type: 'START_UPLOAD', tourId: config.id });
      actor.send({ type: 'UPLOAD_SUCCESS', tourId: config.id });
      actor.send({ type: 'NEXT', tourId: config.id });

      expect(actor.getSnapshot().value).toBe('navigatingTo_review_pending');

      actor.send({
        type: 'PAGE_CHANGED',
        page: '/review',
        tourId: config.id,
      });

      expect(actor.getSnapshot().value).toBe('review_pending');
      expect(actor.getSnapshot().context.title).toBe('review pending title');
    });
  });

  describe('guards and navigation resolution', () => {
    it('ignores PAGE_CHANGED when the page does not match the navigation target', () => {
      const config = makeTour([
        makeSyncStep('intro', { page: '/home' }),
        makeSyncStep('checkout', { page: '/checkout' }),
      ]);
      const actor = createActor(config);

      enterFirstStep(actor, config);
      actor.send({ type: 'NEXT', tourId: config.id });
      actor.send({
        type: 'PAGE_CHANGED',
        page: '/profile',
        tourId: config.id,
      });

      expect(actor.getSnapshot().value).toBe('navigatingTo_checkout');
    });

    it('ignores guarded NEXT transitions when the tourId does not match', () => {
      const config = makeTour([
        makeSyncStep('intro', { page: '/home' }),
        makeSyncStep('checkout', { page: '/checkout' }),
      ]);
      const actor = createActor(config);

      enterFirstStep(actor, config);
      actor.send({ type: 'NEXT', tourId: 'another-tour' });

      expect(actor.getSnapshot().value).toBe('intro');
    });

    it('ignores PREV transitions when the tourId does not match', () => {
      const config = makeTour([
        makeSyncStep('intro', { page: '/home' }),
        makeSyncStep('details', { page: '/home' }),
      ]);
      const actor = createActor(config);

      enterFirstStep(actor, config);
      actor.send({ type: 'NEXT', tourId: config.id });
      actor.send({ type: 'PREV', tourId: 'another-tour' });

      expect(actor.getSnapshot().value).toBe('details');
    });

    it('keeps navigation states pending when PAGE_CHANGED uses a different tourId', () => {
      const config = makeTour([
        makeSyncStep('intro', { page: '/home' }),
        makeSyncStep('checkout', { page: '/checkout' }),
      ]);
      const actor = createActor(config);

      enterFirstStep(actor, config);
      actor.send({ type: 'NEXT', tourId: config.id });
      actor.send({
        type: 'PAGE_CHANGED',
        page: '/checkout',
        tourId: 'another-tour',
      });

      expect(actor.getSnapshot().value).toBe('navigatingTo_checkout');
    });

    it('ignores manual NEXT and PREV while already in navigation states', () => {
      const config = makeTour([
        makeSyncStep('intro', { page: '/home' }),
        makeSyncStep('checkout', { page: '/checkout' }),
      ]);
      const actor = createActor(config);

      enterFirstStep(actor, config);
      actor.send({ type: 'NEXT', tourId: config.id });

      expect(actor.getSnapshot().value).toBe('navigatingTo_checkout');

      actor.send({ type: 'NEXT', tourId: config.id });

      expect(actor.getSnapshot().value).toBe('navigatingTo_checkout');

      actor.send({
        type: 'PAGE_CHANGED',
        page: '/checkout',
        tourId: config.id,
      });

      expect(actor.getSnapshot().value).toBe('checkout');

      actor.send({ type: 'PREV', tourId: config.id });

      expect(actor.getSnapshot().value).toBe('navigatingTo_intro');

      actor.send({ type: 'PREV', tourId: config.id });

      expect(actor.getSnapshot().value).toBe('navigatingTo_intro');
    });
  });

  describe('autoAdvance', () => {
    it('auto-advances to the next step on the same page after the timeout', () => {
      vi.useFakeTimers();

      const config = makeTour([
        makeSyncStep('intro', { page: '/home', autoAdvance: 300 }),
        makeSyncStep('details', { page: '/home' }),
      ]);
      const actor = createActor(config);

      enterFirstStep(actor, config);
      vi.advanceTimersByTime(300);

      expect(actor.getSnapshot().value).toBe('details');
      expect(getLastEventType(actor)).toBe('AUTO_ADVANCE');
    });

    it('auto-advances into a navigation state when the next step is on another page', () => {
      vi.useFakeTimers();

      const config = makeTour([
        makeSyncStep('intro', { page: '/home', autoAdvance: 300 }),
        makeSyncStep('checkout', { page: '/checkout' }),
      ]);
      const actor = createActor(config);

      enterFirstStep(actor, config);
      vi.advanceTimersByTime(300);

      expect(actor.getSnapshot().value).toBe('navigatingTo_checkout');
      expect(actor.getSnapshot().context.currentPage).toBe('/checkout');
    });

    it('clears the auto-advance timer when the tour is ended or skipped', () => {
      vi.useFakeTimers();

      const endConfig = makeTour([
        makeSyncStep('intro', { autoAdvance: 300 }),
        makeSyncStep('details'),
      ]);
      const endActor = createActor(endConfig);

      enterFirstStep(endActor, endConfig);
      endActor.send({ type: 'END_TOUR', tourId: endConfig.id });
      vi.advanceTimersByTime(1000);

      expect(endActor.getSnapshot().value).toBe('completed');

      const skipConfig = makeTour([
        makeSyncStep('intro', { autoAdvance: 300 }),
        makeSyncStep('details'),
      ]);
      const skipActor = createActor(skipConfig);

      enterFirstStep(skipActor, skipConfig);
      skipActor.send({ type: 'SKIP_TOUR', tourId: skipConfig.id });
      vi.advanceTimersByTime(1000);

      expect(skipActor.getSnapshot().value).toBe('skipped');
    });

    it('clears the pending auto-advance timer after manual navigation', () => {
      vi.useFakeTimers();

      const config = makeTour([
        makeSyncStep('intro', { page: '/home', autoAdvance: 300 }),
        makeSyncStep('details', { page: '/home' }),
        makeSyncStep('final', { page: '/home' }),
      ]);
      const actor = createActor(config);

      enterFirstStep(actor, config);
      actor.send({ type: 'NEXT', tourId: config.id });

      expect(actor.getSnapshot().value).toBe('details');

      vi.advanceTimersByTime(1000);

      expect(actor.getSnapshot().value).toBe('details');
    });
  });

  describe('viewportId behavior', () => {
    it('updates viewportId while moving through generated navigation states', () => {
      const config = makeTour([
        makeSyncStep('intro', {
          page: '/home',
          viewportId: 'home-viewport',
        }),
        makeSyncStep('checkout', {
          page: '/checkout',
          viewportId: 'checkout-viewport',
        }),
      ]);
      const actor = createActor(config);

      actor.send({ type: 'START_TOUR', tourId: config.id });

      expect(actor.getSnapshot().context.viewportId).toBe('home-viewport');

      actor.send({ type: 'PAGE_CHANGED', page: '/home', tourId: config.id });

      expect(actor.getSnapshot().context.viewportId).toBe('home-viewport');

      actor.send({ type: 'NEXT', tourId: config.id });

      expect(actor.getSnapshot().value).toBe('navigatingTo_checkout');
      expect(actor.getSnapshot().context.viewportId).toBe('checkout-viewport');

      actor.send({
        type: 'PAGE_CHANGED',
        page: '/checkout',
        tourId: config.id,
      });

      expect(actor.getSnapshot().context.viewportId).toBe('checkout-viewport');
    });

    it('clears viewportId when the tour completes or is skipped', () => {
      const completeConfig = makeTour([
        makeSyncStep('intro', { viewportId: 'main-viewport' }),
      ]);
      const completeActor = createActor(completeConfig);

      enterFirstStep(completeActor, completeConfig);
      completeActor.send({ type: 'NEXT', tourId: completeConfig.id });

      expect(completeActor.getSnapshot().value).toBe('completed');
      expect(completeActor.getSnapshot().context.viewportId).toBeUndefined();

      const skipConfig = makeTour(
        [makeSyncStep('intro', { viewportId: 'main-viewport' })],
        { allowSkip: true }
      );
      const skipActor = createActor(skipConfig);

      enterFirstStep(skipActor, skipConfig);
      skipActor.send({ type: 'SKIP_TOUR', tourId: skipConfig.id });

      expect(skipActor.getSnapshot().value).toBe('skipped');
      expect(skipActor.getSnapshot().context.viewportId).toBeUndefined();
    });
  });
});
