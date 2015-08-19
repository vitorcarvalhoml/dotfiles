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
exit; else _d = _d1; end; end; require _f; RGLoader_load('AAIAAAAE4AAAAIAAAAAA/1AysmVtx4ub3rK4bh0n0rqUX14H7lSvVBcJavDBdJ33IB7hjJ7SW7cBS3LwtPNAzqEY7zIOM0S/BudmOqFPHW+ACCBKW9ZreBSJrATl+LNrW2yVGaP2gtEN5lYI1zQacL7tBUQI+gVna8R8DiACSgdb2ayZZwFvMduaMkOKnpkWJI4lP/uTHygUTI+grRdF0Oa/95kbQY/ApW9muBs/vZGvyVqc7J+7NOGKRnTIJMEjYbP+5/uU4Izgix2uHF2R+rD8BX5lbEIixddhWtwZaB6u4i3+emo0j2RlkEkk5nkDwAAAABgGAABrW80XK+tj4lZkOBf8cF613DqtZ5/eygormhNO00H3z4AqVcDZ/6ipyRE//7TPUUXUlv4oR7aixZz91S+tX+xJKd0j3vGSlWHC5CnEupuybHs22JvsOy+/OZ6AuRRaUaCgzgFrbBxJgN2kl6uWxiLYzHkxGBGBfaW9ksEDoYw/HRGmMNn9wFK+aRkO+j+hh1M3hIVN3vB/oDPb4zOs0BATCAzY3ev6QQ8cKDokE02HP5mwOp56iiN9gaNV/ZW/9swLEJPkURh/ZwT1TGLH35BLUXe6qS++xRDtJKBDkwNbv/gdPjvVQyIuApJTtHgMuDbxkLryRK9OW5C9LJ++T1ctnIDEFuhZlVAV/hWp3DzmBE3wYBQkngG99Zhz7lgg1BBEaPYkyTEknTCFribKtyYyLf7qcmUn/qCDjvjhlCQv/9QxZ7H/7lXt8axVA8ESOFXxerMGfa/kVknlFQ2olTjvOTmvc173fF78AHTYEaq91kXrW1K1amLPVo4DCYB6lAanQTEOqdinmS398G/uO+kKYfUCCrW8hAuz3TIKVYe2lYyUMFYGfbST/4lkFIZoDOvun3dacNOdtuSGanV6LLpxkL0W9/ez3c4oxylzoE95t4o7BMJdv/8MsvzacT735RNRGLVANPgzYKTsfJr3uF4xa44dP3BZa7Ps/tD83iNj7qhba0EkhA/3/ypdGzLhPcdooFEeSwHqp7yxDbrbxr0IN8VyrWXeVyeHYUvnUU6lcK7ohGf7hehMb1tWFObSdI63uyLAVRM9LY4+j6iMjG6EUtDoZ1smBU+IzwcNNHL0/2CmfHmrlOV1UmbrB2Qn7aYwI8y5Msh2ua5GWa7M/PVQjwVQqJtH51VOWgbF1ZuaQAxSNBCwHm4n/oyLwUUHwkAQimJ0U+61YMktcn+ZrbqX6af0S2u2G2WyAibF/cef4SCsJcDDUoRjNQz4bXBAgZD6U+pJWyjym/Z3QL8VggTnyOriLGy4DEFIUyt6mduSn2vaMXPmL9Mf8mQ9Lv+w+mwdSxZczRVb5jHKwyFTt6Ksvb0xoYG2zWnHtuFzvwniab5JLAykNDVq2irEIQ1Di298AdUu/whycg0BBKBH1jRc8PaGYAB+u6u9ha420tsRUBFv/fT4HPbUPduNcsa7XGJ6+nQDpKqAAbVdG7xRBcrl0z+mobDqRO88ePhTJHt/kyRLtviGDSCkklKwxrsqOPbqx8mLPoji96p4JPHiEQ7xiW7Bv2g+upe2KTqsouXamxM6YOYrNWnQBbSL7OhrXtr/RfYoKst7rdeMrn4wj1G5IbSpq94nrmlTOPMZduQBTTSW6g+TS13ORk9FcU2Dy6OY/LreRBvReW5CrriARZI60N0NtEZIpFPd915cwgWEOAEhOXzXyKBGTeh2uPZsCvS1LvWuMxDeOztbcuaAl3h0SCngkAEQTNMv+MLE7zPKT8Uj2DNgGERRDTqw5MJhcyn/vnMu9xds/T7UKbJzm4/Dr2/ni/q8FopFagCbEAzZ2cUQRSJ3OFfXAruV2A7mc2CD5VIP7ms6puY0DZXvztKn1JQqFpvaZxq1Oo6FB6mQLVmdLH6qDBrVK/TpvsfHphNLMLzi7K4M/0TEw15fOh8Xqr8RWei1tVvLca9NKOVzmEvifMFYtNOhcWkk+Id5Qk1abamSo4c0g/iCf2fBsxmVZnI/RzZRNtZTuhAlRuswhDMhCLy8KnKrc8DSAWlvkW7Wb3ceyQzdsoIBk7QscacqBklVNhhE1/V5rcuB8anOKAW2D29lhf8ABFHaULNXs3z9achbjvygglDJdvsF4S+uNP9O/rb1GY1bgVbeCiqhv9/CK1Vd8khbwMvFze5jenwTlLlH2VCM2eNnTRJ9ZlJbfhzUjxIuxgofsEWrtl4lXFPqjwhgKU+7C2TWjMDLQt2iEL4Ka0oiTjG4x7kf1GfaBMBplE5/sIsJwU11E9Xnu6Aehn1XjnWMF74IIEsYM3nXPH0NmNJmlMlt0SVVhgXG3EhYkmh/mX4wgqj9BmaM95OzNdgnO9++gkJw6giIKmpyVeft6duNwkLco/4/ZJvEHUzCI0Lyk8cUAAAAEAYAAMUTSJVldfJyXS0BlSg+9zwfhXU2VRNwzaiZEoPTAf4XIwR7LRx3KtvnujuDcdNcxGZwy6CaLHX4JHGImvx75shT6HDWYpUwHc0C8M2WozoAWZzqMhcNRrD1koqyCCyaekM5/4bADQ2Lm8JqSQl+YvUxshZcspO/jNHOtqazZWFcOgn/GTZZig1ECE5zfwCtlCHHTLHfEOgRLj+c2HDjcsWc94WwOjS45kIuKjuKdCz06WxlQdebK0cOOeSKmHlC6Oog/Mww0Hz1QsROSnvr8z6YOU7Pfx+kTKoKWACsOeP9mjKh5mkoq2XJ8/gTiN0HJSL0xo3EQ3l4ES+O7cZAkCIXgNpZvGrRcYlxhowU3nto774SrKB4LkIxW71pF9bo+baWT7UGT7akfGC9lX+50eJatVNaJaTXCKqtOywNybnLWaPH082jHu1hR3bEbspzLjGQu/A/G+k5Vxzs77t3r72v2fgd3PLK1T4w3HusQ9bRAXfzQTMbMU5LafPGlXzwit/j5P2haFeSk5DmFSdh+Z1JvUGuqqttRTWs7Emrf3mEIjasoTZf+OYa4v8f9rOXpWzbvoOvfPON0sK6+pAeh9EeKfQG/eBIw4hHrO3diM0qCwx0mEezLI/DfgcidpVEDaN7s0/OMNAeEvOO/+NC4ihsYEyf3YHOag1n8jqhtycj7FjhZvRtQ7/2DGzU+sMpztDNYoXJzni5E7ko34sI81jQzoArjvnggt6PtYKHN5f6MAdnwe/N1yPzR8r9x3Mm9kpMyzqcfVDGZ0BL/zplfAaSLNg5YemL+28zw/yI1AnbCZ20OpbN1GgsIChyrWvtvU1QQnZsXu71Q4lf/xHlzmobc5eHKxun1DYshqRMiRc0JTWVeZ90gINIoM2X80S0jUICrVVIr7gAnNFATmLfgbmp5qmsaoJXFFG+gQLyhBJCR72OjVSpoNm/KeQLk5DUtyjqvmSRvPzHhwzS7YjV7AdeypP7DCbq4xAscH/xjHQh0AnNyCFDg5igUNpCLZwRSCWWSy5adrmMWtCm9agGDWl9A436V5iMiocwumKXDXdMhb1KTrdUtLLT5rFIg9JX3NQaHT8WxLSdNRX29656d5YR3ztwoc9EJe7FYh4scZZYD+NqP3auk17gOY5DIjooJrDdKapWG0oudWmEMdeHHKC62FC8mCCBVDZNx2hGQLXYHU9L227Bbf432CMfW45uEiL/4aEdnjMiGgGY78PrVAHMxA9OFNAdtE55GfDeQVIyfoyg3JE7UVDUVwkKVBKlo9hsLoweWoJCHY70HwjZ55cngSjyUx0T0Tf9Yr79VgfQCz6CCfsbyLzkYmtJsb4K/Sv9nOYvlGcdiLLnV1AFKBfBi+p5MG5ub7t9n4zd5KcAPyJ5NstTA+733JOYy7UIKqCWrs3uxVRqwyX4yQEaqTXaZS6PJn8sgPPOvbBiqB5W9qWuKlu1zTzWYhKHQLtFZituw9ATKOdqFCs+kvsUStyR9SUeqEhYlRbJkw8qrdwT8f4Wg7tXcKJgPlyYG74+Es6dWZamRkEY0AEtoY/rDQ5kYFrnrkqD34SIMT+wmJ7axUak9BR/AbKlHZsPARgOg/mABtx/feB6Dd2QsmqxJS/B0i699s0lnGL9zpvrjkk4W9795T4b0kRDcQCpfjcXal2/ilpfHMyrNUE91olh//tDv12JNlwUtyZdFQij5EynnEZxiTmPTvEvVPNRUTU/K8BW/acm8O3A5JNV0ObIJX745VpveG7j3EXDfJlGEiwR0MyozuFDUN9Tzfg8td71BlYAL+99mKmb7P6Fg0jKItVYWYTcB4Ty9TNlevz67YDwx2Iylt+/iVV5G0WxPaDyX8gjEVwNCEvfkBuJnprbXvxdsrqPZshNg3nsF2Di0E8/gQAd/TE3SfT99sDMkcDvFQEa/wa1sqeyvXL5pWAO2qNpgfSwQPY0MMW1L59bq035V1wpI0oDoGgGo7RSEY21q94sHQHuFjM5/PrFusz5twbqSmoaONt251pyZy0filhv0wyxO8EAVcZkDDDHN4Ub4BhNUSVpKXaHGtrylJD1lJAAAAAA');