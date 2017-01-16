echo "env scripts"
BASEDIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd )"

export LATEX_PATH=/usr/local/texlive/2016/bin/x86_64-darwin

export PATH="/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:$LATEX_PATH:"
export PATH="./bin:/usr/local/bin:/usr/local/sbin:$ZSH/bin:$PATH"
export MANPATH="/usr/local/man:/usr/local/mysql/man:/usr/local/git/man:$MANPATH"

export VAGRANT_DEFAULT_PROVIDER=virtualbox
export LANG=en_US.UTF-8
export LSCOLORS="Gxfxcxdxbxegedabagacad"
