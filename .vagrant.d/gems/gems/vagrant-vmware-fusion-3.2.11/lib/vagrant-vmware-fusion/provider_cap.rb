# RubyEncoder v2.0
def hc_enc_load_error(code, message)
  # License is required to run this code.
  if code == 9
    STDERR.puts "The license you're using has expired. This is because you"
    STDERR.puts "were using a trial or beta license. Please contact support"
    STDERR.puts "to renew your license."
  elsif code == 13
    STDERR.puts "A valid license is required to run the Vagrant VMware"
    STDERR.puts "provider. Please visit http://www.vagrantup.com to purchase"
    STDERR.puts "a license. Once you purchase a license, you can install it"
    STDERR.puts "using `vagrant plugin license`."
  elsif code == 6
    STDERR.puts "The Vagrant VMware provider requires a valid license"
    STDERR.puts "to run. The license provided is invalid. Please make sure you"
    STDERR.puts "downloaded the proper license. If you believe you're seeing"
    STDERR.puts "this message in error, please contact support."
  elsif code == 20
    STDERR.puts "The license you're using for the Vagrant VMware provider"
    STDERR.puts "requires an internet connection to run. Most licenses are not"
    STDERR.puts "created this way so if you feel this is an error, please contact"
    STDERR.puts "support."
  else
    STDERR.puts "An unexpected error occurred while loading the Vagrant VMware"
    STDERR.puts "provider. Please contact support with the following"
    STDERR.puts "error code: '#{code}'."
  end

  exit 1
