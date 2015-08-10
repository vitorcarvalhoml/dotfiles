echo ".env scripts"
BASEDIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd )"
export EDITOR='atom'
export GREP_OPTIONS='—color=auto'
export PATH="/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"
export PATH="./bin:/usr/local/bin:/usr/local/sbin:$ZSH/bin:$PATH"
export MANPATH="/usr/local/man:/usr/local/mysql/man:/usr/local/git/man:$MANPATH"
export ANSIBLE_CONFIG=${BASEDIR}/Documents/Ansible/ansible.cfg
export VAGRANT_DEFAULT_PROVIDER=vmware_fusion
export LANG=en_US.UTF-8
