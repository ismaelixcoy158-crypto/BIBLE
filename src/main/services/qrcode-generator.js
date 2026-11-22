/**
 * BIBLE — Zero-dependency Pure JavaScript QR Code Generator
 * Genera matrices QR y códigos QR en formato SVG vectorial sin librerías externas.
 */

const QRCode = (function() {
  const MODE_8BIT_BYTE = 1 << 2;
  const PAD0 = 0xEC;
  const PAD1 = 0x11;

  function QRBitBuffer() {
    this.buffer = [];
    this.length = 0;
  }
  QRBitBuffer.prototype = {
    get: function(index) {
      const bufIndex = Math.floor(index / 8);
      return ((this.buffer[bufIndex] >>> (7 - index % 8)) & 1) === 1;
    },
    put: function(num, length) {
      for (let i = 0; i < length; i++) {
        this.putBit(((num >>> (length - i - 1)) & 1) === 1);
      }
    },
    putBit: function(bit) {
      const bufIndex = Math.floor(this.length / 8);
      if (this.buffer.length <= bufIndex) {
        this.buffer.push(0);
      }
      if (bit) {
        this.buffer[bufIndex] |= (0x80 >>> (this.length % 8));
      }
      this.length++;
    }
  };

  const QRMath = {
    glog: function(n) {
      if (n < 1) throw new Error('glog(' + n + ')');
      return QRMath.LOG_TABLE[n];
    },
    gexp: function(n) {
      while (n < 0) n += 255;
      while (n >= 255) n -= 255;
      return QRMath.EXP_TABLE[n];
    },
    EXP_TABLE: new Array(256),
    LOG_TABLE: new Array(256)
  };
  for (let i = 0; i < 8; i++) QRMath.EXP_TABLE[i] = 1 << i;
  for (let i = 8; i < 256; i++) {
    QRMath.EXP_TABLE[i] = QRMath.EXP_TABLE[i - 4] ^ QRMath.EXP_TABLE[i - 5] ^ QRMath.EXP_TABLE[i - 6] ^ QRMath.EXP_TABLE[i - 8];
  }
  for (let i = 0; i < 255; i++) QRMath.LOG_TABLE[QRMath.EXP_TABLE[i]] = i;

  function QRPolynomial(num, shift) {
    if (num.length === undefined) throw new Error(num.length + '/' + shift);
    let offset = 0;
    while (offset < num.length && num[offset] === 0) offset++;
    this.num = new Array(num.length - offset + shift);
    for (let i = 0; i < num.length - offset; i++) this.num[i] = num[i + offset];
    for (let i = num.length - offset; i < this.num.length; i++) this.num[i] = 0;
  }
  QRPolynomial.prototype = {
    get: function(index) { return this.num[index]; },
    getLength: function() { return this.num.length; },
    multiply: function(e) {
      const num = new Array(this.getLength() + e.getLength() - 1);
      for (let i = 0; i < num.length; i++) num[i] = 0;
      for (let i = 0; i < this.getLength(); i++) {
        for (let j = 0; j < e.getLength(); j++) {
          num[i + j] ^= QRMath.gexp(QRMath.glog(this.get(i)) + QRMath.glog(e.get(j)));
        }
      }
      return new QRPolynomial(num, 0);
    },
    mod: function(e) {
      if (this.getLength() - e.getLength() < 0) return this;
      const ratio = QRMath.glog(this.get(0)) - QRMath.glog(e.get(0));
      const num = new Array(this.getLength());
      for (let i = 0; i < this.getLength(); i++) num[i] = this.get(i);
      for (let i = 0; i < e.getLength(); i++) {
        num[i] ^= QRMath.gexp(QRMath.glog(e.get(i)) + ratio);
      }
      return new QRPolynomial(num, 0).mod(e);
    }
  };

  function getErrorCorrectionPolynomial(errorCorrectionLength) {
    let a = new QRPolynomial([1], 0);
    for (let i = 0; i < errorCorrectionLength; i++) {
      a = a.multiply(new QRPolynomial([1, QRMath.gexp(i)], 0));
    }
    return a;
  }

  const RS_BLOCK_TABLE = {
    1: [1, 26, 19],
    2: [1, 44, 34],
    3: [1, 70, 55],
    4: [1, 100, 80],
    5: [1, 134, 108],
    6: [2, 86, 68]
  };

  function QRCodeModel(typeNumber) {
    this.typeNumber = typeNumber;
    this.modules = null;
    this.moduleCount = 0;
    this.dataList = [];
  }
  QRCodeModel.prototype = {
    addData: function(data) {
      this.dataList.push(data);
    },
    isDark: function(row, col) {
      return this.modules[row][col];
    },
    getModuleCount: function() {
      return this.moduleCount;
    },
    make: function() {
      this.makeImpl(false, 0);
    },
    makeImpl: function(test, maskPattern) {
      this.moduleCount = this.typeNumber * 4 + 17;
      this.modules = new Array(this.moduleCount);
      for (let row = 0; row < this.moduleCount; row++) {
        this.modules[row] = new Array(this.moduleCount);
        for (let col = 0; col < this.moduleCount; col++) {
          this.modules[row][col] = null;
        }
      }
      this.setupPositionProbePattern(0, 0);
      this.setupPositionProbePattern(this.moduleCount - 7, 0);
      this.setupPositionProbePattern(0, this.moduleCount - 7);
      this.setupTimingPattern();
      this.setupTypeInfo(test, maskPattern);
      this.mapData(this.createData(this.typeNumber), maskPattern);
    },
    setupPositionProbePattern: function(row, col) {
      for (let r = -1; r <= 7; r++) {
        if (row + r <= -1 || this.moduleCount <= row + r) continue;
        for (let c = -1; c <= 7; c++) {
          if (col + c <= -1 || this.moduleCount <= col + c) continue;
          if ((0 <= r && r <= 6 && (c === 0 || c === 6)) ||
              (0 <= c && c <= 6 && (r === 0 || r === 6)) ||
              (2 <= r && r <= 4 && 2 <= c && c <= 4)) {
            this.modules[row + r][col + c] = true;
          } else {
            this.modules[row + r][col + c] = false;
          }
        }
      }
    },
    setupTimingPattern: function() {
      for (let r = 8; r < this.moduleCount - 8; r++) {
        if (this.modules[r][6] !== null) continue;
        this.modules[r][6] = (r % 2 === 0);
      }
      for (let c = 8; c < this.moduleCount - 8; c++) {
        if (this.modules[6][c] !== null) continue;
        this.modules[6][c] = (c % 2 === 0);
      }
    },
    setupTypeInfo: function(test, maskPattern) {
      const formatBits = [
        0x77c4, 0x72f3, 0x7daa, 0x789d, 0x662f, 0x6318, 0x6c41, 0x6976
      ][maskPattern];
      for (let i = 0; i < 15; i++) {
        const mod = (!test && ((formatBits >> i) & 1) === 1);
        if (i < 6) this.modules[i][8] = mod;
        else if (i < 8) this.modules[i + 1][8] = mod;
        else this.modules[this.moduleCount - 15 + i][8] = mod;

        if (i < 8) this.modules[8][this.moduleCount - i - 1] = mod;
        else if (i < 9) this.modules[8][15 - i - 1 + 1] = mod;
        else this.modules[8][15 - i - 1] = mod;
      }
      this.modules[this.moduleCount - 8][8] = !test;
    },
    mapData: function(data, maskPattern) {
      let inc = -1;
      let row = this.moduleCount - 1;
      let bitIndex = 7;
      let byteIndex = 0;
      for (let col = this.moduleCount - 1; col > 0; col -= 2) {
        if (col === 6) col--;
        while (true) {
          for (let c = 0; c < 2; c++) {
            if (this.modules[row][col - c] === null) {
              let dark = false;
              if (byteIndex < data.length) {
                dark = (((data[byteIndex] >>> bitIndex) & 1) === 1);
              }
              const mask = (maskPattern === 0) ? ((row + (col - c)) % 2 === 0) : false;
              if (mask) dark = !dark;
              this.modules[row][col - c] = dark;
              bitIndex--;
              if (bitIndex === -1) {
                byteIndex++;
                bitIndex = 7;
              }
            }
          }
          row += inc;
          if (row < 0 || this.moduleCount <= row) {
            row -= inc;
            inc = -inc;
            break;
          }
        }
      }
    },
    createData: function(typeNumber) {
      const rsBlock = RS_BLOCK_TABLE[typeNumber];
      const buffer = new QRBitBuffer();
      for (let i = 0; i < this.dataList.length; i++) {
        const data = this.dataList[i];
        buffer.put(MODE_8BIT_BYTE, 4);
        buffer.put(data.length, 8);
        for (let j = 0; j < data.length; j++) {
          buffer.put(data.charCodeAt(j), 8);
        }
      }
      const totalDataCount = rsBlock[2];
      if (buffer.length + 4 <= totalDataCount * 8) buffer.put(0, 4);
      while (buffer.length % 8 !== 0) buffer.putBit(false);
      while (buffer.length < totalDataCount * 8) {
        buffer.put(PAD0, 8);
        if (buffer.length >= totalDataCount * 8) break;
        buffer.put(PAD1, 8);
      }

      const bytes = buffer.buffer;
      const ecCount = rsBlock[1] - rsBlock[2];
      const rsPoly = getErrorCorrectionPolynomial(ecCount);
      const rawPoly = new QRPolynomial(bytes, rsPoly.getLength() - 1);
      const modPoly = rawPoly.mod(rsPoly);
      const ecBytes = new Array(rsPoly.getLength() - 1);
      for (let i = 0; i < ecBytes.length; i++) {
        const modIndex = i + modPoly.getLength() - ecBytes.length;
        ecBytes[i] = (modIndex >= 0) ? modPoly.get(modIndex) : 0;
      }
      return bytes.concat(ecBytes);
    }
  };

  return {
    generateSVG: function(text, margin = 2) {
      let typeNumber = 1;
      const len = text.length;
      if (len > 17) typeNumber = 2;
      if (len > 32) typeNumber = 3;
      if (len > 53) typeNumber = 4;
      if (len > 78) typeNumber = 5;

      const qr = new QRCodeModel(typeNumber);
      qr.addData(text);
      qr.make();

      const count = qr.getModuleCount();
      const size = count + margin * 2;
      let path = '';

      for (let r = 0; r < count; r++) {
        for (let c = 0; c < count; c++) {
          if (qr.isDark(r, c)) {
            path += `M${c + margin},${r + margin}h1v1h-1z `;
          }
        }
      }

      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" shape-rendering="crispEdges"><rect width="100%" height="100%" fill="#ffffff"/><path d="${path}" fill="#000000"/></svg>`;
    }
  };
})();

module.exports = QRCode;

