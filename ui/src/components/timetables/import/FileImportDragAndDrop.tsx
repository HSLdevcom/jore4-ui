import { t } from 'i18next';
import { ChangeEvent, useRef, useState } from 'react';
import { Row } from '../../../layoutComponents';
import { SimpleButton } from '../../../uiComponents';

interface DragZoneClassNames {
  dragZone: string;
  outerCircle: string;
  iconColor: string;
}

interface Props {
  fileList: File[] | null;
  setFileList: (fileList: File[]) => void;
}

export const FileImportDragAndDrop = ({ fileList, setFileList }: Props) => {
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

  const [classNames, setClassNames] = useState(defaultClassNames);

  const handleDragOver = (event: React.DragEvent) => {
    setClassNames(onDragClassNames);
    event.preventDefault();
  };

  const handleOnDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setClassNames(defaultClassNames);
  };

  const handleDrop = (event: React.DragEvent) => {
    setClassNames(defaultClassNames);
    event.preventDefault();

    const csvFiles = Array.from(event.dataTransfer.files).filter(
      (file) => file.type === 'text/csv',
    );

    setFileList(fileList?.length ? fileList.concat(csvFiles) : csvFiles);
  };
  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return;
    }

    setFileList(Array.from(e.target.files));
  };

  return (
    <div
      className={`my-8 rounded-md border-4 border-blue-200 p-8 ${classNames.dragZone}`}
      onDragLeave={handleOnDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {!!fileList?.length && <h5>{t('import.filesToUpload')}</h5>}
      <ul>
        {fileList?.map((file) => (
          <li key={file.name}>{file.name}</li>
        ))}
      </ul>
      <Row className="flex justify-center">
        <div
          className={`relative h-72 w-72 cursor-pointer rounded-full ${classNames.outerCircle} p-5 text-center`}
        >
          <label
            htmlFor="file-upload-input"
            className="absolute top-6 left-6 flex h-60 w-60 cursor-pointer items-center justify-center rounded-full bg-white p-5 text-center"
          >
            <i className={`icon-calendar text-9xl ${classNames.iconColor}`} />
            <input
              id="file-upload-input"
              type="file"
              accept="text/csv"
              onChange={handleFileChange}
              multiple
              className="hidden"
              ref={inputRef}
            />
          </label>
        </div>
      </Row>
      <Row className="flex items-center justify-center">
        <span className="mr-2 font-bold text-gray-700">{`${t(
          'import.dragAndDropText',
        )}`}</span>
        <SimpleButton onClick={handleClick}>{t('import.browse')}</SimpleButton>
      </Row>
    </div>
  );
};
