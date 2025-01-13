#!/usr/bin/env bash

set -euo pipefail

compose_folder="../docker/"
compose_file_prefix="docker-compose."
compose_custom_file="${compose_folder}${compose_file_prefix}custom.yml"

# Capture the entire output of the script, stripping ANSI color codes
output=$(./check-for-new-image-versions.sh | sed "s/\x1B\[[0-9;]*[a-zA-Z]//g")

# Define the regex to match the lines
regex="^hsldevcom\/([^[:space:]]+) does not use newest image in ([a-zA-Z0-9._-]+(\.[a-zA-Z0-9]+)?), uses\s+([A-Za-z0-9_-]+)\s+newest is ([A-Za-z0-9_-]+)$"

# Split the output into lines and process each line
while IFS= read -r line; do
  echo "Processing line: $line"

  # Apply the regex to capture the groups
  if [[ $line =~ $regex ]]; then
      image_prefix="${BASH_REMATCH[1]}"
      file_name="${BASH_REMATCH[2]}"
      old_version="${BASH_REMATCH[4]}"
      newest_version="${BASH_REMATCH[5]}"

      # Output the captured groups
      echo "Captured image_prefix: $image_prefix"
      echo "Captured file_name: $file_name"
      echo "Captured old_version: $old_version"
      echo "Captured newest_version: $newest_version"

      # Construct the path to the docker-compose file
      compose_file="${compose_folder}${compose_file_prefix}${file_name}"

      # Check if the compose file exists
      if [[ -f "$compose_file" ]]; then
        echo "Updating file: $compose_file"

        # Debug: Print the content of the file before replacement
        echo "Before replacement, the file content is:"
        grep "${image_prefix}--${old_version}" "$compose_file"

        # Account for single quotes around image tags in the YAML file
        sed -i.bak "s|${image_prefix}--${old_version}|${image_prefix}--${newest_version}|g" "$compose_file"
        echo "SED: s|${image_prefix}--${old_version}|${image_prefix}--${newest_version}|g"

        if ! grep -q "${image_prefix}--${old_version}" "$compose_file"; then
          echo "Successfully replaced ${image_prefix}--${old_version} with ${image_prefix}--${newest_version} in $compose_file"
         rm "$compose_file.bak"
        else
          echo "No replacement occurred. The old version still exists in $compose_file"
          # Debug: Output the content after the failed replacement
          echo "After replacement attempt, the file content is:"
          grep "${image_prefix}" "$compose_file"
         #mv "$compose_file.bak" "$compose_file"

        fi
      else
        echo "File not found: $compose_file"
      fi
  else
      echo "Line did not match the pattern: $line"
  fi
done <<< "$output"
