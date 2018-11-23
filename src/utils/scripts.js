import { canUseDom } from './helpers'

const hasScriptWithSrc = (src) => {
  const scripts = document.getElementsByTagName('script')
  for (let i = 0; i < scripts.length; i += 1) {
    if (scripts[i].src === src) {
      return true
    }
  }
  return false
}

export const loadScript = ({ id, auth, preview }, dataLayerName, loadCallback) => {
  let src = `https://www.googletagmanager.com/gtm.js?id=${id}`
  if (auth) {
    src += `&gtm_auth=${auth}`
  }

  if (preview) {
    src += `&gtm_preview=${preview}`
  }

  if (hasScriptWithSrc(src)) {
    window[dataLayerName] = window[dataLayerName] || [];
    loadCallback();
    return
  }

  const script = document.createElement('SCRIPT')
  script.async = true
  script.src = src

  script.onload = () => {
    window[dataLayerName].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' })

    loadCallback()
  }

  script.onerror = () => {
    throw new Error('Google Tag Manager could not be loaded.')
  }

  document.head.appendChild(script)
}

export const loadNoScript = (gtmID) => {
  document.body.appendChild(`<iframe src="//www.googletagmanager.com/ns.html?id=${gtmID}"
        height="0" width="0" style="display:none;visibility:hidden" id="tag-manager"></iframe>`)
}

export default (gtm, dataLayerName, loadCallback) => {
  // Check if we can use the dom just to be sure
  if (canUseDom()) {
    loadScript(gtm, dataLayerName, loadCallback)
  }
}
