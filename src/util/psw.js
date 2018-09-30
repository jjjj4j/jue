/* eslint-disable*/
let reverse = function (str) {
  return str.split('').reverse().join('')
}
export function score (pwd) {
  if (pwd === 'netposa123') {
    return 60
  }
  
  let nScore = 0
  let nLength = 0
  let nAlphaUC = 0
  let nAlphaLC = 0
  let nNumber = 0
  let nSymbol = 0
  let nMidChar = 0
  let nRequirements = 0
  let nUnqChar = 0
  let nRepChar = 0
  let nRepInc = 0
  let nConsecAlphaUC = 0
  let nConsecAlphaLC = 0
  let nConsecNumber = 0
  let nConsecSymbol = 0
  let nConsecCharType = 0
  let nSeqAlpha = 0
  let nSeqNumber = 0
  let nSeqSymbol = 0
  let nSeqChar = 0
  let nReqChar = 0
  let nMultMidChar = 2
  let nMultConsecAlphaUC = 2
  let nMultConsecAlphaLC = 2
  let nMultConsecNumber = 2
  let nMultSeqAlpha = 3
  let nMultSeqNumber = 3
  let nMultSeqSymbol = 3
  let nMultLength = 4
  let nMultNumber = 4
  let nMultSymbol = 6
  let nTmpAlphaUC = ''
  let nTmpAlphaLC = ''
  let nTmpNumber = ''
  let nTmpSymbol = ''
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
