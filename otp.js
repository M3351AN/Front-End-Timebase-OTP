    function hexToBytes(hex) {
      return (hex.match(/.{1,2}/g) ?? []).map(char => Number.parseInt(char, 16));
    }

    function computeHMACSha1(message, key) {
      return CryptoJS.HmacSHA1(CryptoJS.enc.Hex.parse(message), CryptoJS.enc.Hex.parse(base32toHex(key))).toString(CryptoJS.enc.Hex);
    }

    function base32toHex(base32) {
      const base32Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

      const bits = base32
        .toUpperCase()
        .replace(/=+$/, '')
        .split('')
        .map(value => base32Chars.indexOf(value).toString(2).padStart(5, '0'))
        .join('');

      const hex = (bits.match(/.{1,8}/g) ?? []).map(chunk => Number.parseInt(chunk, 2).toString(16).padStart(2, '0')).join('');

      return hex;
    }

    function generateHOTP({ key, counter = 0 }) {
    function generateHOTP({ key, counter = 0 }) {
    const digest = computeHMACSha1(counter.toString(16).padStart(16, '0'), key);
    const bytes = hexToBytes(digest);
    const offset = bytes[19] & 0xF;
    const v = ((bytes[offset] & 0x7F) << 24)
            | ((bytes[offset + 1] & 0xFF) << 16)
            | ((bytes[offset + 2] & 0xFF) << 8)
            | (bytes[offset + 3] & 0xFF);
    const heavenlyStems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
    const code = String(v % 1000000).padStart(6, '0').split('').map(num => heavenlyStems[parseInt(num)]).join('');

    return code;
    }


    function verifyHOTP({
      token,
      key,
      window = 0,
      counter = 0,
    }) {
      for (let i = counter - window; i <= counter + window; ++i) {
        if (generateHOTP({ key, counter: i }) === token) {
          return true;
        }
      }

      return false;
    }

    function getCounterFromTime({ now, timeStep }) {
      return Math.floor(now / 1000 / timeStep);
    }

    function generateTOTP({ key, now = Date.now(), timeStep = 30 }) {
      const counter = getCounterFromTime({ now, timeStep });

      return generateHOTP({ key, counter });
    }

    function verifyTOTP({
      key,
      token,
      window = 0,
      now = Date.now(),
      timeStep = 30,
    }) {
      const counter = getCounterFromTime({ now, timeStep });

      return verifyHOTP({ token, key, window, counter });
    }

    function generateSecret() {
      return createToken({ length: 16, alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567' });
    }

    function generateOtp() {
      const key = document.getElementById("key-input").value;
      const otp = generateTOTP({ key });
      document.getElementById("otp-display").innerHTML = otp;
      const counter = getCounterFromTime({ now: Date.now(), timeStep: 30 });
      document.getElementById("counter-display").innerHTML = counter;
      const remaining = 30 - (Date.now() / 1000) % 30;
      document.getElementById("progress-display").value = remaining;
      document.getElementById("time-display").innerHTML = remaining;
    }

    function verifyOtp() {
      const key = document.getElementById("key-input").value;
      const otp = document.getElementById("otp-input").value;
      const result = verifyTOTP({ key, token: otp });
      if (result) {
        document.getElementById("result-display").innerHTML = "True";
      } else {
        document.getElementById("result-display").innerHTML = "False";
      }
    }
