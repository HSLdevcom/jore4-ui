type AfterSpecHandlerFn = (
  spec: Cypress.Spec,
  results: CypressCommandLine.RunResult,
) => void | Promise<void>;

type AfterRunHandlerFn = (
  results:
    | CypressCommandLine.CypressRunResult
    | CypressCommandLine.CypressFailedRunResult,
) => void | Promise<void>;

type BeforeRunHandlerFn = (
  runDetails: Cypress.BeforeRunDetails,
) => void | Promise<void>;

// The compositeOn supports only events that are used by multiple plugins, i.e.
// currently (2025-06) cypress-split and cypress-ctrf-json-reporter
export class CompositeCypressEventHandler {
  private compositeHandlers: {
    'after:spec': AfterSpecHandlerFn[];
    'before:run': BeforeRunHandlerFn[];
    'after:run': AfterRunHandlerFn[];
  };

  constructor(on: Cypress.PluginEvents) {
    this.compositeHandlers = {
      'after:spec': [],
      'after:run': [],
      'before:run': [],
    };

    on('after:spec', this.onAfterSpec.bind(this));
    on('before:run', this.onBeforeRun.bind(this));
    on('after:run', this.onAfterRun.bind(this));
  }

  on(task: string, fn: unknown): void {
    switch (task) {
      case 'after:spec': {
        this.compositeHandlers['after:spec'].push(fn as AfterSpecHandlerFn);
        break;
      }
      case 'before:run': {
        this.compositeHandlers['before:run'].push(fn as BeforeRunHandlerFn);
        break;
      }
      case 'after:run': {
        this.compositeHandlers['after:run'].push(fn as AfterRunHandlerFn);
        break;
      }
      default: {
        throw new Error(
          `This compositeOn does not support handlers of type ${task}!`,
        );
      }
    }
  }

  private async onAfterSpec(
    spec: Cypress.Spec,
    results: CypressCommandLine.RunResult,
  ): Promise<void> {
    await Promise.all(
      this.compositeHandlers['after:spec'].map((handler) =>
        handler.call(null, spec, results),
      ),
    );
  }

  private async onBeforeRun(
    runDetails: Cypress.BeforeRunDetails,
  ): Promise<void> {
    await Promise.all(
      this.compositeHandlers['before:run'].map((handler) =>
        handler.call(null, runDetails),
      ),
    );
  }

  private async onAfterRun(
    results:
      | CypressCommandLine.CypressRunResult
      | CypressCommandLine.CypressFailedRunResult,
  ): Promise<void> {
    await Promise.all(
      this.compositeHandlers['after:run'].map((handler) =>
        handler.call(null, results),
      ),
    );
  }
}
