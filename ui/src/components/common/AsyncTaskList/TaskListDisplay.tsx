import { FC, Fragment } from 'react';
import { HorizontalSeparator } from '../../../layoutComponents';
import { useAsyncTasks } from './AsyncTaskList';
import { TaskWithProgressBar } from './TaskWithProgressBar';

export const TaskListDisplay: FC = () => {
  const tasks = useAsyncTasks();

  if (tasks.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-5 left-1/2 mt-1 flex w-80 -translate-x-1/2 flex-col rounded border border-border-hsl-city-bike-yellow bg-background-hsl-city-bike-yellow p-3 shadow-lg">
      {tasks.map((task, i) => (
        <Fragment key={task.id}>
          <TaskWithProgressBar
            body={task.body}
            onCancel={task.onCancel}
            onConfirmCancellation={task.onConfirmCancellation}
            progress={task.progress}
          />

          {i !== tasks.length - 1 && <HorizontalSeparator />}
        </Fragment>
      ))}
    </div>
  );
};
