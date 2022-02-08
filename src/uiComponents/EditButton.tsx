import React from 'react';
import { MdModeEdit } from 'react-icons/md';
import { Link } from 'react-router-dom';

// Only support href for now,
// implement onClick if needed
interface Props {
  href: string;
}

export const EditButton: React.FC<Props> = ({ href }) => {
  return (
    <Link to={href}>
      <div className="ml-5 rounded-full border border-grey bg-white">
        <MdModeEdit className="m-2 text-3xl text-tweaked-brand" />
      </div>
    </Link>
  );
};
