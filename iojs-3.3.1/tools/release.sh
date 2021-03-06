#!/usr/bin/env bash

# To promote and sign a release that has been prepared by the build slaves, use:
#  release.sh

# To _only_ sign an existing release, use:
#  release.sh -s vx.y.z

set -e

webhost=direct.iojs.org
webuser=dist
promotablecmd=dist-promotable
promotecmd=dist-promote
signcmd=dist-sign


################################################################################
## Select a GPG key to use

echo "# Selecting GPG key ..."

gpgkey=$(gpg --list-secret-keys | grep '^sec' | awk -F'( +|/)' '{print $3}')
keycount=$(echo $gpgkey | wc -w)

if [ $keycount -eq 0 ]; then
  echo 'Need at least one GPG key, please make one with `gpg --gen-key`'
  echo 'You will also need to submit your key to a public keyserver, e.g.'
  echo '  https://sks-keyservers.net/i/#submit'
  exit 1
elif [ $keycount -ne 1 ]; then
  echo -e 'You have multiple GPG keys:\n'

  gpg --list-secret-keys

  while true; do
    echo $gpgkey | awk '{ for(i = 1; i <= NF; i++) { print i ") " $i; } }'
    echo -n 'Select a key: '
    read keynum

    if $(test "$keynum" -eq "$keynum" > /dev/null 2>&1); then
      _gpgkey=$(echo $gpgkey | awk '{ print $'${keynum}'}')
      keycount=$(echo $_gpgkey | wc -w)
      if [ $keycount -eq 1 ]; then
        echo ""
        gpgkey=$_gpgkey
        break
      fi
    fi
  done
fi

gpgfing=$(gpg --fingerprint $gpgkey | grep 'Key fingerprint =' | awk -F' = ' '{print $2}' | tr -d ' ')

if ! test "$(grep $gpgfing README.md)"; then
  echo 'Error: this GPG key fingerprint is not listed in ./README.md'
  exit 1
fi

echo "Using GPG key: $gpgkey"
echo "  Fingerprint: $gpgfing"


################################################################################
## Create and sign checksums file for a given version

function sign {
  echo -e "\n# Creating SHASUMS256.txt ..."

  local version=$1

  gpgtagkey=$(git tag -v $version 2>&1 | grep 'key ID' | awk '{print $NF}')

  if [ "X${gpgtagkey}" == "X" ]; then
    echo "Could not find signed tag for \"${version}\""
    exit 1
  fi

  if [ "${gpgtagkey}" != "${gpgkey}" ]; then
    echo "GPG key for \"${version}\" tag is not yours, cannot sign"
  fi

  shapath=$(ssh ${webuser}@${webhost} $signcmd iojs $version)

  if ! [[ ${shapath} =~ ^/.+/SHASUMS256.txt$ ]]; then
    echo 'Error: No SHASUMS file returned by sign!'
    exit 1
  fi

  echo -e "\n# Signing SHASUMS for ${version}..."

  shafile=$(basename $shapath)
  shadir=$(dirname $shapath)
  tmpdir="/tmp/_iojs_release.$$"

  mkdir -p $tmpdir

  scp ${webuser}@${webhost}:${shapath} ${tmpdir}/${shafile}

  gpg --default-key $gpgkey --clearsign ${tmpdir}/${shafile}

  echo "Wrote to ${tmpdir}/"

  echo -e "Your signed ${shafile}.asc:\n"

  cat ${tmpdir}/${shafile}.asc

  echo ""

  while true; do
    echo -n "Upload files? [y/n] "
    yorn=""
    read yorn

    if [ "X${yorn}" == "Xn" ]; then
      break
    fi

    if [ "X${yorn}" == "Xy" ]; then
      scp ${tmpdir}/${shafile} ${tmpdir}/${shafile}.asc ${webuser}@${webhost}:${shadir}/
      break
    fi
  done

  rm -rf $tmpdir
}


if [ "X${1}" == "X-s" ]; then
  if [ "X${2}" == "X" ]; then
    echo "Please supply a version string to sign"
    exit 1
  fi

  sign $2
  exit 0
fi


# else: do a normal release & promote

################################################################################
## Look for releases to promote

echo -e "\n# Checking for releases ..."

promotable=$(ssh ${webuser}@${webhost} $promotablecmd iojs)

if [ "X${promotable}" == "X" ]; then
  echo "No releases to promote!"
  exit 0
fi

echo -e "Found the following releases / builds ready to promote:\n"
echo "$promotable" | sed 's/^/ * /'
echo ""

versions=$(echo "$promotable" | cut -d: -f1)

################################################################################
## Promote releases

for version in $versions; do
  while true; do
    files=$(echo "$promotable" | grep "^${version}" | sed 's/^'${version}': //')
    echo -n "Promote ${version} files (${files})? [y/n] "
    yorn=""
    read yorn

    if [ "X${yorn}" == "Xn" ]; then
      break
    fi

    if [ "X${yorn}" != "Xy" ]; then
      continue
    fi

    echo -e "\n# Promoting ${version}..."

    ssh ${webuser}@${webhost} $promotecmd iojs $version

    sign $version

    break
  done
done
