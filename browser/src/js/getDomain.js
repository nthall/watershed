export default function getDomain() {
  chrome.management.getSelf( (extensionInfo) => {
    if (extensionInfo.installType == "development") {
      return "https://watershed-dev.nthall.com/"
    } else {
      return "https://watershed.nthall.com/"
    }
  })
}
