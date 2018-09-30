/* eslint-disable no-unused-vars */
(function (win, $) {
  $.extend({
    scorePsw: (function () {
      let reverse = function (str) {
        return str.split('').reverse().join('')
      }
      return function (pwd) {
        if (pwd == 'netposa123') {
          return 60
        }
        
        let nScore = 0,
            nLength = 0,
            nAlphaUC = 0,
            nAlphaLC = 0,
            nNumber = 0,
            nSymbol = 0,
            nMidChar = 0,
            nRequirements = 0,
            nUnqChar = 0,
            nRepChar = 0,
            nRepInc = 0,
            nConsecAlphaUC = 0,
            nConsecAlphaLC = 0,
            nConsecNumber = 0,
            nConsecSymbol = 0,
            nConsecCharType = 0,
            nSeqAlpha = 0,
            nSeqNumber = 0,
            nSeqSymbol = 0,
            nSeqChar = 0,
            nReqChar = 0
        let nMultMidChar = 2,
            nMultConsecAlphaUC = 2,
            nMultConsecAlphaLC = 2,
            nMultConsecNumber = 2
        let nMultSeqAlpha = 3,
            nMultSeqNumber = 3,
            nMultSeqSymbol = 3
        let nMultLength = 4,
            nMultNumber = 4
        let nMultSymbol = 6
        let nTmpAlphaUC = '',
            nTmpAlphaLC = '',
            nTmpNumber = '',
            nTmpSymbol = ''
        let sAlphas = 'abcdefghijklmnopqrstuvwxyz'
        let sNumerics = '01234567890'
        let sSymbols = ')!@#$%^&*()'
        let nMinPwdLen = 8
        if (pwd) {
          nScore = parseInt(pwd.length * nMultLength)
          nLength = pwd.length
          let arrPwd = pwd.replace(/\s+/g, '').split(/\s*/)
          let arrPwdLen = arrPwd.length
          
          for (let a = 0; a < arrPwdLen; a++) {
            if (arrPwd[a].match(/[A-Z]/g)) {
              if (nTmpAlphaUC !== '') {
                if ((nTmpAlphaUC + 1) == a) {
                  nConsecAlphaUC++
                  nConsecCharType++
                }
              }
              nTmpAlphaUC = a
              nAlphaUC++
            } else if (arrPwd[a].match(/[a-z]/g)) {
              if (nTmpAlphaLC !== '') {
                if ((nTmpAlphaLC + 1) == a) {
                  nConsecAlphaLC++
                  nConsecCharType++
                }
              }
              nTmpAlphaLC = a
              nAlphaLC++
            } else if (arrPwd[a].match(/[0-9]/g)) {
              if (a > 0 && a < (arrPwdLen - 1)) {
                nMidChar++
              }
              if (nTmpNumber !== '') {
                if ((nTmpNumber + 1) == a) {
                  nConsecNumber++
                  nConsecCharType++
                }
              }
              nTmpNumber = a
              nNumber++
            } else if (arrPwd[a].match(/[^a-zA-Z0-9_]/g)) {
              if (a > 0 && a < (arrPwdLen - 1)) {
                nMidChar++
              }
              if (nTmpSymbol !== '') {
                if ((nTmpSymbol + 1) == a) {
                  nConsecSymbol++
                  nConsecCharType++
                }
              }
              nTmpSymbol = a
              nSymbol++
            }
            
            let bCharExists = false
            for (let b = 0; b < arrPwdLen; b++) {
              if (arrPwd[a] == arrPwd[b] && a != b) {
                bCharExists = true
                nRepInc += Math.abs(arrPwdLen / (b - a))
              }
            }
            if (bCharExists) {
              nRepChar++
              nUnqChar = arrPwdLen - nRepChar
              nRepInc = (nUnqChar) ? Math.ceil(nRepInc / nUnqChar) : Math.ceil(nRepInc)
            }
          }
          
          for (let s = 0; s < 23; s++) {
            let sFwd = sAlphas.substring(s, parseInt(s + 3))
            let sRev = reverse(sFwd)
            if (
                pwd.toLowerCase().indexOf(sFwd) != -1 ||
                pwd.toLowerCase().indexOf(sRev) != -1
            ) {
              nSeqAlpha++
              nSeqChar++
            }
          }
          
          for (let s = 0; s < 8; s++) {
            let sFwd = sNumerics.substring(s, parseInt(s + 3))
            let sRev = reverse(sFwd)
            if (
                pwd.toLowerCase().indexOf(sFwd) != -1 ||
                pwd.toLowerCase().indexOf(sRev) != -1
            ) {
              nSeqNumber++
              nSeqChar++
            }
          }
          
          for (let s = 0; s < 8; s++) {
            let sFwd = sSymbols.substring(s, parseInt(s + 3))
            let sRev = reverse(sFwd)
            if (
                pwd.toLowerCase().indexOf(sFwd) != -1 ||
                pwd.toLowerCase().indexOf(sRev) != -1
            ) {
              nSeqSymbol++
              nSeqChar++
            }
          }
          
          if (nAlphaUC > 0 && nAlphaUC < nLength) {
            nScore = parseInt(nScore + ((nLength - nAlphaUC) * 2))
          }
          if (nAlphaLC > 0 && nAlphaLC < nLength) {
            nScore = parseInt(nScore + ((nLength - nAlphaLC) * 2))
          }
          if (nNumber > 0 && nNumber < nLength) {
            nScore = parseInt(nScore + (nNumber * nMultNumber))
          }
          if (nSymbol > 0) {
            nScore = parseInt(nScore + (nSymbol * nMultSymbol))
          }
          if (nMidChar > 0) {
            nScore = parseInt(nScore + (nMidChar * nMultMidChar))
          }
          
          if ((nAlphaLC > 0 || nAlphaUC > 0) && nSymbol === 0 && nNumber === 0) {
            nScore = parseInt(nScore - nLength)
          }
          if (nAlphaLC === 0 && nAlphaUC === 0 && nSymbol === 0 && nNumber > 0) {
            nScore = parseInt(nScore - nLength)
          }
          if (nRepChar > 0) {
            nScore = parseInt(nScore - nRepInc)
          }
          if (nConsecAlphaUC > 0) {
            nScore = parseInt(nScore - (nConsecAlphaUC * nMultConsecAlphaUC))
          }
          if (nConsecAlphaLC > 0) {
            nScore = parseInt(nScore - (nConsecAlphaLC * nMultConsecAlphaLC))
          }
          if (nConsecNumber > 0) {
            nScore = parseInt(nScore - (nConsecNumber * nMultConsecNumber))
          }
          if (nSeqAlpha > 0) {
            nScore = parseInt(nScore - (nSeqAlpha * nMultSeqAlpha))
          }
          if (nSeqNumber > 0) {
            nScore = parseInt(nScore - (nSeqNumber * nMultSeqNumber))
          }
          if (nSeqSymbol > 0) {
            nScore = parseInt(nScore - (nSeqSymbol * nMultSeqSymbol))
          }
          
          let arrChars = [nLength, nAlphaUC, nAlphaLC, nNumber, nSymbol],
              arrCharsIds = ['nLength', 'nAlphaUC', 'nAlphaLC', 'nNumber', 'nSymbol'],
              arrCharsLen = arrChars.length,
              minVal
          for (let c = 0; c < arrCharsLen; c++) {
            if (arrCharsIds[c] == 'nLength') {
              minVal = parseInt(nMinPwdLen - 1)
            } else {
              minVal = 0
            }
            if (arrChars[c] == parseInt(minVal + 1)) {
              nReqChar++
            } else if (arrChars[c] > parseInt(minVal + 1)) {
              nReqChar++
            }
          }
          nRequirements = nReqChar
          let nMinReqChars
          if (pwd.length >= nMinPwdLen) {
            nMinReqChars = 3
          } else {
            nMinReqChars = 4
          }
          if (nRequirements > nMinReqChars) {
            nScore = parseInt(nScore + (nRequirements * 2))
          }
          
          if (nScore > 100) {
            nScore = 100
          } else if (nScore < 0) {
            nScore = 0
          }
          return nScore
        }
      }
    })()
  })
})(window, window.jQuery)
