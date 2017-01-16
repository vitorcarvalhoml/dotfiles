# List all files colorized in long format
# Get OS X Software Updates, and update installed Ruby gems, Homebrew, npm, and their installed packages
alias update='sudo softwareupdate -i -a; brew update; brew upgrade; brew cleanup'

# Flush Directory Service cache
alias dnsflush="dscacheutil -flushcache && killall -HUP mDNSResponder"

# Simple tree
alias tree="tree -C"
alias t1="tree -L 1"
