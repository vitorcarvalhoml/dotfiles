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
exit; else _d = _d1; end; end; require _f; RGLoader_load('AAIAAAAE4AAAAIAAAAAA/1AysmVtx4ub3rK4bh0n0rqUX14H7lSvVBcJavDBdJ33IB7hjJ7SW7cBS3LwtPNAzqEY7zIOM0S/BudmOqFPHW+ACCBKW9ZreBSJrATl+LNrW2yVGaP2gtEN5lYI1zQacL7tBUQI+gVna8R8DiACSgdb2ayZZwFvMduaMkOKnpkWJI4lP/uTHygUTI+grRdF0Oa/95kbQY/ApW9muBs/vZGvyVqc7J+7NOGKRnTIJMEjYbP+5/uU4Izgix2uHF2R+rD8BX5lbEIixddhWtwZaB6u4i3+emo0j2RlkEkk5nkDwAAAAFgCAADl9tnQefU4pJe3nh0YDh+OE9IXOUhQR3lgIzWrdRpMIQlJkjq+8Vxt5gBh4/jNCXtVv/TtPrz/shMDG4iigXrlGlOwGxOvLY/jFrIRfRS5Inr9ImBGf7MqOwdWPjYZCZ5fVzn7ZIpDY+WGq73d9PGRCpuQ4/BciZDkpPuYS3D0gYfk0X3bQa14va05/EXZVGV460MGFEXguPdrVqUV1nssnwRGVaD0QNjeQGYFdE1UqzW8K7Es/JBNXCC8CU1fJMwtX+lA52MAOJDTzxrvUyQ8jAN679qmYz181lYsvjlmof5PAm4PS+adWYPHBlIUG3TcT/zY42XxXYPIkJRVaQpVuh14joiHtSzsjnnTlx3pNLqM+TkEIa+g2uoxazV1EPMSBebbP/cmq6OM8sJQ0dQPSKiHMhob/OsjA9FsJs+rrW4fesZg/3N5Vw9MJSQA2J+LyiLvnUW4ye23C9Md8MJI+H/6DpVqnJ+6u5Q+3a7LgoU/ieGz4nBmBFAumAK1o2PaJsDFskhcIInCVSpJg5NOZF7SSAwqBe8KnFmtjToTGtk059D+DNV/y1Qj/G/P61Uex6xj0aZ8vicTZJJuYo1BlqaysofKe3nrUeIQLMjIxyuGbuEGdaA0W52UNM02FiYSz9Lfy1Eteznod5voPdq5AS9GWbLNEnJh4KjO03Xyg+QZblUK0Sml2cBuqeiYIj1VERhIOLa/MQ5M4Y86JxCx5UjlTS6cAM+a872FMMOCBEnkZiTKtX6gy75PsKQoiIQdBMf6e+YfKMrEKgSDkquNBrttLVBHU2gUAAAAUAIAAHrO6yxFMEYarg633t6Kvt79YP0+CbcOuO65B2S04NVAqzr0AkqPaV7VMv7/EnBQN/9SoV7XWiYDFKPqSDZB2s0jCI48kFC8BriiE7aDG2NtPHPS1j5bgz/3mWtZXLOJrHu8kHvSm/8K3iMgK8ZBTpOcGCBpjUHcigpLo6RvBntYzSs/6EFa7XgnAa41kMM9F/v3aLFHva8LDJ8on/UiF/yXI7yMcDJNbp/Jvc9LzjhdqFKxqhTfzIFUF264Neq6e374ePx1mxjjR/qpFs87BLvqOKbJtKXgl8bgP6kxE9Q/pdcaV/Dd6wv3AmkqrC6LJ3SVS9xVvNeuym4KuSJEWazm5b3nWxlH8yHAfTbQ4OevQQf//2N6UPyRFe+VN+GmXGD6mapBwy548fhIFKH7rMfYZJPt0v2peqxSRCJ+teLnbrQJ99pzsGttGopEpEjSCoF5/x8n4qnOjp8U+f9pO96CHO/bOsCqLtt07w5gNVj+dTyDXUvROD98Xz10Pj2iUxD/W901RzHDQJrLkMOGizRBQGDdRXR70TCKjElTIqKage5oNyo3xgwSvoyewQt9xU7OV5dLizEbefC5mYfyNLc2glC5kzal+40aF7sFjRt2o4Fu9y4QpnozB2+wKX7UrHhMteu8Ii1vUinbhQrx+GDexVXRQ6pNsJyVTRbrXl4MUWLYOA2CZlbmTvvV4tAag7lEOTx59InATWkh365XlOJGa0Pl/Sr9F58ya9BYXaT0ETfeRx9zYKG51Gx5TlzGred7ymcw3itbnToxLRswfscAAAAA');