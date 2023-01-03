export const downloadFile = (data: Blob, fileName: string) => {
  // File download hack from here:
  // https://stackoverflow.com/a/53230807

  // Create file link in browser's memory
  const href = URL.createObjectURL(data);

  // Create "a" HTML element with href to file & click
  const link = document.createElement('a');
  link.href = href;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();

  // Clean up "a" element & remove ObjectURL
  document.body.removeChild(link);
  URL.revokeObjectURL(href);
};
