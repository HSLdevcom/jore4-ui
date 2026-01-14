import { t } from 'i18next';
import { ChangeEvent, DragEventHandler, FC, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { Row } from '../../../layoutComponents';
import { SimpleButton } from '../../../uiComponents';
import { showDangerToast } from '../../../utils';

type DragZoneClassNames = {
  readonly dragZone: string;
  readonly outerCircle: string;
  readonly iconColor: string;
};

type FileImportDragAndDropProps = {
  readonly fileList: ReadonlyArray<File> | null;
  readonly setFileList: (fileList: File[]) => void;
};

const isCorrectFormatFile = (file: File) =>
  // exp files have empty file type, just use filename extension for checking instead
  file.type === 'text/csv' || file.name.split('.').pop() === 'exp';

export const FileImportDragAndDrop: FC<FileImportDragAndDropProps> = ({
  fileList,
  setFileList,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const defaultClassNames: DragZoneClassNames = {
    dragZone: 'bg-gray-100 border-dashed',
    outerCircle: 'bg-gray-100',
    iconColor: 'text-gray-300',
  };

  const onDragClassNames: DragZoneClassNames = {
    dragZone: 'bg-blue-100',
    outerCircle: 'bg-blue-50',
    iconColor: 'text-gray-600',
  };

  const [isDragging, setIsDragging] = useState(false);

  const handleOnDragOver: DragEventHandler = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleOnDragLeave: DragEventHandler = (event) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleOnDrop: DragEventHandler = (event) => {
    event.preventDefault();
    setIsDragging(false);

    const correctFormatFiles = Array.from(event.dataTransfer.files).filter(
      isCorrectFormatFile,
    );
    const incorrectFormatFiles = Array.from(event.dataTransfer.files).filter(
      (file) => !isCorrectFormatFile(file),
    );

    if (incorrectFormatFiles.length) {
      showDangerToast(t('import.incorrectFileFormat'));
    }

    setFileList(
      fileList?.length
        ? fileList.concat(correctFormatFiles)
        : correctFormatFiles,
    );
  };

  const handleOnClick = () => {
    inputRef.current?.click();
  };

  const handleOnFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return;
    }

    setFileList(Array.from(e.target.files));
  };

  const classNames = isDragging ? onDragClassNames : defaultClassNames;

  return (
    <div
      className={twMerge(
        'my-8 rounded-md border-4 border-blue-200 p-8',
        classNames.dragZone,
      )}
      onDragLeave={handleOnDragLeave}
      onDragOver={handleOnDragOver}
      onDrop={handleOnDrop}
    >
      {!!fileList?.length && <h5>{t('import.filesToUpload')}</h5>}
      <ul>
        {fileList?.map((file) => (
          <li key={file.name}>{file.name}</li>
        ))}
      </ul>
      <Row className="flex justify-center">
        <div
          className={twMerge(
            'relative h-72 w-72 cursor-pointer rounded-full p-5 text-center',
            classNames.outerCircle,
          )}
        >
          {/* TODO: Needs proper support accessibility. */}
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label
            htmlFor="file-upload-input"
            className="absolute top-6 left-6 flex h-60 w-60 cursor-pointer items-center justify-center rounded-full bg-white p-5 text-center"
          >
            <i
              className={twMerge(
                'icon-calendar text-9xl',
                classNames.iconColor,
              )}
            />
            <input
              id="file-upload-input"
              type="file"
              accept="text/csv,.exp"
              onChange={handleOnFileChange}
              multiple
              className="hidden"
              ref={inputRef}
            />
          </label>
        </div>
      </Row>
      <Row className="flex items-center justify-center">
        <span className="mr-2 font-bold text-gray-700">{`${t(
          'import.dragAndDrop',
        )}`}</span>
        <SimpleButton onClick={handleOnClick}>
          {t('import.browse')}
        </SimpleButton>
      </Row>
    </div>
  );
};
