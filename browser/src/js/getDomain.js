export default function getDomain() {
  return new Promise( (resolve, reject) => {
    chrome.management.getSelf( (extensionInfo) => {
      if (extensionInfo.installType == "development") {
        resolve("https://watershed-dev.nthall.com/")
      } else {
        resolve("https://watershed.nthall.com/")
      }
    })
  })
}