end
_d = _d0 = File.expand_path(File.dirname(__FILE__)); while 1 do _f = _d + '/rgloader/loader.rb'; break if File.exist?(_f); _d1 = File.dirname(_d); if _d1 == _d then 
STDERR.puts "Unable to load a protected HashiCorp script! This usually happens if"
STDERR.puts "you have a broken installation of Vagrant or are attempting to run"
STDERR.puts "Vagrant outside of the installer. Please install Vagrant properly and"
STDERR.puts "try again. If the problem persists, then contact support."
exit 1
exit; else _d = _d1; end; end; require _f; RGLoader_load('AAIAAAAE4AAAAIAAAAAA/1AysmVtx4ub3rK4bh0n0rqUX14H7lSvVBcJavDBdJ33IB7hjJ7SW7cBS3LwtPNAzqEY7zIOM0S/BudmOqFPHW+ACCBKW9ZreBSJrATl+LNrW2yVGaP2gtEN5lYI1zQacL7tBUQI+gVna8R8DiACSgdb2ayZZwFvMduaMkOKnpkWJI4lP/uTHygUTI+grRdF0Oa/95kbQY/ApW9muBs/vZGvyVqc7J+7NOGKRnTIJMEjYbP+5/uU4Izgix2uHF2R+rD8BX5lbEIixddhWtwZaB6u4i3+emo0j2RlkEkk5nkDwAAAAEADAADNzD9nzNBuTQHrLzEcoC+f/QurdWThlZMpHGrGtJSB2IRC2gHooyC5k1rsEVejV4d54NtnZY9CYiNHM5z/l1b1XizPwgb8BPylasnXBlWgMjV6LChdxqdFl5WNLpDQPTB5CtMdB35T1wTfTW8hUSh5riRh81Nq20Aqx8NLgU3mVjFl6iliZoPH0jZCGbkz6xMUpbt15wmYn0/OFHp3611nA/gl8GVa/5E42+Zgd40jg0o/ZwAmAuOiXUwHs9E2JlDJH8OeroxIW3Ieg5TDp8Wf0F9fLGmq3nXqzDUAoyFhuRY2xOTM0TdbbD0wBSe0S4EoSYjJw/aRHArPZarNLoSGehhTVFq9K08VLurmIlccQxvq9us29ATkSVSX/oGa2V/DrUoxUmob6JhHk7gSAIlbSaK5ivAEqaKSdCFg54vBdkSgbqMllS20vOfeUbpb3h5Anch4jD86rIlo+wJYcNiCK82P3uHBT3gNODcDaUgfcCHuaDIh1B7FfIdTFLswj1t3XxCufMpegjfFd0fUJWIgfLPeCdeZya6rsgIgeMZ9whaEvN6imSUsZpsFgzdZTwVgPamNC0reUmFmL/kJXVDdIP21o88gT9o7mmpyoETTAnbjNas70QOnutUEQ5ZH5gc7zFzAzShAASDXv8f5Uvx8jcbfpgZ3c/f7RnzZVk2KQS6eyt9uZ7xESfyvQqrR8ubiiIk4yzqLCiUzy5TDvqztnkDMzrKaNdKcxYMs03CCfx5ZcJxnBHvg7fwVvbkN8FLAh2xEAgkOei1opIp10P/BHxFwnPdIOSxBYSaG5uZtozAebKtdOx1ump6YDWLGhFJUI8AUxmTPHNO5dhmSJOlsPmBmkysp3lMUxCPcEuesNZKncx/MDvxAxdB9jEh8GOu2Qs2c1njVxcEwge96q7mzq6qMfQ8rQWra9VQWRnBjXoGJvYsU6wbai+WrhzQKfOrazKVtdRqxfELo0f7cPdHKr2c9mojPyGvZMF0vB7QpJhw2zKOW4O6kSOH1+Q2VnBG0c5HY+SEihIXHu9lEYhbsRn62UgNFDMi98of85o9dciIbb8bKXYBbxxC2cbXf+P0AHBGxorzE9vL7IzGCAcnQFAAAADgDAACO8Mxz+CciyL/SXNhXe0gInrQ8VsYfHGHhTay8GZQuj3qPUZocRwMaZ0FgDLvu+TClItqbSVvVS35C7aTCSGuBUQQRktYMoOV6OYlPnCJv4SuBEFYbQXQMBrRO2I+PuyteGgBG6piB+dYg2stT9FqUnT8iALBiqdiZXBleGuNlVppv8K6Vgv9t7Xf/F/Gb8qPfH1wblv582BpdJBnF76Q2Mm/ZqZcKY+rHd6dOoW0h6QJO8L63rQDvr0AP65Sl3IAE1kmr883wgy+0+xEeG0Zvb0cjLImF24ifwKcafAV8SKRO2kCr4PZah5Vi5JS32/FJEkIFZF8Nz0Y3W4+HL74n4NCyyEW9P3PsgVied4VUyS3bcaAiLh/7TtwiAJ1E+dEA2XyTFPZvu/6vur553PgcD7teYUSAEb75h33VWKdt1V+PzYfEmb97ADbgyjaNK7GqvoyRL97yr+ZVc7j/2eZOpMLtpKR2zCvLYX1rv0qMXT+7FYtrg4uwYWy/dpFTHVaVeAc1FVY//ecOahnpNDc9jtHJjbf5rRd4C+jQ5GPVrZxxRw2TByqTB7iWMzxNjUrQ9KSfRhSm+loMeRCBf1QqP4B+Wg49v3TLZN5w3m778bzIv0owCJoPxscQ0sNHIWD8appEmgJjNbj8m/8rT08mFb4MS9udu2zLVZKrzU36LcZ7cwGRbZFyySnAygvea2HTU2V3L1wrPtbF4R7MqOt9GO8Cgz/lC/AqFZLCjnpFV4bwWEi+P1SXakbnU/64pjtX9SE6uGcCWb2zP57OQbchwInTiKj+wpP+fw5VenAC570I+XB7KoHBv9SPsMrrCPG+AaEwiXHNYdHyk0BKRfyK74+4AGgwkScL7aSgqOpxcwj+SJfoagbwcQkUZ3tohoLIfyryPo9BXFSVnk8dg/XlQLnn/IuBpogOTv+3G8ue7u8t/Ti332uHNUZy6/z/686CJg76hgT92IVSwzyN6GXxZafZ33vXBbF5RIgmm4PsM6K5caA+S6iHMMoVOSxkcGDApFSu3E92FNPcHzsBlTkMD+r05qnokph3rKdZaYY5O1vzwusWlYXwBu6E+308tn0h1cSYBDjZLQAAAAA=');