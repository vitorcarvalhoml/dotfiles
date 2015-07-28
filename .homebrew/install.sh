#!/bin/sh
#
# Homebrew
#
# This installs some of the common dependencies needed (or at least desired)
# using Homebrew.
echo ".homebrew scripts"
# Ask for the administrator password upfront.
sudo -v

# Check for Homebrew
if test ! $(which brew)
then
  echo "  Installing Homebrew for you."
  ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
fi

# Keep-alive: update existing `sudo` time stamp until the script has finished.
while true; do sudo -n true; sleep 60; kill -0 "$$" || exit; done 2>/dev/null &

# Make sure we’re using the latest Homebrew.
brew update

# Upgrade any already-installed formulae.
brew upgrade --all
# Taping brew repos
brew tap homebrew/versions
brew tap caskroom/versions
# Install more recent versions of some OS X tools.
brew install vim --override-system-vi
brew install homebrew/dupes/grep
brew install homebrew/dupes/openssh
brew install homebrew/dupes/screen

# Install homebrew packages
brew install ansible awscli curl htop ssh-copy-id aria2 httpie nmap packer terraform youtube-dl p7zip tree findutils speedtest_cli
# Install more recent versions of some OS X tools.
brew install homebrew/dupes/screen
brew install homebrew/dupes/openssh
brew install homebrew/dupes/grep
# Install `wget` with IRI support.
brew install wget --with-iri

# Install homebrew cask
brew tap caskroom/cask
brew install brew-cask
brew cask install atom
brew cask install little-snitch
open -a /opt/homebrew-cask/Caskroom/little-snitch/3.5.3/Little\ Snitch\ Installer.app
brew cask install lastpass
open -a /opt/homebrew-cask/Caskroom/lastpass/latest/LastPass\ Installer.app/
brew cask install --appdir=/Applications megasync
brew cask install google-chrome
brew cask install spotify
brew cask install alfred
brew cask install 1password
brew cask install slack
brew cask install the-unarchiver
brew cask install cleanmymac
brew cask install cinch
brew cask install teamviewer
brew cask install iterm2
brew cask install libreoffice
brew cask install transmission
brew cask install emby-server
brew cask install evernote
brew cask install steam
brew cask install istat-menus
brew cask install chrome-remote-desktop-host
brew cask install vlc

# Remove outdated versions from the cellar.
brew cleanup

exit 0
