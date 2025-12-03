import {
  FC,
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  OnProgress,
  RegisterTask,
  Task,
  UnregisterTask,
  initialProgress,
} from './types';

type AsyncTaskListContextType = {
  readonly registerTask: (register: RegisterTask) => void;
  readonly tasks: ReadonlyArray<Task>;
};

const AsyncTaskListContext = createContext<AsyncTaskListContextType>({
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  registerTask: () => () => {},
  tasks: [],
});

export function useRegisterAsyncTask() {
  return useContext(AsyncTaskListContext).registerTask;
}

export function useAsyncTasks() {
  return useContext(AsyncTaskListContext).tasks;
}

export const AsyncTaskListProvider: FC<PropsWithChildren> = ({ children }) => {
  const [tasks, setTasks] = useState<ReadonlyArray<Task>>([]);

  const registerTask = useCallback((register: RegisterTask) => {
    const id = crypto.randomUUID();

    const onProgress: OnProgress = (progress) => {
      setTasks((existingTaskStates) => {
        const index = existingTaskStates.findIndex((task) => task.id === id);

        if (index >= 0) {
          const task = existingTaskStates[index];
          return existingTaskStates.with(index, { ...task, progress });
        }

        return existingTaskStates;
      });
    };

    const onUnregister: UnregisterTask = () => {
      setTasks((p) => p.filter((task) => task.id !== id));
    };

    const registeredProps = register(onProgress, onUnregister, id);

    setTasks((p) => [
      ...p,
      {
        id,
        progress: initialProgress,
        initialized: false,
        ...registeredProps,
      },
    ]);
  }, []);

  const markTasksAsInitialized = useCallback((ids: ReadonlyArray<string>) => {
    setTasks((p) =>
      p.map((task) => {
        if (ids.includes(task.id)) {
          return { ...task, initialized: true, initialize: null };
        }

        return task;
      }),
    );
  }, []);

  // Initialize uninitializedTasks
  useEffect(() => {
    const uninitialized = tasks.filter((task) => !task.initialized);
    if (uninitialized.length) {
      const uninitializedIds = uninitialized.map((task) => task.id);
      uninitialized.forEach((task) =>
        // Make sure the task does not make any synchronous or schedule Micro task
        // calls to the progress or unregistering hooks.
        // Schedule the startup in macro task.
        setTimeout(task.initialize),
      );
      markTasksAsInitialized(uninitializedIds);
    }
  }, [tasks, markTasksAsInitialized]);

  const value = useMemo(() => ({ registerTask, tasks }), [registerTask, tasks]);

  return (
    <AsyncTaskListContext.Provider value={value}>
      {children}
    </AsyncTaskListContext.Provider>
  );
};
