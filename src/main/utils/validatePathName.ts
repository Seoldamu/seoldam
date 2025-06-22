const validateFileName = (fileName: string): { isValid: boolean; message?: string } => {
  // 빈 문자열 체크
  if (!fileName || fileName.trim() === '') {
    return { isValid: false, message: '이름을 입력해주세요' }
  }

  // 공통으로 금지된 문자 (null, 제어 문자)
  if (/[\x00-\x1f\x7f]/.test(fileName)) {
    return { isValid: false, message: '제어 문자는 사용할 수 없습니다' }
  }

  const platform = process.platform

  if (platform === 'win32') {
    // Windows 금지 문자: < > : " / \ | ? *
    const windowsInvalidChars = /[<>:"/\\|?*]/
    if (windowsInvalidChars.test(fileName)) {
      return {
        isValid: false,
        message: '파일명에 사용할 수 없는 문자가 포함되어 있습니다 (< > : " / \\ | ? *)'
      }
    }

    // Windows 예약어
    const reservedNames = /^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])(\.|$)/i
    if (reservedNames.test(fileName)) {
      return { isValid: false, message: 'Windows 시스템 예약어는 사용할 수 없습니다' }
    }

    // 끝에 점이나 공백 불가
    if (fileName.endsWith('.') || fileName.endsWith(' ')) {
      return { isValid: false, message: '파일명 끝에 점(.)이나 공백은 사용할 수 없습니다' }
    }
  } else if (platform === 'darwin') {
    // macOS 금지 문자: : (콜론)과 / (슬래시)
    // 참고: macOS Finder에서는 :를 /로 표시하고, /를 :로 내부 저장
    const macInvalidChars = /[:/]/
    if (macInvalidChars.test(fileName)) {
      return { isValid: false, message: '파일명에 콜론(:)과 슬래시(/)는 사용할 수 없습니다' }
    }

    // 점으로 시작하는 파일명 경고 (숨김 파일)
    if (fileName.startsWith('.')) {
      return { isValid: false, message: '점(.)으로 시작하는 파일명은 숨김 파일이 됩니다' }
    }
  } else {
    // Linux/Unix 계열 - 상대적으로 관대하지만 기본적인 제한
    const unixInvalidChars = /[/\x00]/
    if (unixInvalidChars.test(fileName)) {
      return { isValid: false, message: '파일명에 슬래시(/)와 null 문자는 사용할 수 없습니다' }
    }
  }

  // 파일명 길이 제한 (일반적으로 255자)
  if (fileName.length > 255) {
    return { isValid: false, message: '파일명이 너무 깁니다 (최대 255자)' }
  }

  return { isValid: true }
}

export default validateFileName
